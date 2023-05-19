import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import { usePortfolioContext } from "../../context/projectsContext";
import { usePortfolio } from "../../hooks/usePortfolio";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

export default function PortfolioForm() {
  const {
    open,
    editPressed,
    handleClose,
    clearFormData,
    formData,
    setFormData,
    droppedImage,
    setDroppedImage,
    droppedHoverImage,
    setDroppedHoverImage,
  } = usePortfolioContext();

  const { addProject, editProject, uploadToSupabase } = usePortfolio();

  const [formErrors, setFormErrors] = useState({});
  const validationErrors = {};

  const validateField = (fieldName, fieldValue, errorMessages) => {
    if (fieldValue.trim() === "") {
      errorMessages[fieldName] = `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required.`;
    }
  };

  const handleFormChange = (e) => {
    if (e.target.name === "title") {
      setFormData((prevState) => ({
        ...prevState,
        title: e.target.value,
      }));
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setFormErrors((prevState) => ({
      ...prevState,
      [e.target.name]: null,
    }));
  };

  const resetForm = () => {
    setDroppedImage("");
    setDroppedHoverImage("");
    handleClose();
    clearFormData();
  };

  const handleCreateProject = async () => {
    validateField("title", formData.title, validationErrors);
    validateField("desc", formData.desc, validationErrors);
    validateField("link", formData.link, validationErrors);
    validateField("category", formData.category, validationErrors);

    if (droppedImage === "" && formData.mainImage.trim() === "") {
      validationErrors.mainImage = "Main Image is required.";
    }

    if (droppedHoverImage === "" && formData.hoverImage.trim() === "") {
      validationErrors.hoverImage = "Hover Image is required.";
    }

    // If there are errors, set the formErrors state and prevent submission
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    const imageKey = uuidv4();
    addProject({
      ...formData,
      imageKey,
    });
    uploadToSupabase([
      { name: imageKey, file: droppedImage },
      { name: `${imageKey}-hover`, file: droppedHoverImage },
    ]);

    resetForm();
  };

  const handleEditProject = async () => {
    validateField("title", formData.title, validationErrors);
    validateField("desc", formData.desc, validationErrors);
    validateField("link", formData.link, validationErrors);
    validateField("category", formData.category, validationErrors);

    // If there are errors, set the formErrors state and prevent submission
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    editProject(formData);
    uploadToSupabase([
      { name: formData.imageKey, file: droppedImage },
      { name: `${formData.imageKey}-hover`, file: droppedHoverImage },
    ]);

    resetForm();
  };

  // Dropzone Config begins

  const { getRootProps: getRootMainProps, getInputProps: getInputMainProps } =
    useDropzone({
      "image/*": [".png", ".jpeg", ".jpg"],
      onDrop: (acceptedFile) => {
        setDroppedImage(
          Object.assign(acceptedFile[0], {
            preview: URL.createObjectURL(acceptedFile[0]),
          })
        );
      },
    });

  const { getRootProps: getRootHoverProps, getInputProps: getInputHoverProps } =
    useDropzone({
      "image/*": [".png", ".jpeg", ".jpg"],
      onDrop: (acceptedFile) => {
        setDroppedHoverImage(
          Object.assign(acceptedFile[0], {
            preview: URL.createObjectURL(acceptedFile[0]),
          })
        );
      },
    });

  // Dropzone Config ends

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>
          {editPressed ? "Edit Project" : "Add Project"}
        </DialogTitle>
        <DialogContent>
          <form>
            <TextField
              name="title"
              required
              label="Title"
              placeholder="A brief title for this project"
              fullWidth
              margin="normal"
              value={formData.title}
              onChange={handleFormChange}
              error={!!formErrors.title} // Check if there is an error for the "title" field
              helperText={formErrors.title} // Display the error message for the "title" field
            />
            <TextField
              name="desc"
              required
              label="Description"
              placeholder="How would you describe this project?"
              fullWidth
              margin="normal"
              value={formData.desc}
              onChange={handleFormChange}
              error={!!formErrors.desc} // Check if there is an error for the "desc" field
              helperText={formErrors.desc} // Display the error message for the "desc" field
            />
            <TextField
              name="link"
              required
              label="Link"
              placeholder="Example: https://yourproject.com"
              fullWidth
              margin="normal"
              value={formData.link}
              onChange={handleFormChange}
              error={!!formErrors.link} // Check if there is an error for the "link" field
              helperText={formErrors.link} // Display the error message for the "link" field
            />
            <TextField
              name="category"
              required
              label="Category"
              placeholder="Use only one word if possible"
              fullWidth
              margin="normal"
              value={formData.category}
              onChange={handleFormChange}
              error={!!formErrors.category} // Check if there is an error for the "category" field
              helperText={formErrors.category} // Display the error message for the "category" field
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <Box
                component="span"
                sx={{ p: 2, border: "1px dashed grey" }}
                {...getRootMainProps({ className: "dropzone" })}
              >
                <input {...getInputMainProps()} />
                {!droppedImage.preview && formData.mainImage === "" ? (
                  <>
                    <p style={{ fontSize: "14px" }}>
                      Drag 'n' drop your <strong>main</strong> image here, or
                      click to select files.
                    </p>
                    <h5>Accepted types: .png, .jpeg, .jpg</h5>
                  </>
                ) : (
                  <img
                    src={
                      droppedImage.preview
                        ? droppedImage.preview
                        : formData.mainImage
                    }
                    alt="main image"
                    width="100%"
                  />
                )}
                {formErrors.mainImage && (
                  <p style={{ color: "red", fontSize: "14px" }}>
                    {formErrors.mainImage}
                  </p>
                )}
              </Box>
              <Box
                component="span"
                sx={{ p: 2, border: "1px dashed grey" }}
                {...getRootHoverProps({ className: "dropzone" })}
              >
                <input {...getInputHoverProps()} />
                {!droppedHoverImage.preview && formData.hoverImage === "" ? (
                  <>
                    <p style={{ fontSize: "14px" }}>
                      Drag 'n' drop your <strong>hover</strong> image here, or
                      click to select files.
                    </p>
                    <h5>Accepted types: .png, .jpeg, .jpg</h5>
                  </>
                ) : (
                  <img
                    src={
                      droppedHoverImage.preview
                        ? droppedHoverImage.preview
                        : formData.hoverImage
                    }
                    alt="hover image"
                    width="100%"
                  />
                )}
                {formErrors.hoverImage && (
                  <p style={{ color: "red", fontSize: "14px" }}>
                    {formErrors.hoverImage}
                  </p>
                )}
              </Box>
            </Box>
          </form>
        </DialogContent>
        <DialogActions style={{ marginRight: "16px", marginBottom: "16px" }}>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={() => handleClose()}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() =>
              editPressed ? handleEditProject() : handleCreateProject()
            }
            color={editPressed ? "warning" : "success"}
          >
            {editPressed ? "Edit" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
