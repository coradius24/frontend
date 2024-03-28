import blogService from "@/services/blogService";
import LinkButton from "../button/LinkButton";
import BlogPage from "./BlogPage";
import HomePageBlog from "./HomePageBlog";
import "./blog.css";

const getBLogs = async (limit, page) => {
  try {
    return await blogService.getBlogs(`page=${page}&limit=${limit}`);
  } catch (error) {}
};

const Blog = async ({ isHome = false, className='', limit = 3, page = 1 }) => {
  const blogs = await getBLogs(limit, page);
  if(blogs?.totalCount === 0) return null
  return (
    <section className={`${className} section-blog`}>
      <div className="section-blog-content container">
        {isHome && (
          <div className="section-header-and-button d-flex">
            <h2>আমাদের ব্লগগুলি পড়ুন</h2>
            <LinkButton text={"সকল ব্লগ পড়ুন"} url={"/blog"} />
          </div>
        )}
        {isHome ? (
          <HomePageBlog blogs={blogs.results} />
        ) : (
          <BlogPage blogs={blogs} pageLimit={limit} currentPage={page} />
        )}
      </div>
    </section>
  );
};

export default Blog;
