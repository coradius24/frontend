import { checkLang, formatBlogDate } from "@/utils/lib";
import Image from "next/image";
import Link from "next/link";

const BlogItem = ({ item }) => {
  const { category, title, body, slug, thumbnail, createdAt } = item || {};
  return (
    <div className="blog-item">
      <div className="blog-content">
        <div className="blog-img">
          <Link href={`/blog/${slug}`}>
            {" "}
            <Image
              src={thumbnail || "/blog-placeholder.png"}
              width={420}
              height={299}
              alt={title}
            />
          </Link>
        </div>
        <div className="blog-text-content">
          <div className="section-header-and-button d-flex">
            <div className="highlight-title">
              <span
                data-lang={checkLang(category.name)}
                style={{ color: category.colorCode }}
              >
                {category.name}
              </span>
              <div
                className="highlight"
                style={{ background: category.colorCode }}
              ></div>
            </div>
            <span>{formatBlogDate(createdAt, false)}</span>
          </div>
          <h6>
            <Link href={`/blog/${slug}`}>
              <div dangerouslySetInnerHTML={{ __html: title }} />
            </Link>
          </h6>
          <p>{body}</p>
          <Link href={`/blog/${slug}`} className="d-flex">
            বিস্তারিত পড়ুন
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10.8333 5.8335L15 10.0002M15 10.0002L10.8333 14.1668M15 10.0002H5"
                stroke="#19891C"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
