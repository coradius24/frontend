"use client";
import { useRouter } from "next/navigation";

const EventItem = ({ item }) => {
  const { name, slug, thumbnail, imageCount } = item;
  const router = useRouter();
  return (
    <div className="event-item" onClick={() => router.push(`/events/${slug}`)}>
      <div className="event-item-content">
        <div
          className="image"
          style={{ backgroundImage: `url('${thumbnail}')` }}
        ></div>
        <div className="text-content">
          <h2>{name}</h2>
          <p>{imageCount || 0} টি-ছবি </p>
        </div>
      </div>
    </div>
  );
};

export default EventItem;
