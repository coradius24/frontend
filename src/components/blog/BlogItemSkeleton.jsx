import { Skeleton } from "@mui/material";

const BlogItemSkeleton = () => {
  return (
    <div className="blog-item">
      <div className="blog-content">
        <div className="blog-img">
            
            <Skeleton variant="rectangular" 
            height={299}
         />
        </div>
        <div className="blog-text-content">
          <div className="section-header-and-button d-flex">
          <div className="highlight-title">
              <Skeleton variant="rectangular" sx={{
                borderRadius: '100px'
              }} width={87} height={31} />

            </div>
            <div className="card-rating">
              <Skeleton variant="rectangular" width={60} height={20} />
            </div>
          </div>
          <h6>
            <Skeleton variant="rectangular"   />
            <Skeleton sx={{mt: 1}} variant="rectangular" width="80%"  />

          </h6>
          <p>
          <Skeleton sx={{mt: 3}} variant="rectangular"   />
          <Skeleton sx={{mt: 1}} variant="rectangular"   />

          </p>
          <Skeleton sx={{mt: 3}} variant="rectangular" width={100}  />

        </div>
      </div>
    </div>
  );
};

export default BlogItemSkeleton;
