"use client";
import ContainerHeader from "@/components/dashboard/ContainerHeader";
import useApp from "@/hooks/useApp";
import paymentService from "@/services/paymentService";
import { formateDate } from "@/utils/lib";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useQueryState } from "next-usequerystate";
import { useEffect, useState } from "react";
import GenerateInvoice from "./InvoiceComponent";
import PaginationContainer from "./PaginationContainer";
import PayDueActionButton from "./PayDueActionButton";
import "./page.css";

const PurchaseHistory = () => {
  const { user } = useApp();
  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
  });

  const [data, setData] = useState(() => ({
    totalCount: 0,
    page: page,
    limit: 6,
    results: [],
  }));
  const getPaymentHistory = () => {
    paymentService
      .paymentHistory(`page=${page}&limit=${data.limit}`)
      .then((res) => {
        if (res?.totalCount > 0) {
          let index = data.page * data.limit - data.limit;
          let rows = res.results.map((item) => {
            const {
              course,
              createdAt,
              amount,
              due,
              isFullPaid,
              isLatestPaymentForTheCourse,
            } = item;
            index += 1;
            return {
              due,
              name: user?.fullName ?? "",
              mobileNumber: user?.mobileNumber ?? "",
              email: user?.email ?? "",
              id: item.id,
              serial: index,
              date: formateDate(createdAt),
              title: course.title,
              courseId: course.courseId,
              batchTitle: course.batchTitle,
              paid: amount,
              isFullPaid,
              isLatestPaymentForTheCourse,
              ...item,
            };
          });
          setData({
            ...res,
            results: rows,
          });
        }
      })
      .catch((err) => {
        console.log({ err });
      });
  };
  useEffect(() => {
    if (page) {
      getPaymentHistory();
    }
  }, [user, page]);

  return (
    <div className="purchase-history">
      <ContainerHeader title={"পার্চেস হিস্ট্রি"} />
      <hr className="purchase-history-break" />
      <div className="content">
        {data.totalCount > 0 ? (
          <>
            <TableContainer className="">
              <Table sx={{ minWidth: 650 }} aria-label="purchase history table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="normal" width={"10px"}>
                      S/L
                    </TableCell>
                    <TableCell padding="normal" width={"35%"}>
                      Item
                    </TableCell>
                    <TableCell padding="normal">Date</TableCell>
                    <TableCell padding="normal">Paid</TableCell>
                    <TableCell padding="normal">Due</TableCell>
                    <TableCell padding="normal" align="right">
                      Invoice
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.results?.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.serial}
                      </TableCell>
                      <TableCell>
                        {row.title}
                        {""}
                        {row.batchTitle ? ` - ${row.batchTitle}` : ""}
                      </TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        {" "}
                        <span> {row.paid} Tk</span>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <span className={`${row.isFullPaid ? "" : "due"}`}>
                          {" "}
                          {row.due || 0} Tk
                        </span>
                      </TableCell>
                      <TableCell
                        className="purchase-history-action"
                        align="right"
                      >
                        <div className="button-group">
                          {/* Todo: enable this uncomment code when surjo pay is ready */}
                          {/* {!row.isFullPaid &&
                            row.isLatestPaymentForTheCourse && (
                              <PayDueActionButton
                                due={row.due}
                                courseId={row.courseId}
                              />
                            )} */}
                          <GenerateInvoice invoiceData={row} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <PaginationContainer data={data} />
          </>
        ) : (
          <p>পার্চেস হিস্ট্রি খুঁজে পাওয়া যায়নি !</p>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
