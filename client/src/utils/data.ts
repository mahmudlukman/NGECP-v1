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

import {
  LuLayoutDashboard,
  LuUsers,
  LuUser,
  LuBadgePlus,
  LuLocate,
  LuUserPen,
  LuFileText,
} from "react-icons/lu";
import { GiPowerGenerator } from "react-icons/gi";
import type { IconType } from "react-icons";

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

export const faqs = [
  {
    question: "What services does your platform provide?",
    answer:
      "We offer generator registration, compliance monitoring, inspection scheduling, and performance analytics — all through a unified, easy-to-use dashboard.",
  },
  {
    question: "Who can register a generator?",
    answer:
      "Both individuals and companies can register their generators. Once registered, you can manage inspections, compliance records, and performance reports seamlessly.",
  },
  {
    question: "What do I gain by registering my generator?",
    answer:
      "Registering your generator gives you access to verified maintenance records, fuel efficiency insights, and timely inspection reminders. It also protects your investment by ensuring compliance with safety standards, reducing the risk of breakdowns and costly repairs while contributing to a cleaner, safer environment.",
  },
  {
    question: "What is compliance scoring?",
    answer:
      "Compliance scoring measures how well a generator adheres to environmental and safety regulations. The system automatically updates scores based on inspection results.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We implement enterprise-grade encryption and access control to ensure that all user and generator data remain safe and confidential.",
  },
  {
    question: "How does generator registration benefit my community?",
    answer:
      "Registered generators are tracked for emissions and safety standards, reducing air and noise pollution. This means cleaner air, quieter neighborhoods, and a more sustainable environment for everyone around you.",
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

export type UserRole = "admin" | "editor" | "user";

export interface SideMenuItem {
  id: string;
  name: string;
  icon: IconType;
  path: string;
  visible: UserRole[];
}

export const SIDE_MENU_DATA: SideMenuItem[] = [
  // Admin
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
    visible: ["admin", "editor"] as UserRole[],
  },

  {
    id: "register-generator",
    name: "Register Generator",
    icon: LuBadgePlus,
    path: "/admin/register-generator",
    visible: ["admin", "editor"] as UserRole[],
  },

  {
    id: "generators-map-view",
    name: "Generators Map View",
    icon: LuLocate,
    path: "/admin/generators-map-view",
    visible: ["admin", "editor"] as UserRole[],
  },

  {
    id: "manage-generators",
    name: "Manage Generators",
    icon: GiPowerGenerator,
    path: "/admin/manage-generators",
    visible: ["admin", "editor"] as UserRole[],
  },

  {
    id: "manage-users",
    name: "Manage Users",
    icon: LuUsers,
    path: "/admin/manage-users",
    visible: ["admin"] as UserRole[],
  },

  {
    id: "inspections",
    name: "Inspections",
    icon: LuUserPen,
    path: "/admin/inspections",
    visible: ["admin", "editor"] as UserRole[],
  },

  {
    id: "reports",
    name: "Reports",
    icon: LuFileText,
    path: "/admin/reports",
    visible: ["admin", "editor"] as UserRole[],
  },

  // User
  {
    id: "my-generators-map-view",
    name: "Generators Map View",
    icon: LuLocate,
    path: "/user/my-generators-map-view",
    visible: ["user"] as UserRole[],
  },

  {
    id: "user-register-generator",
    name: "Register Generator",
    icon: LuBadgePlus,
    path: "/user/register-generator",
    visible: ["user"] as UserRole[],
  },

  {
    id: "generators",
    name: "Manage Generators",
    icon: GiPowerGenerator,
    path: "/user/generators",
    visible: ["user"] as UserRole[],
  },

  {
    id: "my-inspections",
    name: "Inspections",
    icon: LuUserPen,
    path: "/user/my-inspections",
    visible: ["user"] as UserRole[],
  },

  {
    id: "my-reports",
    name: "Reports",
    icon: LuFileText,
    path: "/user/my-reports",
    visible: ["user"] as UserRole[],
  },

  {
    id: "profile",
    name: "My Profile",
    icon: LuUser,
    path: "/user/profile",
    visible: ["user"] as UserRole[],
  },
];
