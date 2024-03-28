import { baseURL } from "@/services/api/apiService";
import { Skeleton, Stack } from "@mui/material";
import "./instructor-item.css";
import "./instructor.css";



const InstructorSkeleton =  () => {
  
  return (
    <section className="section-mentor">
      <div className="mentor-content container">
        <div className="section-header-and-button d-flex">
          <h2>
            আমাদের <span className="text-primary">অভিজ্ঞ মেন্টর</span>
          </h2>
          <Stack direction="row" spacing={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />

          </Stack>
        </div>
        <div className="skeleton-mentor-image-cards">
          {Array.from(new Array(4)).map((_,i)=> <Skeleton key={i} variant="rectangular" sx={{borderRadius: '20px'}}  height={400} />)}
          {/* <InstructorSkeletonSlider data={data} /> */}
        </div>
      </div>
    </section>
  );
};

export default InstructorSkeleton;
