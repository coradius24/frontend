"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import courseService from "@/services/courseService";
import { getQueryString, minutesToHours, showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import ArticleIcon from "@mui/icons-material/Article";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FeedIcon from "@mui/icons-material/Feed";
import InfoIcon from "@mui/icons-material/Info";
import LanguageIcon from "@mui/icons-material/Language";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import PaymentsIcon from "@mui/icons-material/Payments";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { useAdminContext } from "../../AdminContext";
import FilterPopover from "../components/shared/FilterPopover";
const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Courses",
  },
];

const SamplePage = () => {
  const { isFeatureAvailable, features } = useAdminContext();
  const [query, setQuery] = useQueryParams({
    price: "all",
    level: "all",
    sort_by: "newest",
    status: "all",
    contentType: "all",
    page: 1,
    limit: 10,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery({
      ...query,
      [name]: value,
    });
  };

  const [searchValue, setSearchValue] = useState(() => query.search || "");
  const debouncedSearch = debounce((value) => {
    setQuery((prevQuery) => ({ ...prevQuery, page: 1, search: value }));
  }, 300);

  const { isPending, error, data } = useQuery({
    queryKey: ["adminCourses", query],
    queryFn: () => courseService.getAdminCourse(getQueryString(query)),
  });

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const router = useRouter();
  const handleRoute = () => {
    router.push("/admin/courses/add");
  };

  const handleCourseInfo = (id, type) => {
    router.push(`/admin/courses/${id}?type=${type}`);
  };

  const handleDelete = async (id) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: `You want to delete this course!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = await courseService.deleteCourse(id);
          if (data.statusCode === 400) {
            throw new Error("Something went wrong");
          }
          queryClient.invalidateQueries(["adminCourses"]);
          showToast(`Successfully Delete!`);
        } catch (error) {
          showToast("Failed to update", "error");
        }
      }
    });
  };

  return (
    <PageContainer title="Courses" description="this is Sample page">
      <Breadcrumb title="Courses" items={BCrumb} />
      <DataTableWithToolbar
        selectorKey={"id"}
        {...query}
        setQuery={setQuery}
        rows={data?.results}
        rowsCount={data?.totalCount}
        pagination
        isLoading={isPending}
        columns={[
          {
            key: "id",
            name: "ID",
          },
          {
            key: "title",
            name: "Title",
            template: (data) => (
              <Stack direction="row" spacing={2}>
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {data?.title}
                  </Typography>
                  <Stack direction="column" spacing="2">
                    <Stack direction="row" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="p"
                        style={{ display: "inline-block" }}
                      >
                        Batch:&nbsp;
                      </Typography>
                      <Typography
                        style={{ display: "inline-block" }}
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight="600"
                      >
                        {data?.batchTitle || data?.batch || 'Main'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="p"
                        style={{ display: "inline-block" }}
                      >
                        Instructor:&nbsp;
                      </Typography>
                      <Typography
                        style={{ display: "inline-block" }}
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight="600"
                      >
                        {data?.instructorName}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            ),
          },
          {
            key: "status",
            name: "Status",
            type: "status",
          },
          {
            key: "enrollCount",
            name: "Enrollment",
          },
          {
            key: "lesson_time",
            name: "Lesson & Time",
            type: "datetime",
            template: (data) => (
              <Stack direction="column" spacing={2}>
                <Box>
                  <Box sx={{ display: "block" }}>
                    <Typography variant="p" style={{ display: "inline-block" }}>
                      Assignments:&nbsp;
                    </Typography>
                    <Typography
                      style={{ display: "inline-block" }}
                      variant="h6"
                      fontWeight="600"
                    >
                      {data?.totalAssignmentCount || "0"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="p" style={{ display: "inline-block" }}>
                      Lesson:&nbsp;
                    </Typography>
                    <Typography
                      style={{ display: "inline-block" }}
                      variant="h6"
                      fontWeight="600"
                    >
                      {data?.totalLessons}
                    </Typography>
                  </Box>
                  <Typography variant="p" style={{ display: "inline-block" }}>
                    Time:&nbsp;
                  </Typography>
                  <Typography
                    style={{ display: "inline-block" }}
                    color="textSecondary"
                    variant="p"
                    fontWeight="600"
                  >
                    {minutesToHours(data?.totalLessonsInMinute)} ঘন্টা
                  </Typography>
                </Box>
              </Stack>
            ),
          },
          {
            key: "assignment",
            name: "Assignment Submissions",
            template: (data) => (
              <Stack direction="row" spacing={2}>
                <Box>
                  <Box>
                    <Typography variant="p" style={{ display: "inline-block" }}>
                      Pending:&nbsp;
                    </Typography>
                    <Typography
                      style={{ display: "inline-block" }}
                      variant="h6"
                      fontWeight="600"
                    >
                      {data?.pendingAssignmentCount}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="p" style={{ display: "inline-block" }}>
                      Evaluated:&nbsp;
                    </Typography>
                    <Typography
                      style={{ display: "inline-block" }}
                      variant="h6"
                      fontWeight="600"
                    >
                      {data.totalAssignmentSubmissionCount -
                        data?.pendingAssignmentCount || "0"}
                    </Typography>
                  </Box>
                  <Typography variant="p" style={{ display: "inline-block" }}>
                    Total Submission:&nbsp;
                  </Typography>
                  <Typography
                    style={{ display: "inline-block" }}
                    color="textSecondary"
                    variant="p"
                    fontWeight="600"
                  >
                    {data.totalAssignmentSubmissionCount}
                  </Typography>
                </Box>
              </Stack>
            ),
          },
          {
            key: "more",
            name: "Action",
            type: "menu",
            menu: [
              {
                label: "Curriculum",
                icon: <ArticleIcon size={16} />,
                fn: (item, closeFn) => {
                  handleCourseInfo(item.id, "curriculum");
                },
                isAccessible:
                  isFeatureAvailable("create_lesson", "adminCourseModule") ||
                  isFeatureAvailable("update_lesson", "adminCourseModule") ||
                  isFeatureAvailable("delete_lesson", "adminCourseModule") ||
                  isFeatureAvailable("create_section", "adminCourseModule") ||
                  isFeatureAvailable("update_section", "adminCourseModule") ||
                  isFeatureAvailable("delete_section", "adminCourseModule"),
              },
              {
                label: "Live Class",
                icon: <LiveTvIcon size={16} />,
                fn: (item, closeFn) => {
                  handleCourseInfo(item.id, "zoom");
                },
                isAccessible: isFeatureAvailable(
                  "live_class_of_a_course",
                  "adminCourseModule"
                ),
              },
              {
                label: "Basic",
                icon: <FeedIcon size={16} />,
                fn: (item, closeFn) => {
                  handleCourseInfo(item.id, "basic");
                },
                isAccessible: isFeatureAvailable(
                  "update_course",
                  "adminCourseModule"
                ),
              },
              {
                label: "Info",
                icon: <InfoIcon size={16} />,
                fn: (item, closeFn) => {
                  handleCourseInfo(item.id, "info");
                },
                isAccessible: isFeatureAvailable(
                  "update_course",
                  "adminCourseModule"
                ),
              },
              {
                label: "Pricing",
                icon: <PaymentsIcon size={16} />,
                fn: (item, closeFn) => {
                  handleCourseInfo(item.id, "pricing");
                },
                isAccessible: isFeatureAvailable(
                  "update_course",
                  "adminCourseModule"
                ),
              },
              {
                label: "Media & Instructors",
                icon: <PermMediaIcon size={16} />,
                fn: (item, closeFn) => {
                  handleCourseInfo(item.id, "media");
                },
                isAccessible: isFeatureAvailable(
                  "update_course",
                  "adminCourseModule"
                ),
              },
              {
                label: "Seo",
                icon: <LanguageIcon size={16} />,
                fn: (item, closeFn) => {
                  handleCourseInfo(item.id, "seo");
                },
                isAccessible: isFeatureAvailable(
                  "update_course",
                  "adminCourseModule"
                ),
              },
              {
                label: "Assignments",
                icon: <AssignmentIcon size={16} />,
                fn: (item, closeFn) => {
                  handleCourseInfo(item.id, "assignment");
                },
                isAccessible: isFeatureAvailable(
                  "get_assignments_with_stats",
                  "adminAssignmentModule"
                ),
              },
              {
                label: "Delete",
                icon: <IconTrash size={16} />,
                fn: (item, closeFn) => {
                  handleDelete(item.id);
                  closeFn();
                },
                isAccessible: isFeatureAvailable(
                  "delete_course",
                  "adminCourseModule"
                ),
              },
            ].filter((menu) => menu.isAccessible),
          },
        ]}
        renderLeftContent={() => (
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size="1.1rem" />
                  </InputAdornment>
                ),
              }}
              placeholder="Search ..."  
type="search"
              size="small"
              onChange={handleSearch}
              value={searchValue}
            />
            <Typography variant="h6">
              Courses ({data?.totalCount || 0})
            </Typography>
          </Box>
        )}
        renderAction={() => (
          <Stack spacing={1} direction="row">
            {isFeatureAvailable("create_course", "adminCourseModule") && (
              <Tooltip title="Add New Course">
                <Button
                  sx={{ width: "200px" }}
                  startIcon={<IoMdAddCircle />}
                  variant="outlined"
                  color="primary"
                  onClick={handleRoute}
                >
                  Add New Course
                </Button>
              </Tooltip>
            )}
            <FilterPopover>
              <Box sx={{ minWidth: "250px" }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Content Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="contentType"
                    value={query.contentType}
                    label="Content Type"
                    onChange={handleChange}
                    size="small"
                  >
                    <MenuItem value={"all"}>All</MenuItem>
                    <MenuItem value={"recorded"}>Recorded</MenuItem>
                    <MenuItem value={"live"}>Live</MenuItem>
                  </Select>
                </FormControl>
                <Box mt={3}>
                  <FormControl fullWidth>
                    <InputLabel id="price">Price</InputLabel>
                    <Select
                      labelId="price"
                      id="price"
                      name="price"
                      value={query.price}
                      label="Price"
                      onChange={handleChange}
                      size="small"
                    >
                      <MenuItem value={"all"}>All</MenuItem>
                      <MenuItem value={"free"}>Free</MenuItem>
                      <MenuItem value={"paid"}>Paid</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box mt={3}>
                  <FormControl fullWidth>
                    <InputLabel id="level">Level</InputLabel>
                    <Select
                      labelId="level"
                      id="level"
                      name="level"
                      value={query.level}
                      label="Level"
                      onChange={handleChange}
                      size="small"
                    >
                      <MenuItem value={"all"}>All</MenuItem>
                      <MenuItem value={"beginner"}>Beginner</MenuItem>
                      <MenuItem value={"intermediate"}>Intermediate</MenuItem>
                      <MenuItem value={"advanced"}>Advanced</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box mt={3}>
                  <FormControl fullWidth>
                    <InputLabel id="sort_by">Sort by</InputLabel>
                    <Select
                      labelId="sort_by"
                      id="sort_by"
                      name="sort_by"
                      value={query.sort_by}
                      label="Sort by"
                      onChange={handleChange}
                      size="small"
                    >
                      <MenuItem value={"newest"}>New</MenuItem>
                      <MenuItem value={"featured"}>Featured</MenuItem>
                      <MenuItem value={"highest-rating"}>
                        Highest-rating
                      </MenuItem>
                      <MenuItem value={"discounted"}>Discounted</MenuItem>
                      <MenuItem value={"lowest-price"}>Lowest Price</MenuItem>
                      <MenuItem value={"highest-price"}>Highest Price</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box mt={3}>
                  <FormControl fullWidth>
                    <InputLabel id="status">Status</InputLabel>
                    <Select
                      labelId="status"
                      id="status"
                      name="status"
                      value={query.status}
                      label="Status"
                      onChange={handleChange}
                      size="small"
                    >
                      <MenuItem value={"active"}>Active</MenuItem>
                      <MenuItem value={"private"}>Private</MenuItem>
                      <MenuItem value={"completed"}>Completed</MenuItem>
                      <MenuItem value={"all"}>All</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </FilterPopover>
          </Stack>
        )}
        renderSelectAction={(selected, unSelectSelected) =>
          isFeatureAvailable(
            "archive_single_pre_registration",
            "adminPreRegistrationModule"
          ) ? (
            <Tooltip
              title={
                query.isArchived === "false" ? "Mark as Archive" : "Restore"
              }
            >
              <Button
                onClick={() =>
                  handleUpdate(
                    { ids: selected, isArchived: query.isArchived === "false" },
                    unSelectSelected
                  )
                }
                size="small"
                variant="contained"
                color="error"
                sx={{
                  width: "130px",
                }}
              >
                {query.isArchived === "false" ? "Mark as Archive" : "Restore"}
              </Button>
            </Tooltip>
          ) : (
            "No action available to perform"
          )
        }
      />
    </PageContainer>
  );
};

export default SamplePage;
