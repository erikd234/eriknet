import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlDir = path.join(__dirname, 'public', 'html');
const parsedDir = path.join(__dirname, 'public', 'parsed');
const manifestPath = path.join(__dirname, 'public', 'manifest.json');

// Ensure output directory exists
fs.mkdirSync(parsedDir, { recursive: true });

// Load manifest to get post metadata
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
const postMap = new Map(manifest.manifest.map(p => [String(p.postId), p]));

// Get all HTML files
const htmlFiles = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

// Small transparent images / tracking pixels / spacers to skip
function isSkippableImage(src) {
  if (!src) return true;
  // Skip tracking pixels, spacer images, tiny images
  if (src.includes('open.substack.com')) return true;
  if (src.includes('pixel')) return true;
  if (src.includes('spacer')) return true;
  if (src.includes('transparent')) return true;
  // Skip beehiiv logo/branding
  if (src.includes('beehiiv-logo')) return true;
  if (src.includes('powered-by')) return true;
  // Skip social media icons (tiny)
  if (src.includes('social-') || src.includes('icon-')) return true;
  return false;
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\u00a0/g, ' ')     // non-breaking spaces
    .replace(/\u200b/g, '')       // zero-width spaces
    .replace(/\u200c/g, '')       // zero-width non-joiner
    .replace(/\u200d/g, '')       // zero-width joiner
    .replace(/\u2060/g, '')       // word joiner
    .replace(/\ufeff/g, '')       // BOM
    .replace(/[\u2018\u2019]/g, "'")  // smart quotes
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2013/g, '-')     // en-dash
    .replace(/\u2014/g, '—')     // em-dash
    .replace(/\u2026/g, '...')   // ellipsis
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseHtml(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);
  const blocks = [];

  // Extract title from <h1> or <title>
  let title = cleanText($('h1').first().text());
  if (!title) {
    title = cleanText($('title').text());
  }

  // Find the content-blocks section
  let contentArea = $('#content-blocks');
  if (!contentArea.length) {
    // Fallback: find the main email body area
    contentArea = $('.email-card-body');
  }
  if (!contentArea.length) {
    // Last resort: use the whole body
    contentArea = $('body');
  }

  // Process each direct table row in content-blocks
  const rows = contentArea.find('> table > tbody > tr, > td > table > tbody > tr');

  // If content-blocks is a td, its children are the table>tbody>tr
  let contentRows;
  if (contentArea.is('td')) {
    contentRows = contentArea.find('> table > tbody > tr');
  } else {
    contentRows = contentArea.find('tr');
  }

  // Track what we've processed to avoid duplicates
  const processedTexts = new Set();
  const processedImages = new Set();

  contentRows.each((_, row) => {
    const $row = $(row);

    // Skip the row if it's inside a footer section
    if ($row.closest('.b').length || $row.closest('.f').length || $row.closest('.w').length) {
      return;
    }

    // Check for images
    const img = $row.find('img').first();
    if (img.length) {
      const src = img.attr('src') || '';
      const alt = img.attr('alt') || '';
      const width = parseInt(img.attr('width') || '0', 10);

      // Skip small images (likely icons/tracking), but keep content images
      if (!isSkippableImage(src) && width > 100 && !processedImages.has(src)) {
        processedImages.add(src);
        // Check for caption in adjacent .t cell
        const caption = cleanText($row.find('.t p').text() || $row.next().find('.t p').text());

        blocks.push({
          type: 'image',
          src: src,
          ...(alt && { alt }),
          ...(caption && { caption })
        });
        return;
      }
    }

    // Skip rows that are just image containers we already processed
    if ($row.find('img').length && !$row.find('p').length) return;

    // Check for caption rows (class="t") — skip standalone, they're attached to images
    if ($row.find('.t').length && !$row.hasClass('dd') && !$row.find('.dd').length) {
      return;
    }

    // Check for lists
    const ul = $row.find('ul');
    const ol = $row.find('ol');
    if (ul.length || ol.length) {
      const list = ul.length ? ul : ol;
      const items = [];
      list.find('li').each((_, li) => {
        const text = cleanText($(li).text());
        if (text) items.push(text);
      });
      if (items.length) {
        blocks.push({
          type: 'list',
          ordered: ol.length > 0,
          items
        });
      }
      return;
    }

    // Check for headings (h2-h6)
    for (let level = 2; level <= 6; level++) {
      const heading = $row.find(`h${level}`);
      if (heading.length) {
        const text = cleanText(heading.text());
        if (text) {
          blocks.push({ type: 'heading', level, text });
        }
        return;
      }
    }

    // Check for paragraphs
    const p = $row.find('p');
    if (p.length) {
      // Skip subtitle/header paragraphs (inside the header area before content-blocks)
      if ($row.closest('#content-blocks').length === 0 &&
          $row.closest('.email-card-body').length === 0) {
        return;
      }

      p.each((_, pEl) => {
        const text = cleanText($(pEl).text());
        // Skip empty, very short (likely spacers), or duplicate paragraphs
        if (!text || text.length < 2) return;
        // Skip "Subscribe" / "Share" / footer-like text
        if (/^(Subscribe|Share|Unsubscribe|View online|Powered by)$/i.test(text)) return;

        if (!processedTexts.has(text)) {
          processedTexts.add(text);

          // Detect if this paragraph is styled as a heading (large font-size or bold)
          const style = $(pEl).attr('style') || '';
          const fontSizeMatch = style.match(/font-size:\s*(\d+)px/);
          const fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1], 10) : 16;
          const isBold = style.includes('font-weight:bold') || style.includes('font-weight:Bold') ||
                         $(pEl).find('strong, b').length > 0 && $(pEl).find('strong, b').text().length === text.length;

          if (fontSize >= 24 && isBold) {
            blocks.push({ type: 'heading', level: 2, text });
          } else if (fontSize >= 20 && isBold) {
            blocks.push({ type: 'heading', level: 3, text });
          } else {
            blocks.push({ type: 'paragraph', text });
          }
        }
      });
    }
  });

  return { title, blocks };
}

// Parse all HTML files
let parsed = 0;
let errors = 0;

for (const file of htmlFiles) {
  const id = path.basename(file, '.html');
  const filePath = path.join(htmlDir, file);

  try {
    const result = parseHtml(filePath);
    const post = postMap.get(id);

    const output = {
      id: isNaN(Number(id)) ? id : Number(id),
      title: result.title || (post ? post.web_title : `Post ${id}`),
      blocks: result.blocks
    };

    const outputPath = path.join(parsedDir, `${id}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    parsed++;

    const imgCount = result.blocks.filter(b => b.type === 'image').length;
    const pCount = result.blocks.filter(b => b.type === 'paragraph').length;
    console.log(`✓ ${file} → ${id}.json (${pCount} paragraphs, ${imgCount} images, ${result.blocks.length} total blocks)`);
  } catch (err) {
    errors++;
    console.error(`✗ ${file}: ${err.message}`);
  }
}

// Update manifest with parsedPath
for (const entry of manifest.manifest) {
  const id = String(entry.postId);
  const parsedFile = path.join(parsedDir, `${id}.json`);
  if (fs.existsSync(parsedFile)) {
    entry.parsedPath = `${id}.json`;
  }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

console.log(`\nDone: ${parsed} parsed, ${errors} errors`);
console.log(`Manifest updated with parsedPath fields`);
