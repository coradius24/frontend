import apiService from "@/services/api/apiService";
import { showToast } from "@/utils/lib";
import { Box } from "@mui/material";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

// @ts-ignore
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const AppTextEditor = ({
  placeholder,
  ...restProps
}) => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  return (
    <Editor
      placeholder={placeholder || "Type or paste your content here!"}
      editorLoaded={editorLoaded}
      {...restProps}
    />
  );
};

const Editor = ({
  placeholder,
  onChange,
  editorLoaded,
  inputLabel,
  labelFontSize = "12px",
  labelFontWeight = "600",
  name,
  height,
  value,
  error
}) => {
  const placeholderStyles = `
  .sun-editor .se-wrapper .se-placeholder {
    color: #858585;
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;
  return (
    <Box>
      {editorLoaded ? (
        <Box>
          <style>{placeholderStyles}</style>
          <SunEditor
            // @ts-ignore
            style={{
              padding: "0px 10px",
              margin: 0
            }}
            placeholder={placeholder}
            onChange={(data) => {
              onChange && onChange(data);
            }}
            name={name}
            defaultValue={ value || ""}
            setContents={value || ""}
            height={`${height || 240}px`}
            setOptions={{
              resizingBar: false,
              resizeEnable: true,
              buttonList: [
                ["undo", "redo"],
                ["font", "fontSize", "formatBlock"],
                ["paragraphStyle", "blockquote"],
                [
                  "bold",
                  "underline",
                  "italic",
                  "strike",
                  "subscript",
                  "superscript",
                ],
                ["fontColor", "hiliteColor", "textStyle"],
                ["removeFormat"],
                ["outdent", "indent"],
                ["align", "horizontalRule", "list", "lineHeight"],
                ["table", "link", "image", "video", "audio"],
                ["fullScreen", "showBlocks", "codeView"],
                ["preview"],
              ],
            }}
            // @ts-ignore
            onImageUploadBefore={handleImageUploadBefore}
          />
        </Box>
      ) : (
        <div>Loading..</div>
      )}
    </Box>
  );
};

export const TextEditorContent = ({
  children,
  overrideClassName,
  style,
}) => {
  return (
    <div
      style={style}
      className={`sun-editor-editable view ${overrideClassName}`}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
};

export default AppTextEditor;

const handleFileUpload = async (file) => {
  try {
    // const fileExtention = file?.name?.split(".").slice(-1)[0];
    // const PreSignedData = await storageDataService.getPreSignedUrl(
    //   itemId,
    //   `${itemId}.${fileExtention}`
    // );
    // await storageDataService.uploadPublicPresignedFile(
    //   PreSignedData?.UploadUrl,
    //   file
    // );

    const formData = new FormData();
    formData.append("file", file);
    try {
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      let response = await apiService.put(
        `/api/admin/files`,
        formData,
        config
      );
      response = await response.json();
      if (response.id) {
        showToast("Photo Updated!");
      } else {
        showToast(response.message, "error");
      }
      return response;
    } catch (error) {
      if (error.statusCode === 413) {
        showToast("File size too large, try less than 100kb", "error");
      }
    }
  } catch (err) {
    //
  }
};

function handleImageUploadBefore(files, _info, uploadHandler) {
  let res;
  (async () => {
    // const formData = new FormData();
    // formData.append("file", files[0]);


    const {url} = await handleFileUpload(files[0]);

    res = {
      result: [
        {
          url,
          name: "thumbnail",
        },
      ],
    };
    uploadHandler(res);
  })();
}



// todo

