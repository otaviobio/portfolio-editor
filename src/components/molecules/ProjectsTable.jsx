import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "../../../styles/ProjectsTable.scss"
import { Button } from "@mui/material";
import { usePortfolioContext } from "../../context/projectsContext";

// function createData(title, desc, link, category, imageKey) {
//   return { title, desc, link, category, imageKey };
// }

function ProjectsTable({ projectData }) {
  const { openModal, setFormData, setEditPressed } = usePortfolioContext();

  function handleOpenModal(project) {
    if (project && project.id != "") {
      setFormData({
        title: project.title,
        desc: project.desc,
        link: project.link,
        category: project.category,
        imageKey: project.imageKey,
        id: project.id,
        // these last two are just to show the images on react-dropzone
        mainImage: project.image,
        hoverImage: project.hoverImage
      });
      setEditPressed(true);
    }
    openModal();
  }

  // const rows = projectData.map((project) =>
  //   createData(
  //     project.title,
  //     project.desc,
  //     project.link,
  //     project.category,
  //     project.imageKey
  //   )
  // );

  return (
    <main className={styles.container}>
      <Button variant="contained" onClick={() => handleOpenModal()}>
        Add Project
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">Link</TableCell>
              <TableCell align="left">Category</TableCell>
              <TableCell align="left">Image Key</TableCell>
              <TableCell align="left">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectData.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="left">{row.desc}</TableCell>
                <TableCell align="left">{row.link}</TableCell>
                <TableCell align="left">{row.category}</TableCell>
                <TableCell align="left">{row.imageKey}</TableCell>
                <TableCell align="left">
                  <Button
                    variant="contained"
                    onClick={() => handleOpenModal(row)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </main>
  );
}

export default ProjectsTable;
