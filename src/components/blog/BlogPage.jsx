"use client";
import { useQueryState } from "next-usequerystate";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CourseBanner from "../home/CourseBanner";
import CustomPagination from "../pagination/CustomPagination";
import BlogItem from "./BlogItem";

const BlogPage = ({ blogs, currentPage, pageLimit }) => {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", { defaultValue: 1 });
  const [limit, setLimit] = useQueryState("limit", { defaultValue: 12 });

  useEffect(() => {
    setPage(currentPage);
    setLimit(pageLimit);
  }, []);

  const pageHandler = (selected) => {
    setPage(() => parseInt(selected + 1));
    router.push(`/blog?page=${selected + 1}&limit=${limit}`, {});
  };

  return (
    <>
      {blogs?.results?.length > 6 ? (
        <>
          <div className="blog-items d-flex">
            {blogs.results.slice(0, 6).map((item) => (
              <BlogItem key={item.id} item={item} />
            ))}
          </div>
          <div className="blog-page-banner">
            <CourseBanner />
          </div>
          <div className="blog-items d-flex">
            {blogs.results.slice(6).map((item) => (
              <BlogItem key={item.id} item={item} />
            ))}
          </div>
        </>
      ) : (
        <div className="blog-items d-flex">
          {blogs.results.map((item) => (
            <BlogItem key={item.id} item={item} />
          ))}
        </div>
      )}
      <CustomPagination
        totalCount={blogs.totalCount}
        currentPage={page}
        itemsPerPage={parseInt(pageLimit || 12)}
        pageHandler={pageHandler}
      />
    </>
  );
};

export default BlogPage;
