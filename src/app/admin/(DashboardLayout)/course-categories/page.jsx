"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import categoryService from "@/services/categoryService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import Swal from "sweetalert2";
import { useAdminContext } from "../../AdminContext";
import CourseCategoryModal from "./CourseCategoryModal";
import "./icon.css";
const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Categories",
  },
];

const SamplePage = () => {
  const { isFeatureAvailable } = useAdminContext();
  const [query, setQuery] = useQueryParams({
    search: "",
    page: 1,
    limit: 10,
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["adminCourseCategories", query],
    queryFn: () => categoryService.getCateGory(query),
  });

  const [isOpen, setIsOpen] = useState({
    open: false,
    type: "add",
    data: {},
  });

  return (
    <PageContainer title="Course Categories" description="this is Sample page">
      <Breadcrumb title="Course Categories" items={BCrumb} />
      <CourseCategoryModal setIsOpen={setIsOpen} isOpen={isOpen} />
      <Grid mt={1} container spacing={3} xs={12} lg={12}>
        {data &&
          data.map((item) => (
            <Grid key={item.id} item xs={12} sm={6} md={4} lg={4}>
              <Box position={"relative"}>
                <Card>
                  <CardContent>
                    <Box right={0} position={"absolute"} alignItems={"right"}>
                      <Button
                        startIcon={<IoMdAddCircle />}
                        color="primary"
                        onClick={() =>
                          setIsOpen({ open: true, type: "sub", parent: item })
                        }
                      />
                    </Box>
                    <Typography mt={2} variant="h5" align="center">
                      <i className={item.icon}></i>
                    </Typography>
                    <Typography variant="h5" align="center">
                      {item.name}{" "}
                      <ActionToolTip
                        setIsOpen={setIsOpen}
                        isOpen={isOpen}
                        item={item}
                      />
                    </Typography>
                    <Box mt={2}>
                      {item.subCategory.map((sub) => (
                        <Box
                          key={sub.slug}
                          display={"flex"}
                          justifyContent={"space-between"}
                        >
                          <div>
                            <i className={sub.icon}></i>&nbsp;&nbsp;
                            {sub.name}{" "}
                          </div>
                          <ActionToolTip
                            setIsOpen={setIsOpen}
                            isOpen={isOpen}
                            item={sub}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))}
      </Grid>
    </PageContainer>
  );
};

export default SamplePage;

const ActionToolTip = ({ item, setIsOpen, isOpen }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete this coupon!`,
      icon: "warning",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        categoryService.deleteCategory(item.id).then((res) => {
          queryClient.invalidateQueries({
            queryKey: ["adminCourseCategories"],
          });
          showToast("Delete Successfully!");
        });
      }
    });
  };

  return (
    <div style={{ display: "inline" }}>
      <IconButton
        aria-label="more"
        id={item.slug}
        aria-controls={open ? item.slug : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={item.slug}
        MenuListProps={{
          "aria-labelledby": item.slug,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem key="edit" onClick={handleClose}>
          <IconButton
            onClick={() => setIsOpen({ open: true, type: "edit", data: item })}
          >
            <IconEdit width="18" />
          </IconButton>
        </MenuItem>
        <MenuItem key="delete" onClick={handleClose}>
          <IconButton onClick={() => handleDelete()}>
            <IconTrash width="18" />
          </IconButton>
        </MenuItem>
      </Menu>
    </div>
  );
};
