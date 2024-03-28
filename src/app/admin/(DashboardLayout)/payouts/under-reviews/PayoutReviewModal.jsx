import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import { dateWithTime } from "@/utils/lib";
import CloseIcon from "@mui/icons-material/Close";
import { useRef } from "react";

const PayoutReviewModal = ({
  open,
  setOpen,
  children,
  handleReject,
  data = {},
  handleApprove,
}) => {
  const radioGroupRef = useRef(null);

  const handleClose = () => {
    setOpen(false);
  };
  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  return (
    <>
      {children}
      <Dialog
        TransitionProps={{ onEntering: handleEntering }}
        keepMounted
        maxWidth="sm"
        fullWidth
        open={open}
      >
        <DialogTitle>
          Review Payment Request - {data?.user?.fullName}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Box
            maxWidth={"500px"}
            margin={"0 auto"}
            noValidate
            autoComplete="off"
          >
            <Box>
              <Box mt={-2} display={"flex"} flexWrap gap={2}>
                <Typography variant="p">Name:</Typography>
                <Typography variant="h6">{data?.user?.fullName}</Typography>
              </Box>
            </Box>
            <Box>
              <Box mt={1} display={"flex"} gap={2}>
                <Typography variant="p">Email:</Typography>
                <Typography variant="h6">{data?.user?.email}</Typography>
              </Box>
            </Box>
            <Box>
              <Box mt={1} display={"flex"} gap={2}>
                <Typography variant="p">Amount:</Typography>
                <Typography variant="h6">${data?.amount}</Typography>
              </Box>
            </Box>
            <Box>
              <Box mt={1} display={"flex"} gap={2}>
                <Typography variant="p">AccountNumber:</Typography>
                <Typography variant="h6">{data?.accountNumber}</Typography>
              </Box>
            </Box>
            <Box>
              <Box mt={1} display={"flex"} gap={2}>
                <Typography variant="p">Payout Method:</Typography>
                <Typography variant="h6">{data?.payoutMethod}</Typography>
              </Box>
            </Box>
            <Box>
              <Box mt={1} display={"flex"} gap={2}>
                <Typography variant="p">Requesting Date:</Typography>
                <Typography variant="h6">
                  {dateWithTime(data?.createdAt || new Date())}
                </Typography>
              </Box>
            </Box>
            <Box display={"flex"} gap={2} mt={1}>
              <Button
                sx={{ mt: "10px" }}
                type="submit"
                fullWidth
                color="warning"
                variant="contained"
                onClick={handleReject}
              >
                Reject
              </Button>
              <Button
                sx={{ mt: "10px" }}
                type="submit"
                fullWidth
                onClick={handleApprove}
                variant="contained"
              >
                Approve
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PayoutReviewModal;
