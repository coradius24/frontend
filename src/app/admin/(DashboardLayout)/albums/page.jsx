"use client";
import useQueryParams from "@/hooks/useQueryParams";
import galleryService from "@/services/galleryService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import {
  Box,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BlankCard from "../components/shared/BlankCard";
import CreateAlbumModal from "./CreateAlbumModal";

const GalleryCard = () => {
  const [query, setQuery] = useQueryParams({
    page: 1,
    limit: 20,
  });
  const router = useRouter();
  // skeleton
  const {
    isPending: isLoading,
    error,
    data,
  } = useQuery({
    queryKey: ["albums", query],
    queryFn: () => galleryService.getGalleries(query),
  });

  const handleEdit = (album) => {
    router.push(`/admin/albums/${album?.slug}`);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item sm={12} lg={12}>
          <Stack direction="row" alignItems={"center"} mt={2}>
            <Box>
              <Typography variant="h3">
                Albums &nbsp;
                <Chip
                  label={data?.totalCount || 0}
                  color="secondary"
                  size="small"
                />
              </Typography>
            </Box>
            <Box ml="auto">
              <CreateAlbumModal />
            </Box>
          </Stack>
        </Grid>
        {data?.results?.map((album) => {
          return (
            <Grid item xs={12} lg={4} key={album.id}>
              <BlankCard className="hoverCard">
                {isLoading ? (
                  <>
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      width="100%"
                      height={220}
                    ></Skeleton>
                  </>
                ) : (
                  <Link href={`/admin/albums/${album?.slug}`}>
                    <CardMedia
                      component={"img"}
                      height="220"
                      alt={album.name}
                      src={album.thumbnail}
                    />
                  </Link>
                )}
                <Box p={3}>
                  <Stack direction="row" gap={1}>
                    <Box>
                      <Typography variant="h6">{album.name}</Typography>
                      <Typography variant="caption">
                        {/* {format(new Date(photo.time), "E, MMM d, yyyy")}
                         */}
                        {album?.imageCount || 0} Photos
                      </Typography>
                    </Box>
                    <Box ml={"auto"}>
                      <ActionToolTip item={album} handleEdit={handleEdit} />
                    </Box>
                  </Stack>
                </Box>
              </BlankCard>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default GalleryCard;

const ActionToolTip = ({ item, handleEdit }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    SweetAlert.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        galleryService.deleteAlbum(item.id).then((res) => {
          queryClient.invalidateQueries({
            queryKey: ["albums"],
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
        id={`item__${item.id}`}
        aria-controls={open ? `item__${item.id}` : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <IconDotsVertical size="16" />
      </IconButton>
      <Menu
        id={`item__${item.id}`}
        MenuListProps={{
          "aria-labelledby": `item__${item.id}`,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem key="edit" onClick={handleClose}>
          <IconButton title="Edit Caption" onClick={() => handleEdit(item)}>
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
