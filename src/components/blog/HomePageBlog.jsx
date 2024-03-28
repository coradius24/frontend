import BlogItem from "./BlogItem";

const HomePageBlog = ({ blogs }) => {
  return (
    <div className="blog-items d-flex">
      {blogs?.map((item) => (
        <BlogItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default HomePageBlog;
