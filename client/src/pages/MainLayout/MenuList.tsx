import React from "react";
import {
  DesktopOutlined,
  // FileOutlined,
  PieChartOutlined,
  // TeamOutlined,
  // UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    <Link to="/cabin">
      <DesktopOutlined />
      <span>列表</span>
    </Link>,
    "1"
  ),
  getItem(
    <Link to="/map">
      <PieChartOutlined />
      <span>地圖</span>
    </Link>,
    "2"
  ),
  // getItem("User", "sub1", <UserOutlined />, [
  //   getItem("Tom", "3"),
  //   getItem("Bill", "4"),
  //   getItem("Alex", "5"),
  // ]),
  // getItem("Team", "sub2", <TeamOutlined />, [
  //   getItem("Team 1", "6"),
  //   getItem("Team 2", "8"),
  // ]),
  // getItem("Files", "9", <FileOutlined />),
];

export default items;
