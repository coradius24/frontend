import AppPdfViewer from "@/components/AppPdfViewer";
import certificateService from "@/services/certificateService";
import { BiError } from "react-icons/bi";
import { FaCertificate } from "react-icons/fa";
import "./certificate.css";

export const metadata = {
  title: "Certificate",
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

async function Page({ params }) {
  let pdfUrl;
  try {
    const data = await certificateService.validateCertificate(
      params.cerdentialId
    );

    pdfUrl = data?.file?.url;
  } catch (error) {}

  return (
    <div className="certificate-page  rainbow-banner">
      <div className="ellipse-top-corner"></div>
      <div className="ellipse-right"></div>
      <div className="icon-wrapper">
        {pdfUrl ? (
          <FaCertificate className="text-primary" />
        ) : (
          <BiError color="#ff9800" size={130} />
        )}
      </div>
      {pdfUrl ? (
        <h4>
          <span className="text-primary">আপস্পট একাডেমি -</span> সার্টিফিকেট
        </h4>
      ) : (
        <h4>
          <span className="text-primary">এটি আপস্পট একাডেমির -</span>{" "}
          সার্টিফিকেট নয়
        </h4>
      )}

      <div className="container">
        <div className="ellipse-top"></div>
        <div className="ellipse-top-right"></div>
        {pdfUrl && <AppPdfViewer pdfUrl={pdfUrl} />}
      </div>
    </div>
  );
}

export default Page;
