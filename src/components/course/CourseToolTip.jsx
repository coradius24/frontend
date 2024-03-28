import { Tooltip } from "react-tooltip";
import { CourseHoveContent } from "../home/HoverPopup";

const CourseToolTip = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Tooltip
      key={id}
      id={`my-tooltip${id}`}
      place="left"
      data-tooltip-offset={10}
      style={{ background: "#fff" }}
    >
      <CourseHoveContent />
    </Tooltip>
  );
};

export default CourseToolTip;
