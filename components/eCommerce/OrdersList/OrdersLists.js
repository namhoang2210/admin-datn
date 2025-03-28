// OrdersLists.js
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import {
  Box, Card, Typography, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow,
  Paper, IconButton, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const api = process.env.NEXT_PUBLIC_API_URL;

const OrdersLists = () => {
  const [orders, setOrders] = useState([]);
  const [select, setSelect] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState([]);

  const orderStatuses = ["PENDING", "CONFIRMED", "PAID", "CANCELLED", "COMPLETED"];

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${api}/api/admin/orders/all`);
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
    }
  };

  const fetchUsers = async () => {
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
  };

  const deleteOrder = async (orderId) => {
    if (!confirm("Bạn có chắc muốn xoá đơn hàng này?")) return;
    try {
      await axios.delete(`${api}/api/admin/orders/${orderId}`);
      fetchOrders();
    } catch (err) {
      console.error("Lỗi khi xoá đơn hàng:", err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${api}/api/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      alert("Cập nhật trạng thái thành công!");
      fetchOrders();
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const getUserName = (userId) => {
    console.log("user", users);
    console.log("userId", userId);
    const user = users.find(user => user.id === userId);
    return user ? user.name : "Unknown";
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  return (
    <Card sx={{ boxShadow: "none", borderRadius: "10px", p: 3, mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Recent Orders</Typography>
        <FormControl size="small">
          <InputLabel>Lọc theo trạng thái</InputLabel>
          <Select sx={{ width: '200px'}} value={select} onChange={(e) => setSelect(e.target.value)} label="Lọc theo">
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
            <MenuItem value="PAID">PAID</MenuItem>
            <MenuItem value="CANCELLED">CANCELLED</MenuItem>
            <MenuItem value="COMPLETED">COMPLETED</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table sx={{ minWidth: 950 }}>
          <TableHead sx={{ background: "#F7FAFF" }}>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(rowsPerPage > 0 ? orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : orders)
              .filter(order => !select || order.orderStatus === select)
              .map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{getUserName(order.userId)}</TableCell>
                  <TableCell>{order.orderDetails?.[0].productName}</TableCell>
                  <TableCell>{order.orderDetails?.[0].quantity}</TableCell>
                  <TableCell>{order.totalAmount}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                    >
                      {orderStatuses.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => deleteOrder(order.orderId)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={orders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default OrdersLists;
