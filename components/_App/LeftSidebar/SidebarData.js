import React from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GridViewIcon from "@mui/icons-material/GridView";
import LayersIcon from "@mui/icons-material/Layers";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LockIcon from "@mui/icons-material/Lock";
import SettingsIcon from "@mui/icons-material/Settings";
import PostAddIcon from "@mui/icons-material/PostAdd";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AddchartIcon from "@mui/icons-material/Addchart";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { CardGiftcardOutlined } from "@mui/icons-material";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/",
    icon: <GridViewIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Admins",
    path: "/projects/admin/",
    icon: <CopyAllIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Users",
    path: "/projects/user/",
    icon: <CopyAllIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Products",
    path: "/ecommerce/products/",
    icon: <CardGiftcardOutlined />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Orders",
    path: "/ecommerce/orders-list/",
    icon: <ShoppingCartCheckoutIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  // {
  //   title: "eCommerce",
  //   path: "/ecommerce/products/",
  //   icon: <ShoppingCartCheckoutIcon />,
  //   iconClosed: <KeyboardArrowRightIcon />,
  //   iconOpened: <KeyboardArrowDownIcon />,

  //   subNav: [
  //     {
  //       title: "Product Details",
  //       path: "/ecommerce/product-details/",
  //     },
  //     {
  //       title: "Create Product",
  //       path: "/ecommerce/create-product/",
  //     },
  //     {
  //       title: "Orders List",
  //       path: "/ecommerce/orders-list/",
  //     },
  //     {
  //       title: "Order Details",
  //       path: "/ecommerce/order-details/",
  //     },
  //     {
  //       title: "Customers",
  //       path: "/ecommerce/customers/",
  //     },
  //     {
  //       title: "Cart",
  //       path: "/ecommerce/cart/",
  //     },
  //     {
  //       title: "Checkout",
  //       path: "/ecommerce/checkout/",
  //     },
  //     {
  //       title: "Sellers",
  //       path: "/ecommerce/sellers/",
  //     },
  //   ],
  // },
];
