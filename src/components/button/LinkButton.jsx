import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";

const LinkButton = ({ url, text, className = "", ...otherPros }) => {
  return (
    <Link href={url} className={`btn ${className}`} {...otherPros}>
      {text}
      <BiRightArrowAlt size={20} />
    </Link>
  );
};
export default LinkButton;

export const Button = ({
  icon,
  type = "button",
  text,
  className = "",
  size = 20,
  ...otherPros
}) => {
  return (
    <button type={type} className={`btn ${className}`} {...otherPros}>
      {text} {icon ? icon : <BiRightArrowAlt size={size} />}
    </button>
  );
};
