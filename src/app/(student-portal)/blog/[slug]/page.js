import blogPlaceholder from "@/../public/blog-placeholder.png";
import HeroBanner from "@/components/HeroBanner";
import SidebarAdd from "@/components/add-banner/SidebarAdd";
import { Button } from "@/components/button/LinkButton";
import CourseBanner from "@/components/home/CourseBanner";
import Payment from "@/components/home/Payment";
import blogService from "@/services/blogService";
import { formatBlogDate } from "@/utils/lib";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineMessage } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa6";
import "./page.css";

const Page = async ({ params }) => {
  const details = await blogService.getBlogDetails(params.slug);
  const { title, body, createdAt, author, thumbnail, category } = details;
  return (
    <>
      <HeroBanner className="blog-details"></HeroBanner>
      <section className="blog-details-content">
        <div className="blog-details-header">
          <div className="container">
            <div className="content center">
              <h1>{title}</h1>
              <p>
                গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন একটি গুরুত্বপূর্ণ
                প্রস্তাবনা, যা ডিজাইনারদের কাজে গুরুত্ব দেয় এবং তাদের সৃজনশীলতা
                এবং নির্মাণ প্রক্রিয়ার সাথে সাথে পাশে থাকে। গাইডলাইনগুলি
                গ্রাফিক্স ডিজাইন প্রক্রিয়ায় সুস্থ, ইউনিফর্ম এবং কার্যকরী
                ডিজাইনের সৃজনে সাহায্য করে।
              </p>
            </div>
            <hr />
            <div className="blog-details-content flex">
              <div className="left-sidebar">
                <div className="header-bottom flex">
                  <div className="highlight-title">
                    <Link
                      href={"#"}
                      scroll={false}
                      style={{ color: category?.colorCode }}
                    >
                      {category?.name}
                    </Link>
                    <div
                      className="highlight"
                      style={{ background: category?.colorCode }}
                    ></div>
                  </div>
                  <span className="publish-date">
                    Published: {formatBlogDate(createdAt, false)}
                  </span>
                </div>
                <div className="content">
                  <div className="blog-thumbnail">
                    <Image
                      alt={title}
                      width={810}
                      height={528}
                      src={thumbnail || blogPlaceholder}
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                    />
                  </div>
                  <h2>{title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: body }}></div>
                </div>
                <div className="blog-author">
                  <div className="author-aria flex">
                    <div className="avatar">
                      <Image
                        height={106}
                        width={106}
                        alt="instructor name"
                        src={"/user.png"}
                      />
                    </div>
                    <div className="author-details">
                      <div className="author-details-header flex">
                        <h5>{author.fullName}</h5>
                        <div className="author-details-socials flex">
                          <div className="social-item">
                            <FaFacebookF />
                          </div>
                          <div className="social-item">
                            <FaFacebookF />
                          </div>
                          <div className="social-item">
                            <FaFacebookF />
                          </div>
                        </div>
                      </div>
                      <span>About me</span>
                      <div
                        dangerouslySetInnerHTML={{ __html: author.biography }}
                      />
                    </div>
                  </div>
                </div>
                <div className="comment-aria">
                  <div className="comment-item">
                    <div className="comment-header flex">
                      <div className="comment-avatar">
                        <Image
                          height={74}
                          width={74}
                          alt="user"
                          src={"/user.png"}
                        />
                      </div>
                      <div className="comment-user">
                        <h5>Dianne Russell</h5>
                        <span>3 Hours Ago</span>
                      </div>
                    </div>
                    <div className="comment-body">
                      <p>
                        More academics should blog, post videos, post audio,
                        post lectures, offer articles and more. You'll enjoy it:
                        I've had threats and blackmail, abuse, smears and formal
                        complaints with forged documentation.
                      </p>
                    </div>
                  </div>
                  <div className="comment-box">
                    <textarea
                      placeholder="আপনার মেসেজটি লিখুন "
                      name="comment"
                      id="comment"
                      rows="5"
                      style={{ width: "100%" }}
                    ></textarea>
                    <div className="comment-icon">
                      <AiOutlineMessage size={22} />
                    </div>
                    <Button
                      className="comment-submit"
                      type="submit"
                      text={"সাবমিট করুন"}
                    />
                  </div>
                </div>
              </div>
              <div className="right-sidebar">
                <div className="recent-blogs">
                  <h3>সাম্প্রতিক ব্লগগুলি </h3>
                  <hr />
                  <div className="recent-blogs-container">
                    <div className="recent-blog-item flex">
                      <div className="img">
                        <Image
                          width={156}
                          height={140}
                          src={"/blog-placeholder.png"}
                          alt="test"
                        />
                      </div>
                      <div className="recent-blog-item-content">
                        <div className="top flex">
                          <div className="highlight-title">
                            <Link
                              href={"#"}
                              scroll={false}
                              style={{ color: "#ec4545" }}
                            >
                              গ্রাফিক্স ডিজাইন ব্লগ
                            </Link>
                            <div
                              className="highlight"
                              style={{ background: "#ec4545" }}
                            ></div>
                          </div>
                          <span className="publish-date">
                            {formatBlogDate(createdAt, false)}
                          </span>
                        </div>
                        <hr />
                        <h4>গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন</h4>
                        <p>
                          গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন একটি গুরুত্বপূর্ণ
                          প্রস্তাবনা, যা ডিজাইনারদের কাজে গুরুত্ব দেয় এবং তাদের
                        </p>
                      </div>
                    </div>
                    <div className="recent-blog-item flex">
                      <div className="img">
                        <Image
                          width={156}
                          height={140}
                          src={"/blog-placeholder.png"}
                          alt="test"
                        />
                      </div>
                      <div className="recent-blog-item-content">
                        <div className="top flex">
                          <div className="highlight-title">
                            <Link
                              href={"#"}
                              scroll={false}
                              style={{ color: "#ec4545" }}
                            >
                              গ্রাফিক্স ডিজাইন ব্লগ
                            </Link>
                            <div
                              className="highlight"
                              style={{ background: "#ec4545" }}
                            ></div>
                          </div>
                          <span className="publish-date">
                            {formatBlogDate(createdAt, false)}
                          </span>
                        </div>
                        <hr />
                        <h4>গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন</h4>
                        <p>
                          গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন একটি গুরুত্বপূর্ণ
                          প্রস্তাবনা, যা ডিজাইনারদের কাজে গুরুত্ব দেয় এবং তাদের
                        </p>
                      </div>
                    </div>
                    <div className="recent-blog-item flex">
                      <div className="img">
                        <Image
                          width={156}
                          height={140}
                          src={"/blog-placeholder.png"}
                          alt="test"
                        />
                      </div>
                      <div className="recent-blog-item-content">
                        <div className="top flex">
                          <div className="highlight-title">
                            <Link
                              href={"#"}
                              scroll={false}
                              style={{ color: "#ec4545" }}
                            >
                              গ্রাফিক্স ডিজাইন ব্লগ
                            </Link>
                            <div
                              className="highlight"
                              style={{ background: "#ec4545" }}
                            ></div>
                          </div>
                          <span className="publish-date">
                            {formatBlogDate(createdAt, false)}
                          </span>
                        </div>
                        <hr />
                        <h4>গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন</h4>
                        <p>
                          গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন একটি গুরুত্বপূর্ণ
                          প্রস্তাবনা, যা ডিজাইনারদের কাজে গুরুত্ব দেয় এবং তাদের
                        </p>
                      </div>
                    </div>
                    <div className="recent-blog-item flex">
                      <div className="img">
                        <Image
                          width={156}
                          height={140}
                          src={"/blog-placeholder.png"}
                          alt="test"
                        />
                      </div>
                      <div className="recent-blog-item-content">
                        <div className="top flex">
                          <div className="highlight-title">
                            <Link
                              href={"#"}
                              scroll={false}
                              style={{ color: "#ec4545" }}
                            >
                              গ্রাফিক্স ডিজাইন ব্লগ
                            </Link>
                            <div
                              className="highlight"
                              style={{ background: "#ec4545" }}
                            ></div>
                          </div>
                          <span className="publish-date">
                            {formatBlogDate(createdAt, false)}
                          </span>
                        </div>
                        <hr />
                        <h4>গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন</h4>
                        <p>
                          গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন একটি গুরুত্বপূর্ণ
                          প্রস্তাবনা, যা ডিজাইনারদের কাজে গুরুত্ব দেয় এবং তাদের
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sidebar-add">
                  <SidebarAdd />
                </div>
                <div className="recent-blogs">
                  <h3>সাম্প্রতিক ব্লগগুলি </h3>
                  <hr />
                  <div className="recent-blogs-container">
                    <div className="recent-blog-item flex">
                      <div className="img">
                        <Image
                          width={156}
                          height={140}
                          src={"/blog-placeholder.png"}
                          alt="test"
                        />
                      </div>
                      <div className="recent-blog-item-content">
                        <div className="top flex">
                          <div className="highlight-title">
                            <Link
                              href={"#"}
                              scroll={false}
                              style={{ color: "#ec4545" }}
                            >
                              গ্রাফিক্স ডিজাইন ব্লগ
                            </Link>
                            <div
                              className="highlight"
                              style={{ background: "#ec4545" }}
                            ></div>
                          </div>
                          <span className="publish-date">
                            {formatBlogDate(createdAt, false)}
                          </span>
                        </div>
                        <hr />
                        <h4>গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন</h4>
                        <p>
                          গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন একটি গুরুত্বপূর্ণ
                          প্রস্তাবনা, যা ডিজাইনারদের কাজে গুরুত্ব দেয় এবং তাদের
                        </p>
                      </div>
                    </div>
                    <div className="recent-blog-item flex">
                      <div className="img">
                        <Image
                          width={156}
                          height={140}
                          src={"/blog-placeholder.png"}
                          alt="test"
                        />
                      </div>
                      <div className="recent-blog-item-content">
                        <div className="top flex">
                          <div className="highlight-title">
                            <Link
                              href={"#"}
                              scroll={false}
                              style={{ color: "#ec4545" }}
                            >
                              গ্রাফিক্স ডিজাইন ব্লগ
                            </Link>
                            <div
                              className="highlight"
                              style={{ background: "#ec4545" }}
                            ></div>
                          </div>
                          <span className="publish-date">
                            {formatBlogDate(createdAt, false)}
                          </span>
                        </div>
                        <hr />
                        <h4>গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন</h4>
                        <p>
                          গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন একটি গুরুত্বপূর্ণ
                          প্রস্তাবনা, যা ডিজাইনারদের কাজে গুরুত্ব দেয় এবং তাদের
                        </p>
                      </div>
                    </div>
                    <div className="recent-blog-item flex">
                      <div className="img">
                        <Image
                          width={156}
                          height={140}
                          src={"/blog-placeholder.png"}
                          alt="test"
                        />
                      </div>
                      <div className="recent-blog-item-content">
                        <div className="top flex">
                          <div className="highlight-title">
                            <Link
                              href={"#"}
                              scroll={false}
                              style={{ color: "#ec4545" }}
                            >
                              গ্রাফিক্স ডিজাইন ব্লগ
                            </Link>
                            <div
                              className="highlight"
                              style={{ background: "#ec4545" }}
                            ></div>
                          </div>
                          <span className="publish-date">
                            {formatBlogDate(createdAt, false)}
                          </span>
                        </div>
                        <hr />
                        <h4>গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন</h4>
                        <p>
                          গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন একটি গুরুত্বপূর্ণ
                          প্রস্তাবনা, যা ডিজাইনারদের কাজে গুরুত্ব দেয় এবং তাদের
                        </p>
                      </div>
                    </div>
                    <div className="recent-blog-item flex">
                      <div className="img">
                        <Image
                          width={156}
                          height={140}
                          src={"/blog-placeholder.png"}
                          alt="test"
                        />
                      </div>
                      <div className="recent-blog-item-content">
                        <div className="top flex">
                          <div className="highlight-title">
                            <Link
                              href={"#"}
                              scroll={false}
                              style={{ color: "#ec4545" }}
                            >
                              গ্রাফিক্স ডিজাইন ব্লগ
                            </Link>
                            <div
                              className="highlight"
                              style={{ background: "#ec4545" }}
                            ></div>
                          </div>
                          <span className="publish-date">
                            {formatBlogDate(createdAt, false)}
                          </span>
                        </div>
                        <hr />
                        <h4>গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন</h4>
                        <p>
                          গ্রাফিক্স ডিজাইন পূর্ণাঙ্গ গাইডলাইন একটি গুরুত্বপূর্ণ
                          প্রস্তাবনা, যা ডিজাইনারদের কাজে গুরুত্ব দেয় এবং তাদের
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CourseBanner />
      <Payment />
    </>
  );
};

export default Page;
