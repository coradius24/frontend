"use client";
import CustomPagination from "@/components/pagination/CustomPagination";
import { useQueryState } from "next-usequerystate";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const PaginationContainer = ({ data = {} }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
  });

  const [selected, setSelected] = useQueryState("view", {
    defaultValue: parseInt(searchParams.get("view") || data.results[0].id),
  });

  useEffect(() => {
    data?.page && (setPage(data?.page))
  }, [data]);

  const pageHandler = (selected) => {
    router.push(
      `/dashboard/purchase-history?page=${selected + 1}&limit=${data.limit}`,
      {}
    );
  };
  return (
    <div className="purchase-history-container">
      {data?.totalCount > data?.limit && (
        <CustomPagination
          itemsPerPage={data?.limit || 3}
          currentPage={page}
          pageHandler={pageHandler}
          totalCount={data?.totalCount}
        />
      )}
    </div>
  );
};

export default PaginationContainer;
