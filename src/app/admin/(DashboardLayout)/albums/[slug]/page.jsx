"use client";
import useQueryParams from "@/hooks/useQueryParams";
import galleryService from "@/services/galleryService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import {
  Box,
  CardMedia,
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
import { useState } from "react";
import BlankCard from "../../components/shared/BlankCard";
import AlbumBanner from "./AlbumBanner";
import UpdateCaption from "./UpdateCaption";

const GalleryCard = ({ params }) => {
  const [isOpen, setIsOpen] = useState({
    open: false,
    type: "add",
    data: {},
  });
  const filterPhotos = (photos, cSearch) => {
    if (photos)
      return photos.filter((t) =>
        t.name.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase())
      );

    return photos;
  };
  const [query, setQuery] = useQueryParams({
    page: 1,
    limit: 10000,
  });

  // skeleton
  const {
    isPending: isLoading,
    error,
    data,
  } = useQuery({
    queryKey: ["singleAlbum", params.slug, query],
    queryFn: () => galleryService.getGallery(params.slug, query),
  });

  return (
    <>
      <AlbumBanner
        {...(data?.album || {})}
        totalCount={data?.totalCount || 0}
      />
      <UpdateCaption setIsOpen={setIsOpen} isOpen={isOpen} />
      <Grid container mt={3} spacing={3}>
        {data?.results?.map((photo) => {
          return (
            <Grid item xs={12} lg={4} key={photo.id}>
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
                  <CardMedia
                    component={"img"}
                    height="220"
                    alt={photo.name}
                    src={photo.photo.url}
                  />
                )}
                <Box p={3}>
                  <Stack direction="row" gap={1}>
                    <Box>
                      <Typography variant="h6">{photo.name}</Typography>
                      <Typography variant="caption">
                        {/* {format(new Date(photo.time), "E, MMM d, yyyy")}
                         */}
                        {photo?.caption}
                      </Typography>
                    </Box>
                    <Box ml={"auto"}>
                      <ActionToolTip
                        setIsOpen={setIsOpen}
                        isOpen={isOpen}
                        item={photo}
                      />
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

const ActionToolTip = ({ item, setIsOpen }) => {
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
        galleryService.deletePhoto(item.id).then((res) => {
          queryClient.invalidateQueries({
            queryKey: ["singleAlbum"],
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
          <IconButton
            title="Edit Caption"
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
