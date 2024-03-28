"use client";
import useApp from "@/hooks/useApp";
import { formatNumber } from "@/utils/lib";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { IoIosClose } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import CardButton from "../course/CardButton";
import "./notification-dropdown.css";

function Cart() {
  const router = useRouter();
  const { cart, setCart } = useApp();
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleExpand = async () => {
    if (!isOpen) {
    }
    setIsOpen(!isOpen);
  };

  const handleOutsideClick = (event) => {
    if (isOpen && containerRef.current) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleCart = (id) => {
    const updateCart = cart.filter((item) => item.id !== id);
    setCart(updateCart);
  };

  const handleCloseTooltip = () => {
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <div className="notification-dropdown" ref={containerRef}>
        <ul className="notification-dropdown-menu">
          <li className="dropdown-user-info">
            <div className="flex bag-icon position-relative">
              <div
                data-tooltip-id="cart-tooltip"
                onClick={handleExpand}
                data-tooltip-place="bottom"
                className="bag-icon"
              >
                <img src="/bag.svg" alt="bag-icon" />
              </div>
            </div>
            <div
              style={isOpen ? { display: "block" } : { display: "none" }}
              className={`tooltip-container  `}
            >
              <Tooltip id="cart-tooltip" isOpen={isOpen}>
                <div>
                  <div className="expanded-notifications">
                    <div className="title">কার্টে যে কোর্সগুলি যোগ করেছেন</div>
                    <div className="content">
                      {cart && cart.length === 0 ? (
                        <p className="empty">কোন কোর্স যোগ করা হয়নি এখনো !!</p>
                      ) : (
                        <div className="cart-items">
                          {cart.map((item) => (
                            <div key={item.id} className="cart-item flex">
                              <div className="image">
                                <Image
                                  src={
                                    item.thumbnail ||
                                    "/course_thumbnail_placeholder.jpg"
                                  }
                                  height={70}
                                  width={70}
                                  alt={item.title}
                                />
                              </div>
                              <div className="info">
                                <p>
                                  <Link href={`/courses/${item.id}`}>
                                    {item.title}
                                  </Link>
                                </p>
                                <p>কোর্সের মূল্য:</p>
                                <p>
                                  {item.discountFlag ? (
                                    <>
                                      <span>
                                        ৳{formatNumber(item.discountedPrice)}
                                        &nbsp;&nbsp;
                                      </span>
                                      ৳{formatNumber(item.price)}
                                    </>
                                  ) : (
                                    <>{formatNumber(item.price)}</>
                                  )}
                                </p>
                              </div>
                              <div className="button-aria flex">
                                <span
                                  className="close"
                                  onClick={() => handleCart(item.id)}
                                >
                                  <IoIosClose size={30} />
                                </span>
                                <CardButton
                                  closeTooltip={handleCloseTooltip}
                                  course={item}
                                  text={`পেমেন্ট করুন`}
                                  id={item.id}
                                  icon={<BiRightArrowAlt size={12} />}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Tooltip>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Cart;
