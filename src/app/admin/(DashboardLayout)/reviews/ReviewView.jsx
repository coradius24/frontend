import { Box, Button, Chip, Typography } from "@mui/material";
import Rating from "@mui/material/Rating";
import ReviewMediaAttachment from "./ReviewMediaAttachment";

const ReviewView = ({ data = {}, handleApprove }) => {
  return (
    <Box maxWidth={"500px"} margin={"0 auto"} noValidate autoComplete="off">
      <Box>
        <Box mt={-2} display={"flex"} flexWrap gap={2}>
          <Typography variant="p">Reviewer Name:</Typography>
          <Typography variant="h6">{data.reviewerName}</Typography>
        </Box>
      </Box>
      <Box>
        <Box mt={1} display={"flex"} gap={2}>
          <Typography variant="p">Course:</Typography>
          <Typography variant="h6">
            {data.course.title} {data.course.batchTitle}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Box mt={1} display={"flex"} gap={2}>
          <Typography variant="p">Comment:</Typography>
          <Typography variant="h6">{data.comment}</Typography>
        </Box>
      </Box>
      <Box>
        <Box mt={1} display={"flex"} gap={2}>
          <Typography variant="p">Attachment:</Typography>
          <div style={{ zIndex: 99999 }}>
            {" "}
            <ReviewMediaAttachment key={data?.id} data={data} />
          </div>
        </Box>
      </Box>
      <Box>
        <Box mt={1} display={"flex"} gap={2}>
          <Typography variant="p">Rating:</Typography>
          <Rating size="small" name="read-only" value={data.rating} readOnly />
        </Box>
      </Box>
      <Box>
        <Box mt={1} display={"flex"} gap={2}>
          <Typography variant="p">Status:</Typography>
          <Typography variant="h6">
            <Chip label={data.status} size="small" />
          </Typography>
        </Box>
      </Box>
      {data.status === "pending" && (
        <Box mt={2}>
          <Button
            variant="contained"
            fullWidth
            type="button"
            onClick={() => handleApprove(data.id)}
          >
            Approve
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ReviewView;
