import Link from "next/link";

const EventIem = ({ event }) => {
  return (
    <div className="col-md-6 col-lg-4">
      <Link href="https://upspotacademy.com/events/album/Official%20Tour%20(2022)">
        <div className="card-blog">
          <div className="card-blog-body">
            <div
              className="blog-thumbnail"
              style={{
                backgroundImage: `url("${event.thumbnail}")`,
              }}
            />
            <div className="blog-placeholder">
              <h5 className="cart-blog-title">{event.title}</h5>
              <div className="d-flex">
                <div>{event.content}</div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventIem;
