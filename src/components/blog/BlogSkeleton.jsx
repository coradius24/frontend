import LinkButton from "../button/LinkButton";

import "./blog.css";
import BlogItemSkeleton from "./BlogItemSkeleton";



const BlogSkeleton = async ({ isHome = false, className, limit = 3, page = 1 }) => {
  return (
    <section className={`${className} section-blog`}>
      <div className="section-blog-content container">
        {isHome && (
          <div className="section-header-and-button d-flex">
            <h2>আমাদের ব্লগগুলি পড়ুন</h2>
            <LinkButton text={"সকল ব্লগ পড়ুন"} url={"/blog"} />
          </div>
        )}
        <div className="blog-items d-flex">
          {Array.from(new Array(3))?.map((_, i) => (
            <BlogItemSkeleton key={i}  />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSkeleton;
