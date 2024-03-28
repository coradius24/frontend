import noticeboardService from "@/services/noticeboardService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import * as React from "react";
import { IoMdAddCircle } from "react-icons/io";
import NoticeForm from "../components/forms/NoticeForm";

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleSubmit = async (data) => {
    try {
      await noticeboardService.createNotice(data);
      queryClient.invalidateQueries({ queryKey: ["adminNotices"] });

      showToast("Notice added successfully!");
      setState({ ...state, right: false });
    } catch (error) {
      showToast("Filed to add notice!");
    }
  };

  return (
    <div>
      <React.Fragment>
        <Button
          sx={{ width: "200px" }}
          startIcon={<IoMdAddCircle />}
          variant="outlined"
          color="primary"
          onClick={toggleDrawer("right", true)}
        >
          Add Notice
        </Button>
        <Drawer
          sx={{
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: "1000px" },
          }}
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          <Box sx={{ height: "98vh", overflow: "scroll" }}>
            <NoticeForm handleSubmit={handleSubmit} />
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
