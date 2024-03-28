"use client";
import { useEffect, useState } from "react";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import ReactPaginate from "react-paginate";

const CustomPagination = ({
  itemsPerPage = 2,
  totalCount,
  currentPage = 1,
  pageHandler,
}) => {
  // We start with an empty list of items.
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    setPageCount(Math.ceil(totalCount / itemsPerPage));
  }, [itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = ({ selected }) => {
    pageHandler(selected);
  };

  return (
    <ReactPaginate
      nextLabel={<MdOutlineKeyboardDoubleArrowRight />}
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      forcePage={currentPage - 1}
      marginPagesDisplayed={2}
      pageCount={pageCount}
      previousLabel={<MdOutlineKeyboardDoubleArrowLeft />}
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      breakLabel="..."
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination"
      activeClassName="active"
      renderOnZeroPageCount={null}
    />
  );
};

export default CustomPagination;
