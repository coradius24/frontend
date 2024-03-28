
import { Skeleton } from "@mui/material";
import "./courseItem.css";
const CourseItemSkeleton = ({ course = {} }) => {

  return (
    <div className="courses-card courses-card-vertical">
      <div className="courses-card-image">
       
        <Skeleton variant="rectangular" 
         height={214}
         />
      </div>
      <div className="courses-card-text">
        <div>
          <div style={{
            marginTop: '-10px'
          }} className="courses-card-header">
             <div  className="highlight-title">
                <Skeleton variant="rectangular" sx={{
                  // borderRadius: '100px',
                  ml: '-10px'
                }}  height={25} />

            
            </div>
            {/* <div className="card-rating">
              <Skeleton variant="rectangular" width={40} height={15} />
            </div> */}
          </div>
          <div className="courses-card-title">
            <Skeleton variant="rectangular"  />
            <Skeleton variant="rectangular" sx={{mt:'5px'}} width={'40%'} />

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
            <Skeleton width="50px" height="20px" />

          </div>
          <Skeleton sx={{
            borderRadius: '20px'
          }} width="120px" height="50px" />

        </div>
      </div>
    </div>
  );
};

export default CourseItemSkeleton;
