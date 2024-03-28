import { checkLang } from "@/utils/lib";
import "./container-header.css";

const ContainerHeader = ({ title, className = "", titleClassName="", children }) => {
  return (
    <div className={`header flex align-center ${className}`}>
      <div className="title">
        <h1 className={titleClassName} data-lang={checkLang(title)}>{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default ContainerHeader;
