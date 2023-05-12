import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import { usePortfolioContext } from '../../context/projectsContext';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

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

  const handleFormChange = (e) => {
    if (e.target.name === 'title') {
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
  };

  const resetForm = () => {
    setDroppedImage('');
    setDroppedHoverImage('');
    handleClose();
    clearFormData();
  };

  const handleCreateProject = async () => {
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
      'image/*': ['.png', '.jpeg', '.jpg'],
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
      'image/*': ['.png', '.jpeg', '.jpg'],
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
          {editPressed ? 'Edit Project' : 'Add Project'}
        </DialogTitle>
        <DialogContent>
          <form>
            <TextField
              name="title"
              required
              label="Title"
              fullWidth
              margin="normal"
              value={formData.title}
              onChange={handleFormChange}
            />
            <TextField
              name="desc"
              required
              label="Description"
              fullWidth
              margin="normal"
              value={formData.desc}
              onChange={handleFormChange}
            />
            <TextField
              name="link"
              required
              label="Link"
              fullWidth
              margin="normal"
              value={formData.link}
              onChange={handleFormChange}
            />
            <TextField
              name="category"
              required
              label="Category"
              fullWidth
              margin="normal"
              value={formData.category}
              onChange={handleFormChange}
            />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              <Box
                component="span"
                sx={{ p: 2, border: '1px dashed grey' }}
                {...getRootMainProps({ className: 'dropzone' })}
              >
                <input {...getInputMainProps()} />
                {!droppedImage.preview && formData.mainImage === '' ? (
                  <>
                    <p>
                      Drag 'n' drop your main image here, or click to select
                      files
                    </p>
                    <h4>Accepted types: .png, .jpeg, .jpg</h4>
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
              </Box>
              <Box
                component="span"
                sx={{ p: 2, border: '1px dashed grey' }}
                {...getRootHoverProps({ className: 'dropzone' })}
              >
                <input {...getInputHoverProps()} />
                {!droppedHoverImage.preview && formData.hoverImage === '' ? (
                  <>
                    <p>
                      Drag 'n' drop your hover image here, or click to select
                      files
                    </p>
                    <h4>Accepted types: .png, .jpeg, .jpg</h4>
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
              </Box>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Cancel</Button>
          <Button
            onClick={() =>
              editPressed ? handleEditProject() : handleCreateProject()
            }
          >
            {editPressed ? 'Edit' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
