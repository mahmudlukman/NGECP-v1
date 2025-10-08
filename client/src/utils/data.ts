import logo from "../assets/logo.svg";
import search_icon from "../assets/search_icon.svg";
import remove_icon from "../assets/remove_icon.svg";
import arrow_right_icon_colored from "../assets/arrow_right_icon_colored.svg";
import star_icon from "../assets/star_icon.svg";
import star_dull_icon from "../assets/star_dull_icon.svg";
import cart_icon from "../assets/cart_icon.svg";
import nav_cart_icon from "../assets/nav_cart_icon.svg";
import add_icon from "../assets/add_icon.svg";
import refresh_icon from "../assets/refresh_icon.svg";
import product_list_icon from "../assets/product_list_icon.svg";
import order_icon from "../assets/order_icon.svg";
import upload_area from "../assets/upload_area.png";
import menu_icon from "../assets/menu_icon.svg";
import delivery_truck_icon from "../assets/delivery_truck_icon.svg";
import leaf_icon from "../assets/leaf_icon.svg";
import coin_icon from "../assets/coin_icon.svg";
import box_icon from "../assets/box_icon.svg";
import trust_icon from "../assets/trust_icon.svg";
import black_arrow_icon from "../assets/black_arrow_icon.svg";
import white_arrow_icon from "../assets/white_arrow_icon.svg";
import add_address_image from "../assets/add_address_image.svg";
import hero_img from "../assets/hero_img.png";
import about_img from "../assets/about_img.jpg";
import { ClockFadingIcon, HeadsetIcon, SendIcon } from "lucide-react";

export const assets = {
  logo,
  search_icon,
  remove_icon,
  arrow_right_icon_colored,
  star_icon,
  star_dull_icon,
  cart_icon,
  nav_cart_icon,
  add_icon,
  refresh_icon,
  product_list_icon,
  order_icon,
  upload_area,
  menu_icon,
  delivery_truck_icon,
  leaf_icon,
  coin_icon,
  trust_icon,
  black_arrow_icon,
  white_arrow_icon,
  hero_img,
  about_img,
  add_address_image,
  box_icon,
};


export const ourSpecsData = [
  {
    title: "Generator Registration",
    description:
      "Easily register your generator with our secure online portal to comply with national emission regulations.",
    icon: SendIcon,
    accent: "#05DF72",
  },
  {
    title: "Real-Time Monitoring",
    description:
      "Track emission levels and generator performance through our advanced monitoring system.",
    icon: ClockFadingIcon,
    accent: "#FF8904",
  },
  {
    title: "Data Insights",
    description:
      "View reports and statistics to understand the impact of our program on Nigeria’s environment.",
    icon: HeadsetIcon,
    accent: "#A684FF",
  },
];

export const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { text: "Home", url: "#" },
      { text: "Best Sellers", url: "#" },
      { text: "Offers & Deals", url: "#" },
      { text: "Contact Us", url: "#" },
      { text: "FAQs", url: "#" },
    ],
  },
  {
    title: "Need help?",
    links: [
      { text: "Delivery Information", url: "#" },
      { text: "Return & Refund Policy", url: "#" },
      { text: "Payment Methods", url: "#" },
      { text: "Track your Order", url: "#" },
      { text: "Contact Us", url: "#" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { text: "Instagram", url: "#" },
      { text: "Twitter", url: "#" },
      { text: "Facebook", url: "#" },
      { text: "YouTube", url: "#" },
    ],
  },
];


import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
  LuUsers,
} from "react-icons/lu";
import { MdOutlineShoppingCart } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Add Product",
    icon: LuWalletMinimal,
    path: "/admin/add-product",
  },
  {
    id: "03",
    label: "All Orders",
    icon: MdOutlineShoppingCart,
    path: "/admin/all-orders",
  },
  {
    id: "04",
    label: "All Products",
    icon: AiOutlineProduct,
    path: "/admin/all-products",
  },
  {
    id: "05",
    label: "All Users",
    icon: LuUsers,
    path: "/admin/all-users",
  },
  {
    id: "06",
    label: "Coupons",
    icon: LuHandCoins,
    path: "/admin/coupons",
  },

  {
    id: "07",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];
