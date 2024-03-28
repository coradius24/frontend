import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useEffect } from "react";
import * as yup from "yup";

import cmsService from "@/services/cmsService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { useLoading } from "@/utils/useCustomHook";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import { IoMdAddCircle } from "react-icons/io";
import TeamMemberAdd from "./TeamMemberAdd";

const validationSchema = yup.object({
  fullName: yup.string().required("Name is Required"),
  title: yup.string().required("Title is Required"),
});

const AddTeamMemberModal = ({ open, setOpen, data, action, setAction }) => {
  const { startLoading, stopLoading, isLoading } = useLoading(false);

  const handleClickOpen = () => {
    setAction("add");
    setOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      title: "",
      photo: "",
      isPublic: false,
      socialLinks: {
        facebook: "",
        twitter: "",
        linkedin: "",
      },
    },

    validationSchema,
    onSubmit: async (values) => {
      if (!values.photo) {
        return showToast("Please select photo!", "error");
      }
      const formData = new FormData();
      const data = {
        ...values,
      };

      for (const key in data) {
        if (key === "socialLinks") {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
      if (action === "edit" && data.id) {
        formData.delete("id");
        formData.delete("photoId");
        formData.delete("serialNumber");
        // formData.delete("isPublic");
      }

      if (action === "edit" && data.id && !values.photo.url) {
        const file = values.photo;
        if (!file.size) {
          formData.delete("photo");
        }
      }

      if (values.photo.url) {
        formData.delete("photo");
      }

      if (action === "edit" && data.id) {
        try {
          startLoading();
          const res = await cmsService.updateTemMember(data.id, formData);
          if (res?.statusCode === 500) {
            showToast(res.message, "error");
          } else {
            queryClient.invalidateQueries("AdminTeamMembers");
            showToast("Member updated");
            formik.resetForm();
            setOpen(false);
          }
        } catch (error) {
          showToast(error.message, "error");
        } finally {
          stopLoading();
        }
      } else {
        try {
          startLoading();
          const res = await cmsService.addTeamMember(formData);
          if (res.id) {
            showToast("Successfully Added!");
            queryClient.invalidateQueries("adminMember");
            formik.resetForm();
            setOpen(false);
          } else {
            showToast(res.message, "error");
          }
        } catch (error) {
          showToast(error.message, "error");
        } finally {
          stopLoading();
        }
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  useEffect(() => {
    if (data) {
      formik.setValues({
        ...data,
      });
      if (!data.socialLinks) {
        formik.setFieldValue("socialLinks", {
          facebook: "",
          twitter: "",
          linkedin: "",
        });
      }
    }
  }, [data]);

  let title = "Add New Member";
  if (action === "edit") {
    title = "Update Member";
  }

  return (
    <>
      <Button
        sx={{ width: "200px" }}
        startIcon={<IoMdAddCircle />}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Create Member
      </Button>

      <Dialog maxWidth="sm" fullWidth open={open}>
        <DialogTitle>{title}</DialogTitle>
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
          <form onSubmit={formik.handleSubmit}>
            {(action === "add" || action === "edit") && (
              <TeamMemberAdd
                buttonLabel={data && "Update Info"}
                formik={formik}
                isLoading={isLoading}
              />
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTeamMemberModal;
