// Code takes beehiive code and makes Erik's custom html for his website
// eventually we will have a good copy of the html and erik can go in and modify each page
// Future it would be nice to decouple the individual files to a more standard template, same fonts,
// shared styles. Maybe I can play around with sharing styles.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import { JSDOM } from "jsdom";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const results = [];

const outputJsonDir = path.resolve(__dirname, "public/posts");
const outputHtmlDir = path.resolve(__dirname, "public/html");
const outputManiftestDir = path.resolve(__dirname, "public");

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const cleanHtmlContent = (htmlContent) => {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // Remove elements with selector "td.f"
  const elementsToRemove = document.querySelectorAll("td.f");
  elementsToRemove.forEach((element) => element.remove());

  // Remove text with "{{OPEN_TRACKING_PIXEL}}"
  document.body.innerHTML = document.body.innerHTML.replace(
    /{{OPEN_TRACKING_PIXEL}}/g,
    ""
  );

  // Remove element with the specific selector
  const specificElement = document.querySelector(
    "body > div > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(6) > td > table > tbody"
  );
  // Remove element with the specific selector
  const socialTags = document.querySelector(
    "body > div > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody"
  );
  if (specificElement) {
    specificElement.remove();
  }
  if (socialTags) {
    socialTags.remove();
  }

  return dom.serialize();
};

// If we didnt have an number give it a random number and I will fix it
const extractNumberFromTitle = (title) => {
  const match = title.match(/#(\d+)/);
  return match ? match[1] : Math.floor(Math.random() * 100000) + 1;
};

// returns the manifest object,
// {
//    postId: 1
//    postPath: posts/1.json
//    htmlPath: html/1.json
// }
const writePostToFile = (post) => {
  const cleanedHtml = cleanHtmlContent(post.content_html);
  const postNumber = extractNumberFromTitle(post.web_title);
  const jsonFilePath = path.join(outputJsonDir, `${postNumber}.json`);
  // used to delete content_html from the post when writing to json
  const { content_html, ...postWithoutContentHtml } = post;
  fs.writeFileSync(
    jsonFilePath,
    JSON.stringify(postWithoutContentHtml, null, 2)
  );

  const htmlFilePath = path.join(outputHtmlDir, `${postNumber}.html`);
  fs.writeFileSync(htmlFilePath, cleanedHtml);
  return {
    postId: postNumber,
    web_title: post.web_title,
    thumbnail: post.thumbnail_url,
    subtitle: post.web_subtitle, // this is also the date for most of the posts.
    postPath: `${postNumber}.json`,
    htmlPath: `${postNumber}.html`,
  };
};

ensureDirectoryExists(outputJsonDir);
ensureDirectoryExists(outputHtmlDir);
ensureDirectoryExists(outputManiftestDir);

const postManifest = { manifest: [] };
fs.createReadStream(
  path.resolve(__dirname, "posts-2024-05-2620240526-2-7o72gy.csv")
)
  .pipe(csv())
  .on("data", (data) => {
    const post = {
      id: data.id,
      web_title: data.web_title,
      status: data.status,
      web_audiences: data.web_audiences,
      url: data.url,
      web_subtitle: data.web_subtitle,
      email_subject_line: data.email_subject_line,
      email_preview_text: data.email_preview_text,
      content_html: data.content_html,
      thumbnail_url: data.thumbnail_url,
      created_at: data.created_at,
    };
    let manifestEntry;
    if (post.status != "draft") {
      results.push(post);
      manifestEntry = writePostToFile(post);
      postManifest.manifest.push(manifestEntry);
    }
  })
  .on("end", () => {
    console.log("All posts have been processed and written to files.");
    const manifestPath = path.join(outputManiftestDir, `manifest.json`);
    postManifest.manifest.sort((a, b) => a.postId - b.postId);
    fs.writeFileSync(manifestPath, JSON.stringify(postManifest, null, 2));
  });
