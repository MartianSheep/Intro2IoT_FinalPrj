import React from "react";
import {
  DesktopOutlined,
  HomeOutlined,
  PieChartOutlined,
  EnvironmentOutlined,
  WifiOutlined,
  // TeamOutlined,
  // UserOutlined,
} from "@ant-design/icons";
// import Icon from "@ant-design/icons";
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
    <Link to="/">
      <HomeOutlined />
      <span>山屋水情</span>
    </Link>,
    "1"
  ),
  getItem(
    <Link to="/map">
      <EnvironmentOutlined />
      <span>地圖</span>
    </Link>,
    "2"
  ),
  getItem(
    <Link to="/devices">
      <WifiOutlined />
      <span>通訊站</span>
    </Link>,
    "3"
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
