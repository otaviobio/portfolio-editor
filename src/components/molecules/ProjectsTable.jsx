import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { usePortfolioContext } from '../../context/projectsContext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';

function ProjectsTable({ projectData }) {
  const { openModal, setFormData, setEditPressed } = usePortfolioContext();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    selectedId: null,
  });

  const { deleteProjectById, isLoading } = usePortfolio();

  function handleOpenModal(project) {
    if (project && project.id != '') {
      setFormData({
        title: project.title,
        desc: project.desc,
        link: project.link,
        category: project.category,
        imageKey: project.imageKey,
        id: project.id,
        // these last two are just to show the images on react-dropzone
        mainImage: project.image,
        hoverImage: project.hoverImage,
      });
      setEditPressed(true);
    }
    openModal();
  }

  return (
    <main style={{padding: "32px 24px"}}>
      <Button
        style={{marginBottom: "32px"}}
        variant="contained"
        onClick={() => handleOpenModal()}
        sx={{
          color: "#b1e319",
          backgroundColor: "#36454F",
          ":hover": {
            bgcolor: "#b1e319",
            color: "#36454F",
          },
        }}
      >
        Add Project
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{backgroundColor: "#b1e319"}}>
              <TableCell align="left"><h3>Title</h3></TableCell>
              <TableCell align="left"><h3>Description</h3></TableCell>
              <TableCell align="left"><h3>Link</h3></TableCell>
              <TableCell align="left"><h3>Category</h3></TableCell>
              <TableCell align="left"><h3>Actions</h3></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectData.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: "#f4f4f4" }}
              >
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="left">{row.desc}</TableCell>
                <TableCell align="left"><a href={row.link} target='_blank'>{row.link}</a></TableCell>
                <TableCell align="left">{row.category}</TableCell>
                <TableCell align="left">
                  <Box sx={{ display: 'flex', gap: '5px' }}>
                    <IconButton
                      color="warning"
                      variant="contained"
                      onClick={() => handleOpenModal(row)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          selectedId: row.id,
                        });
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, selectedId: null })}
      >
        <DialogTitle>Are you sure you want to delete this project?</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isLoading}
            variant="contained"
            color="secondary"
            onClick={() =>
              setConfirmDialog({ isOpen: false, selectedId: null })
            }
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading}
            variant="outlined"
            color="error"
            autoFocus
            onClick={async () => {
              await deleteProjectById(confirmDialog.selectedId);
              setConfirmDialog({ isOpen: false, selectedId: null });
            }}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </main>
  );
}

export default ProjectsTable;
