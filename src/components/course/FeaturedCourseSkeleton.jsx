import { checkLang, formatNumber, minutesToHours } from "@/utils/lib";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import StarRating from "../StarRating";
import CardButton from "./CardButton";
import "./feature-course.css";
const FeaturedCourseSkeleton = ({ custom = false , hideShortDescription}) => {
  
  return (
    <div className={`courses-card feature-course_item flex  ${hideShortDescription ? '' : ' with-description'} `}>
      <div className="courses-card-image">
        {custom ? (
         
          <Skeleton sx={{
            borderRadius: '14px'
          }} variant="rectangular" width={302}
          height={274} />

        ) : (
          <Skeleton sx={{
            borderRadius: '14px',
            height: '240px',
            '@media (min-width:600px)': {
              height: '384px',
            },
          }}
         variant="rectangular" width={638}
           />
          
        )}

        <div className="image-overlay">
          <div className="overlay-badge">
            <p className="overlay-badge-text">ফিচার্ড কোর্স</p>
          </div>
          
        </div>
      </div>
      <div className="courses-card-text">
        <div>
          <div className="courses-card-header">
            <div className="highlight-title">
              <Skeleton variant="rectangular" sx={{
                borderRadius: '100px'
              }} width={87} height={31} />

            </div>
            <div className="card-rating">
              <Skeleton variant="rectangular" width={60} height={20} />
            </div>
          </div>
          <div className="courses-card-title">
            <Skeleton />

            {hideShortDescription ||  <p style={{lineHeight: '22px', fontSize: '14px'}}>
            <Skeleton />
            <Skeleton width="90%" />
            <Skeleton width="87%" />
            {/* <Skeleton width="59%" /> */}

              </p>}
           
          </div>
          {/* <div className="courses-card-info">
            <div className="card-info-time">
             <Skeleton width="120px" />
            </div>
            <div className="card-info-time">
              <Skeleton width="120px" />

            </div>
          </div> */}
        </div>

        <div className="courses-card-price">
          <div className="card-price">
            <Skeleton width="100px" height="30px" />

          </div>
          <Skeleton sx={{
            borderRadius: '30px'
          }} width="130px" height="70px" />

        </div>
      </div>
    </div>
  );
};

export default FeaturedCourseSkeleton;
