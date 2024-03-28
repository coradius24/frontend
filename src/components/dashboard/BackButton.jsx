"use client";
import { useRouter } from "next/navigation";
import { BsArrowLeftShort } from "react-icons/bs";

const BackButton = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <div className="back-button" onClick={handleBack}>
      <BsArrowLeftShort size={16} color="#19891C" />
    </div>
  );
};

export default BackButton;
