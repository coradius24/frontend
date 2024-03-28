"use client";
import Payment from "@/components/home/Payment";
import CustomPagination from "@/components/pagination/CustomPagination";
import { useQueryState } from "next-usequerystate";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import EventItem from "./EventItem";

const Events = ({ data }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
  });

  const [limit, setLimit] = useQueryState("limit", {
    defaultValue: parseInt(searchParams.get("limit") || 2),
  });

  useEffect(() => {
    data?.page && (setPage(data?.page))
    setLimit(data.limit);
  }, [data]);

  const pageHandler = (selected) => {
    router.push(`/events?page=${selected + 1}&limit=${limit}`, {});
  };

  return (
    <>
      <div className="events-items flex">
        {data?.results?.map((item) => (
          <EventItem key={item.id} item={item} />
        ))}
      </div>
      <div className="event-gallery-pagination">
        {data?.totalCount > data?.limit && (
          <CustomPagination
            itemsPerPage={data?.limit || 3}
            currentPage={page}
            pageHandler={pageHandler}
            totalCount={data?.totalCount}
          />
        )}
      </div>
    </>
  );
};

export default Events;
