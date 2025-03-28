import * as React from "react";
import { Box, Typography, IconButton, Tooltip, Card, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Paper, Checkbox } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import axios from "@/lib/axios";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function UsersList(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => onPageChange(event, 0);
  const handleBackButtonClick = (event) => onPageChange(event, page - 1);
  const handleNextButtonClick = (event) => onPageChange(event, page + 1);
  const handleLastPageButtonClick = (event) => onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function UserPage() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/user-profile`);
      const data = res.data.map((user) => ({
        id: user.id,
        name: user.fullName,
        userName: `@${user.username}`,
        image: user.avatar,
        email: `${user.username}@gmail.com`,
        rolls: "User",
        status: "Active",
        badgeClass: "successBadge",
      }));
      setUsers(data);
    } catch (err) {
      console.error("Lỗi lấy danh sách user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa user này không?")) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/user-profile/${id}`);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error("Lỗi xoá user:", err);
      alert("Xoá thất bại!");
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div className={styles.pageTitle}>
        <h1>Users</h1>
        <ul>
          <li><Link href="/">Dashboard</Link></li>
          <li>Users</li>
        </ul>
      </div>

      <Card sx={{ boxShadow: "none", borderRadius: "10px", p: "25px 20px 15px", mb: "15px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #EEF0F7", paddingBottom: "10px", mb: "20px" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Users List</Typography>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table sx={{ minWidth: 900 }} aria-label="users table" className="dark-table">
            <TableHead sx={{ background: "#F7FAFF" }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Roles</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : users
              ).map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ display: "flex", alignItems: "center" }}>
                    <Checkbox {...label} size="small" />
                    <Box sx={{ display: "flex", alignItems: "center" }} className="ml-10px">
                      <img src={user.image} alt="User" width={40} height={40} className="borRadius100" />
                      <Box>
                        <Typography sx={{ fontWeight: 500, fontSize: "13.5px" }} className="ml-10px">{user.name}</Typography>
                        <Typography sx={{ fontSize: "12px", color: "#A9A9C8" }} className="ml-10px">{user.userName}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.rolls}</TableCell>
                  <TableCell align="center">
                    <span className={user.badgeClass}>{user.status}</span>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Remove" placement="top">
                      <IconButton size="small" color="error" onClick={() => handleDelete(user.id)}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Rename" placement="top">
                      <IconButton size="small" color="primary">
                        <DriveFileRenameOutlineIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={5}
                  count={users.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={UsersList}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
}
