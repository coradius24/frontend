"use client";
import useApp from "@/hooks/useApp";
import { useLoading } from "@/utils/useCustomHook";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import LoadingButton from "../button/LoadingButton";

const CardButton = ({ className = "", course, text, icon, closeTooltip }) => {
  const pathname = usePathname();
  const { addToCart } = useApp();
  const { isLoading, startLoading } = useLoading();
  const router = useRouter();
  const { data } = useSession();
  const onClickHandler = async () => {
    startLoading();
    closeTooltip && closeTooltip();
    if (!data) {
      return router.push(`/login?callbackUrl=${pathname}`);
    }
    addToCart(course);
  };

  return isLoading ? (
    <LoadingButton className={"card-btn"} />
  ) : (
    <button className={`card-btn ${className}`} onClick={onClickHandler}>
      {text || "সিট বুক করুন"} {icon}
    </button>
  );
};

export default CardButton;
