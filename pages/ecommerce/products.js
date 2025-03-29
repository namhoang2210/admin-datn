/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import axios from "@/lib/axios";
import { Box, Typography, Button, Grid, Modal, Fade, Backdrop, TextField, FormControl, InputLabel, Select, MenuItem, Card, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import { TextareaAutosize } from "@mui/base";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "100%",
  maxWidth: "700px",
  width: "100%",
  overflow: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
};

function ProductTablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function Products() {
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [categorySelect, setCategorySelect] = React.useState("");
  const [typeSelect, setTypeSelect] = React.useState("");
  const [editingProduct, setEditingProduct] = React.useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
    setCategorySelect("");
    setTypeSelect("");
  };
  const handleCategoryChange = (event) => {
    setCategorySelect(Number(event.target.value));
  };

  const fetchProductsAndCategories = async () => {
    try {
      const [productRes, categoryRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/categories/all`),
      ]);
      const sortedProducts = productRes.data.sort((a, b) => b.bicycleId - a.bicycleId);
      setProducts(sortedProducts);
      setCategories(categoryRes.data);
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  
    const productData = {
      name: data.get("productName"),
      description: data.get("description"),
      image: data.get("imageUrl"),
      rating: 5.0,
      type: typeSelect,
      originalPrice: parseFloat(data.get("price")),
      quantity: 0,
      categoryId: parseInt(categorySelect, 10),
    };
  
    try {
      if (editingProduct) {
        // Đang sửa
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${editingProduct.bicycleId}`, productData);
      } else {
        // Tạo mới
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`, productData);
      }
  
      handleClose();
      setEditingProduct(null);
      fetchProductsAndCategories();
    } catch (error) {
      console.error("Lỗi khi submit sản phẩm:", error);
    }
  };  

  const handleDelete = async (id) => {
    if(confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?") === false) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${id}`);
      fetchProductsAndCategories();
    } catch (error) {
      console.error("Lỗi khi xoá sản phẩm:", error);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setCategorySelect(product.categoryId);
    setTypeSelect(product.type);
    setOpen(true);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  return (
    <>
      <div className={styles.pageTitle}>
        <h1>Products</h1>
        <ul>
          <li><Link href="/">Dashboard</Link></li>
          <li>Products</li>
        </ul>
      </div>

      <Card sx={{ boxShadow: "none", borderRadius: "10px", p: "25px 25px 10px", mb: "15px" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "10px" }}>
          <Typography as="h3" sx={{ fontSize: 18, fontWeight: 500 }}>Products</Typography>
          <Button onClick={handleOpen} variant="contained" sx={{ textTransform: "capitalize", borderRadius: "8px", fontWeight: "500", fontSize: "13px", padding: "12px 20px", color: "#fff !important" }}>
            <AddIcon sx={{ position: "relative", top: "-1px" }} className="mr-5px" /> Create Product
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table sx={{ minWidth: 850 }} aria-label="custom pagination table" className="dark-table">
            <TableHead sx={{ background: "#F7FAFF" }}>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Orders</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0 ? products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : products).map((row) => (
                <TableRow key={row.bicycleId}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <img src={row.image} alt="Product Img" width={50} className="borderRadius10" />
                      <Typography sx={{ fontWeight: "500", fontSize: "13px", marginLeft: "10px" }}>{row.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.category?.name}</TableCell>
                  <TableCell align="center">${row.originalPrice}</TableCell>
                  <TableCell align="center">0</TableCell>
                  <TableCell align="center">{row.rating}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View" placement="top"><IconButton size="small" color="info"><VisibilityIcon fontSize="inherit" /></IconButton></Tooltip>
                    <Tooltip title="Edit" placement="top">
                      <IconButton size="small" color="primary" onClick={() => handleEdit(row)}>
                        <DriveFileRenameOutlineIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>                    
                    <Tooltip title="Remove" placement="top">
                      <IconButton size="small" color="error" onClick={() => handleDelete(row.bicycleId)}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && <TableRow style={{ height: 53 * emptyRows }}><TableCell colSpan={7} /></TableRow>}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={7}
                  count={products.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{ inputProps: { "aria-label": "rows per page" }, native: true }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={ProductTablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Card>

      {/* Create Product Modal */}
      <Modal open={open} onClose={handleClose} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
        <Fade in={open}>
          <Box sx={modalStyle} className="bg-black">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EDEFF5", borderRadius: "8px", padding: "20px 20px" }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: "500", fontSize: "17px" }}>Create Product</Typography>
              <IconButton size="small" onClick={handleClose}><ClearIcon /></IconButton>
            </Box>

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ background: "#fff", padding: "30px 20px", borderRadius: "8px" }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>Product Name</Typography>
                  <TextField 
                    name="productName" 
                    required fullWidth label="Product Name" 
                    InputProps={{ style: { borderRadius: 8 } }} 
                    defaultValue={editingProduct?.name || ""}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>Category</Typography>
                  <FormControl fullWidth>
                    <InputLabel>Select</InputLabel>
                    <Select
                      value={categorySelect || ""}
                      label="Category"
                      onChange={(e) => handleCategoryChange(e)}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat.categoryId} value={cat.categoryId}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>Price</Typography>
                  <TextField 
                    name="price" required fullWidth label="$0" type="number" InputProps={{ style: { borderRadius: 8 } }} 
                    defaultValue={editingProduct?.originalPrice || ""}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>Type</Typography>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={typeSelect || ""}
                      label="Type"
                      onChange={(e) => setTypeSelect(e.target.value)}
                    >
                        <MenuItem value="HOT">HOT</MenuItem>
                        <MenuItem value="NEW">NEW</MenuItem>
                        <MenuItem value="SALE">SALE</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>Product Description</Typography>
                  <TextField 
                    name="description" required multiline minRows={3} fullWidth label="Description" InputProps={{ style: { borderRadius: 8 } }} 
                    defaultValue={editingProduct?.description || ""}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>Image URL</Typography>
                  <TextField 
                    name="imageUrl" required fullWidth label="https://example.com/image.jpg" InputProps={{ style: { borderRadius: 8 } }} 
                    defaultValue={editingProduct?.image || ""}
                  />
                </Grid>

                <Grid item xs={12} textAlign="end">
                  <Button variant="contained" color="secondary" sx={{ textTransform: "capitalize", borderRadius: "8px", fontWeight: "500", fontSize: "13px", padding: "12px 20px", mr: 2 }} onClick={handleClose}><ClearIcon sx={{ position: "relative", top: "-1px" }} className="mr-5px" /> Cancel</Button>
                  <Button type="submit" variant="contained" sx={{ textTransform: "capitalize", borderRadius: "8px", fontWeight: "500", fontSize: "13px", padding: "12px 20px" }}><AddIcon sx={{ position: "relative", top: "-1px" }} className="mr-5px" /> {editingProduct ? 'Update Product' : 'Create Product'}</Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}