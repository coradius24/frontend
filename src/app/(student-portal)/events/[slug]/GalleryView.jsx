"use client";
import { checkLang } from "@/utils/lib";
import Image from "next/image";
import { useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const GalleryView = ({ data }) => {
  const [images, setImages] = useState(() => {
    return data.results.map((item) => ({ ...item, imageUrl: item.photo.url }));
  });

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");

  const slides = images.map((item) => ({
    ...item,
    src: item.imageUrl,
    width: 3840,
    height: 2560,
    srcSet: [
      { src: item.imageUrl, width: 320, height: 213 },
      { src: item.imageUrl, width: 640, height: 426 },
      { src: item.imageUrl, width: 1200, height: 800 },
      { src: item.imageUrl, width: 2048, height: 1365 },
      { src: item.imageUrl, width: 3840, height: 2560 },
    ],
  }));

  if (data.totalCount <= 0) {
    return (
      <p className="center no-image" data-lang="eng">
        No images in this gallery
      </p>
    );
  }

  return (
    <>
      <div className="gallery-view-title flex">
        <h2 data-lang={checkLang(data.album.name)}>{data.album.name}</h2>
      </div>
      <div className="gallery-view flex">
        {slides.map((item) => (
          <div
            key={item.id}
            className="image"
            onClick={() => {
              setOpen(true);
              setImage(item.src);
            }}
          >
            <Image
              title={item.caption}
              src={item.src}
              alt={item.caption}
              height={230}
              width={372}
            />
          </div>
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        plugins={[Zoom, Thumbnails]}
        showPrevNext={false}
        slides={slides}
      />
    </>
  );
};

export default GalleryView;
