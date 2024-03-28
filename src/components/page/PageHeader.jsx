import Link from "next/link";
import "./pageHeader.css";

const PageHeader = ({ imageUrl, linkUrl = "", linkText, className }) => {
  let sectionStyle = {};
  if (imageUrl) {
    sectionStyle = {
      backgroundImage: `url("${imageUrl || ""}")`,
      backgroundSize: "cover",
      backgroundPosition: "right",
    };
  }

  const classes = `category-header-area ${className || ""}`;
  return (
    <section className={classes} style={sectionStyle}>
      <div className="image-placeholder-3" />
      <div className="container-lg breadcrumb-container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            {linkUrl && (
              <li className="breadcrumb-item display-6 fw-bold">
                <Link href={linkUrl}>Home</Link>
              </li>
            )}
            <li className="breadcrumb-item active text-light display-6 fw-bold">
              {linkText}
            </li>
          </ol>
        </nav>
      </div>
    </section>
  );
};

export default PageHeader;
