"use client";
import activeNotification from "@/../public/active-mega-phone.svg";
import notification from "@/../public/notificaton.svg";
import { TextEditorContent } from "@/components/AppTextEditor";
import CustomPagination from "@/components/pagination/CustomPagination";
import { checkLang, dateWithTime } from "@/utils/lib";
import { useMediaQuery } from "@/utils/useCustomHook";
import { sanitizeAndTruncateString } from "@/utils/utils";
import { useQueryState } from "next-usequerystate";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { HiOutlineCheckCircle } from "react-icons/hi";

const Notifications = ({ data }) => {
  const isDesktop = useMediaQuery("(min-width: 990px)");
  const elementRef = useRef(null);
  const borderElement = useRef(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
  });

  const [selected, setSelected] = useQueryState("view", {
    defaultValue: parseInt(
      searchParams.get("view") || (data?.results?.length > 0 && data?.results[0].id)
    ),
  });

  useEffect(() => {
    data?.page && (setPage(data?.page))
  }, [data]);

  useEffect(() => {
    if (data?.results?.length > 0 && !searchParams.get("view")) {
      setSelected(data?.results[0].id);
    }
    if (searchParams.get("view")) {
      setSelected(searchParams.get("view"));
    }
  }, [data, searchParams.get("view")]);

  const pageHandler = (selected) => {
    router.push(`/dashboard/notices?page=${selected + 1}&limit=${data.limit}`);
  };
  const content = data?.results?.find((item) => item.id == selected);

  useEffect(() => {
    if (elementRef.current) {
      const height = elementRef.current.clientHeight;
      if (height < 300) {
        borderElement.current.style.height = `${height - 50}px`;
        borderElement.current.style.top = `40px`;
      } else {
        borderElement.current.style.height = `150px`;
      }
    }
  }, []);

  const handleSelected = (id) => {
    setSelected(id);
    if (elementRef.current && !isDesktop) {
      elementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="notification-content">
      <div className="">
        <h1 className="page-heading">নোটিশবোর্ড</h1>
        <hr />

        <div className="notices flex">
          <div className="notice-lists">
            {data?.results?.length > 0 ? (
              data?.results?.map((item) => (
                <div
                  className={`notice-item flex ${
                    parseInt(selected) === item.id ? "active" : ""
                  }`}
                  key={item.id}
                  onClick={() => handleSelected(item.id)}
                >
                  <div className="img">
                    <Image
                      src={
                        parseInt(selected) === item.id
                          ? activeNotification
                          : notification
                      }
                      alt="notification"
                    />
                  </div>
                  <div className="notice-content">
                    <h2 data-lang={checkLang(item.title)}>{item.title}</h2>
                    <div className="batch-info flex">
                      {item.department && (
                        <div>
                          <span>
                            <HiOutlineCheckCircle size={14} />
                            {item.department?.name}
                          </span>
                        </div>
                      )}

                      <span className="date">
                        {dateWithTime(item.deliveryTime)}
                      </span>
                    </div>
                    <p>{sanitizeAndTruncateString(item.body || "", 100)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>কোনো নোটিশ দেওয়া হয়নি!</p>
            )}
          </div>
          {content && (
            <div className="notice-details" ref={elementRef}>
              <h2>{content?.title}</h2>
              <div className="notice-details-body">
                <TextEditorContent>{content?.body}</TextEditorContent>
              </div>
              <div ref={borderElement} className="notice-details-border"></div>
            </div>
          )}
        </div>
        <div className="notifications-pagination">
          {data?.totalCount > data?.limit && (
            <CustomPagination
              itemsPerPage={data?.limit || 3}
              currentPage={page}
              pageHandler={pageHandler}
              totalCount={data?.totalCount}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Notifications;
