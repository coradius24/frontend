import HeroBanner from "@/components/HeroBanner";
import Blog from "@/components/blog/Blog";
import "./page.css";

export const metadata = {
  title: "Blog | UpSpot Academy",
  description: ``,
  generator: "UpSpot Academy",
  applicationName: "UpSpot Academy",
  referrer: "origin-when-cross-origin",
  keywords: [
    "UpSpot Academy",
    "UpSpot Digital",
    "CPA Marketing",
    "Free CPA Marketing Scholarship",
    "CPA Marketing Free Class",
    "CPA Free Marketing",
  ],
  authors: [{ name: "Ashraful Islam" }],
  creator: "UpSpot Academy",
  publisher: "UpSpot Academy",
};

const Page = ({ searchParams }) => {
  const { page, limit } = searchParams;
  return (
    <>
      <HeroBanner className="blog-header">
        <div className="content center">
          <h1>আমাদের সমস্ত ব্লগগুলি পড়ুন </h1>
          <p>
            আমরা প্রতিটি ব্লগ পোস্টে মজার লেখা এবং মতামত অংশের মাধ্যমে আপনাদের
            সাথে আমাদের অভিজ্ঞতা, জ্ঞান, এবং নতুন ধারণা শেয়ার করতে চেষ্টা করি।
          </p>
        </div>
      </HeroBanner>
      <Blog className="blog-container" limit={limit || 12} page={page || 1} />
    </>
  );
};

export default Page;
