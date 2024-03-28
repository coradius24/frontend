"use client";
import bkash from "@/../public/bkash.svg";
import nagad from "@/../public/nagad.svg";
import rocket from "@/../public/rocket.svg";
import ContainerHeader from "@/components/dashboard/ContainerHeader";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import CustomPagination from "@/components/pagination/CustomPagination";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import moment from "moment";
import { useQueryState } from "next-usequerystate";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MdOutlineClear } from "react-icons/md";

function isValidDate(dateString) {
  const dateObj = new Date(dateString);
  return !isNaN(dateObj.getTime());
}

const WithdrawReport = ({ data = {} }) => {
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
    data?.page && (setPage(data?.page))
  }, [data]);
  const pageHandler = (selected) => {
    let url = `/dashboard/wallet?page=${
      selected + 1
    }&limit=10&startDate=${startDate}&endDate=${endDate}`;
    router.push(url, {});
  };

  const handleDate = (date, update, updateParam) => {
    if (isValidDate(date)) {
      const dateObj = new Date(date);
      const timestamp = dateObj.toISOString();
      update(timestamp);
      let url = `/dashboard/wallet?page=${page}&limit=10&endDate=${timestamp}&startDate=${startDate}`;
      if (updateParam === "startDate") {
        url = `/dashboard/wallet?page=${page}&limit=10&startDate=${timestamp}&endDate=${endDate}`;
      }
      router.push(url, {});
    }
  };
  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    router.push("/dashboard/wallet?page=1&limit=10");
  };

  return (
    <>
      <ContainerHeader title={"উইথড্র হিস্ট্রি "}>
        <div className="content flex">
          <div className="date-container flex align-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className="start-date"
                label="Start Date"
                disableFuture
                sx={{ padding: "0 2px" }}
                value={dayjs(startDate)}
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
                value={dayjs(endDate)}
                onChange={(value) => handleDate(value, setEndDate, "endDate")}
              />
            </LocalizationProvider>
            {(startDate || endDate) && (
              <span
                className="cursor-pointer"
                role="button"
                onClick={handleClear}
              >
                {" "}
                <MdOutlineClear size={24} />
              </span>
            )}
          </div>
        </div>
      </ContainerHeader>
      <hr className="earning-report-break" />
      {data.totalCount === 0 ? (
        <p className="text-center">উইথড্র হিস্ট্রি খুঁজে পাওয়া যায়নি !</p>
      ) : (
        <div className="content">
          <TableContainer className="earning-report">
            <Table sx={{ minWidth: 650 }} aria-label="earning report">
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>Account Number</TableCell>
                  <TableCell>Payout Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.results?.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: "700" }}>
                      ${row.amount}
                    </TableCell>
                    <TableCell>{row.accountNumber}</TableCell>
                    <TableCell>{getPaymentIcon(row.payoutMethod)}</TableCell>
                    <TableCell>
                      <Tooltip
                        title={`${
                          row.status == "rejected" ? row.reviewerMessage : ""
                        }`}
                        placement="top-start"
                      >
                        <Chip
                          label={row.status}
                          className={`${
                            row.status == "rejected" ? "cursor-pointer" : ""
                          }`}
                          sx={{
                            backgroundColor: getColor(row.status),
                            color: "#fff",
                            textTransform: "uppercase",
                          }}
                          variant="outlined"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right" component="th" scope="row">
                      {moment(row.createdAt).format("lll")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {data.totalCount > 10 && (
            <CustomPagination
              itemsPerPage={data.limit}
              currentPage={page}
              pageHandler={pageHandler}
              totalCount={data.totalCount}
            />
          )}
        </div>
      )}
    </>
  );
};

export default WithdrawReport;

const getColor = (status) => {
  if (status === "pending") {
    return "#99CC33";
  }
  if (status === "rejected") {
    return "#DC3545";
  }
  if (status === "approved") {
    return "#56aa5a";
  }
  return "#017A07";
};

export const getPaymentIcon = (method) => {
  if (method === "Nagad") {
    return <Image alt={method} src={nagad} />;
  } else if (method === "rocket") {
    return <Image alt={method} src={rocket} />;
  }
  return <Image alt={method} src={bkash} />;
};
