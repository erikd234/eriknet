import { forwardRef } from "react";

const posts = [
  {
    id: 1,
    title: "Boost your conversion rate",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel iusto corrupti dicta laboris incididunt.",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Greece", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  // More posts...
];

const BlogCard = forwardRef(
  (
    {
      postId,
      iframeUrl,
      selected,
      mainHeader,
      subHeader,
      thumbnailUrl,
      onSelection,
    },
    ref
  ) => {
    const handleSelection = (e) => {
      console.log("fromBlogCard ", iframeUrl);
      onSelection(e, postId, iframeUrl);
    };
    const post = posts[0];
    return (
      <div
        className={`
        w-full 
        p-8 
        ${selected ? "border-solid border-2 border-blue-400" : ""}
        `}
      >
        <article
          className="relative isolate flex flex-col gap-8 lg:flex-row hover:cursor-pointer"
          onClick={handleSelection}
          ref={ref}
        >
          <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
            <img
              alt=""
              src={thumbnailUrl}
              className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
          </div>
          <div>
            <div className="flex items-center gap-x-4 text-xs">
              <time dateTime={post.datetime} className="text-gray-500">
                {post.date}
              </time>
              <a
                href={post.category.href}
                className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
              >
                {post.category.title}
              </a>
            </div>
            <div className="group relative max-w-xl">
              <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                <a href={post.href}>
                  <span className="absolute inset-0" />
                  {mainHeader}
                </a>
              </h3>
              <p className="mt-5 text-sm leading-6 text-gray-600">
                {subHeader}
              </p>
            </div>
            <div className="mt-6 flex border-t border-gray-900/5 pt-6">
              <div className="relative flex items-center gap-x-4">
                <img
                  alt=""
                  src="https://media.beehiiv.com/cdn-cgi/image/format=auto,width=400,height=211,fit=scale-down,onerror=redirect/uploads/user/profile_picture/28d72229-3509-4127-a360-5d8d85b30fd1/IMG_6398.jpeg"
                  className="h-10 w-10 rounded-full bg-gray-50"
                />
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900">
                    <a href={post.author.href}>
                      <span className="absolute inset-0" />
                      Erik Dahl
                    </a>
                  </p>
                  <p className="text-gray-600">Bike Man</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }
);

export default BlogCard;
