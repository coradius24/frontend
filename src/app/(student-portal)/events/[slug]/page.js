import HeroBanner from "@/components/HeroBanner";
import Payment from "@/components/home/Payment";
import { baseURL } from "@/services/api/apiService";
import galleryService from "@/services/galleryService";
import GalleryView from "./GalleryView";
import "./page.css";

export async function generateMetadata({ params, searchParams }) {
  const slug = params.slug;
  const event = await fetch(
    `${baseURL}/api/gallery/albums/${slug}/photos`
  ).then((res) => res.json());
  if (!event) {
    return {
      title: "Event Album",
      description: "UpSpot Academy",
      applicationName: "UpSpot Academy",
      authors: [{ name: "Ashraful Islam" }],
      creator: "UpSpot Academy",
      publisher: "UpSpot Academy",
    };
  }
  return {
    title: event.album.name,
    description: event.album.shortDescription,
    generator: "UpSpot Academy",
    applicationName: "UpSpot Academy",
    authors: [{ name: "Ashraful Islam" }],
    creator: "UpSpot Academy",
    publisher: "UpSpot Academy",
  };
}

const Page = async ({ params }) => {
  const data = await galleryService.getGallery(params.slug);
  if (data?.length === 0) return null;
  return (
    <>
      <HeroBanner className="event-header">
        <div className="content center">
          <h1>অফিসিয়াল ইভেন্ট ছবির গ্যালারি</h1>
          <p>{data.album.shortDescription}</p>
        </div>
      </HeroBanner>
      <div className="container">
        <GalleryView data={data} />
      </div>
      <Payment />
    </>
  );
};

export default Page;
