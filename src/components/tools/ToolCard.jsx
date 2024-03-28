function ToolCard({ thumbnail, id, name, accessRestricted, link }) {
  return (
    <div className="col-sm-6 col-md-6 col-lg-4 col-xxl-3">
      <div className="course-box-wrap p-0">
        <div className="course-box p-0">
          <div className="course-image">
            <img src={thumbnail?.url || "/course_thumbnail_placeholder.jpg"} />
          </div>
          <div className="pb-2" id="course_info_view_3">
            <div className="course-details">
              <h5 className="title text-center">{name}</h5>
              <div className="col-md-12 px-4 py-1">
                {accessRestricted ? (
                  <button
                    data-toggle="tooltip"
                    data-placement="top"
                    style={{ opacity: "0.5" }}
                    className="btn red radius-5 w-100"
                    title=""
                    data-bs-original-title="You must clear your dues to access the tools."
                  >
                    <i className="fa fa-lock" aria-hidden="true" /> Locked
                  </button>
                ) : (
                  <a href={link} target="_blank">
                    <button className="btn red radius-5 w-100">
                      Get Access
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolCard;
