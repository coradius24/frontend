import PageHeader from "@/components/page/PageHeader";

export const metadata = {
  title: "Contact Us",
  description: `Upspot Academy Student Certificate verification`,
  generator: "UpSpot Academy",
  applicationName: "UpSpot Academy",
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

const Contact = () => {
  return (
    <>
      <PageHeader linkUrl="/" linkText={"Contact Us"} className={"bg-blue"} />
      <div className="container-xl pt-4">
        <h1 className="text-center">
          <strong>Contact Us</strong>
        </h1>
        <address>
          <h4>
            <p className="text-center">
              <span style={{ fontSize: "1.125rem", color: "rgb(0, 0, 0)" }}>
                Address:&nbsp;
                <span
                  style={{ fontWeight: "normal", color: "rgb(25, 137, 28)" }}
                >
                  2nd Floor, House 25, Road 5, Sector 6, Uttara, Dhaka-1230
                </span>
              </span>
            </p>
          </h4>
        </address>
        <h5 className="text-center">
          Mobile:&nbsp;
          <a href="tel:+8801321146224" style={{ color: "rgb(25, 137, 28)" }}>
            01321146224
          </a>
          &nbsp;,&nbsp;
          <a href="tel:+8801321146225" style={{ color: "rgb(25, 137, 28)" }}>
            01321146225
          </a>
        </h5>
        <div className="text-center">
          <span
            style={{
              fontSize: "1.125rem",
              color: "rgb(0, 0, 0)",
              fontWeight: "bold",
            }}
          >
            Email:&nbsp;
          </span>
          <a
            href="mailto:info@upspotacademy.com"
            style={{
              fontSize: "1.125rem",
              backgroundColor: "rgb(255, 255, 255)",
              color: "rgb(25, 137, 28)",
            }}
          >
            info@upspotacademy.com
          </a>
        </div>
        <div className="text-center">
          <span style={{ color: "rgb(0, 0, 0)", fontSize: "0.875rem" }} />
        </div>

        <div className="text-center my-4 pb-3">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.4460269832907!2d90.4029388759676!3d23.873797584026686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c59353cf7b7f%3A0x876b984f52a12cc9!2sUpSpot%20Digital!5e0!3m2!1sbn!2sbd!4v1688814519997!5m2!1sbn!2sbd"
            width="100%"
            height={450}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </>
  );
};

export default Contact;
