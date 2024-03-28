"use client";
import ContainerHeader from "@/components/dashboard/ContainerHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import CustomPagination from "@/components/pagination/CustomPagination";
import { formateDate } from "@/utils/lib";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useQueryState } from "next-usequerystate";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function isValidDate(dateString) {
  const dateObj = new Date(dateString);
  return !isNaN(dateObj.getTime());
}

const EarningReport = ({ data = {} }) => {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
  });

  const [startDate, setStartDate] = useQueryState("startDate", {
    defaultValue: "",
  });
  const [endDate, setEndDate] = useQueryState("endDate", {
    defaultValue: "",
  });

  useEffect(() => {
    setPage(data?.page);
  }, [data]);

  const pageHandler = (selected) => {
    let url = `/dashboard/earning-report?page=${
      selected + 1
    }&limit=10&startDate=${startDate}&endDate=${endDate}`;
    router.push(url, {});
  };

  const handleDate = (date, update, updateParam) => {
    if (isValidDate(date)) {
      const dateObj = new Date(date);
      const timestamp = dateObj.toISOString();
      update(timestamp);
      let url = `/dashboard/earning-report?page=${page}&limit=10&endDate=${timestamp}&startDate=${startDate}`;
      if (updateParam === "startDate") {
        url = `/dashboard/earning-report?page=${page}&limit=10&startDate=${timestamp}&endDate=${endDate}`;
      }
      router.push(url, {});
    }
  };

  return (
    <>
      <ContainerHeader titleClassName="header-title" title={"আর্নিং রিপোর্ট"}>
        <div className="content flex">
          <div className="date-container flex">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ padding: "0 2px" }}
                className="start-date"
                label="Start Date"
                defaultValue={dayjs(startDate)}
                onChange={(value) =>
                  handleDate(value, setStartDate, "startDate")
                }
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ padding: "0 2px" }}
                className="end-date"
                label="End Date"
                defaultValue={dayjs(endDate)}
                disableFuture
                onChange={(value) => handleDate(value, setEndDate, "endDate")}
              />
            </LocalizationProvider>
          </div>
        </div>
      </ContainerHeader>
      <hr className="earning-report-break" />
      <div className="content">
        {data.totalCount === 0 ? (
          <p className="text-center">আর্নিং রিপোর্ট খুঁজে পাওয়া যায়নি !</p>
        ) : (
          <TableContainer className="earning-report">
            <Table sx={{ minWidth: 650 }} aria-label="earning report">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Click</TableCell>
                  <TableCell align="right">Earning</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.results?.map((row) => (
                  <TableRow
                    key={row.click_date}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {formateDate(row.click_date)}
                    </TableCell>
                    <TableCell>{row.click_count}</TableCell>
                    <TableCell align="right">
                      {parseFloat(row.earning).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {data.totalCount > parseInt(data.limit) && (
          <CustomPagination
            itemsPerPage={data.limit}
            currentPage={page}
            pageHandler={pageHandler}
            totalCount={data.totalCount || 0}
          />
        )}
      </div>
    </>
  );
};

export default EarningReport;
