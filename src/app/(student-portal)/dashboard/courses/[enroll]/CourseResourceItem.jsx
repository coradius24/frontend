import "./resource.css";

const CourseResourceItem = ({ icon, children, className = "", ...rest }) => {
  return (
    <div className={`tools-item flex ${className}`} {...rest}>
      <div className="img">{icon}</div>
      <div className="tools-item-content flex">{children}</div>
    </div>
  );
};

export default CourseResourceItem;
