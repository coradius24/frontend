import HeroBanner from "@/components/HeroBanner";
import cmsService from "@/services/cmsService";
import "./page.css";

const Page = async () => {
  let content = {};
  try {
    const response = await cmsService.getPageContent("refund-policy");
    if (response && response?.id) {
      content = { ...response.content };
    }
    if (response) console.log(response);
  } catch (error) {}

  return (
    <>
      <HeroBanner className="privacy-policy">
        <div className="content center">
          <h1>{content.title || `আমাদের প্রাইভেসি পলিসি`}</h1>
          <p>{content.subtitle}</p>
        </div>
      </HeroBanner>
      <section className="privacy-policy container">
        {content.content && (
          <div dangerouslySetInnerHTML={{ __html: content.content }}></div>
        )}
      </section>
    </>
  );
};

export default Page;
