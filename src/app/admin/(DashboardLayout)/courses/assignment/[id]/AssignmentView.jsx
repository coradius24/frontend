import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { useRef } from "react";

const AssignmentView = ({
  open,
  setOpen,
  children,
  handleReject,
  handleApprove,
  data = {},
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

  const handlePreview = (item) => {
    window.open(item.url, "_blank");
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
        <DialogTitle>Review Assignment - {data?.user?.fullName}</DialogTitle>
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
                <Typography variant="p">Note:</Typography>
                <Typography variant="p">
                  {data?.submissionNote || ""}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Box mt={"5px"} display={"flex"} gap={2} alignItems={"center"}>
                <Typography variant="p">Attachments:</Typography>
                <Box display={"flex"} flexDirection={"column"} gap={2}>
                  {data?.attachments.map((item) => (
                    <IconButton
                      onClick={() => handlePreview(item)}
                      key={item.key}
                      title="View"
                    >
                      <RemoveRedEyeIcon fontSize="small" />{" "}
                    </IconButton>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box display={"flex"} gap={2} mt={1}>
              <Button
                sx={{ mt: "10px" }}
                type="submit"
                fullWidth
                color="warning"
                variant="contained"
                onClick={() => handleReject(data.id)}
              >
                Reject
              </Button>
              <Button
                sx={{ mt: "10px" }}
                type="submit"
                fullWidth
                onClick={() => handleApprove(data.id)}
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

export default AssignmentView;
