import React, { useState } from "react";
import urljoin from "url-join";
import {
  DesktopOutlined,
  FileOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import "antd/dist/reset.css";
import { useNavigate, Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import MapPage from "./pages/MapPage";

const { Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Map", "map", <CompassOutlined />),
  getItem("List", "list", <DesktopOutlined />),
  getItem("Files", "file", <FileOutlined />, [
    getItem("file1", "file1", <FileOutlined />),
  ]),
  // getItem("Files", "4", <FileOutlined />),
];

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [zoom, setZoom] = useState({ left: 0, top: 0, width: 1, height: 1 });
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div className="App">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
        >
          <div
            className="Logo"
            style={{
              height: 64,
              margin: 0,
              background: "rgba(0, 255, 255, 0.2)",
            }}
          />
          <Menu
            theme="light"
            defaultSelectedKeys={["map"]}
            mode="inline"
            items={items}
            style={{ border: 0 }}
            onClick={({ key, keyPath, domEvent }) => {
              navigate(urljoin(keyPath.reverse()));
              // console.log(keyPath);
            }}
          />
        </Sider>
        <Layout className="site-layout">
          <Content
            style={{
              margin: "0",
              border: "solid 1px red",
            }}
          >
            <Routes>
              <Route exact path="/" element={<div>hi</div>} />
              <Route
                exact
                path="/map"
                element={<MapPage zoom={zoom} setZoom={setZoom} />}
              />
              <Route exact path="/list" element={<div>list</div>} />
              <Route exact path="/upcoming/:user" element={<div>hi</div>} />
              <Route exact path="/record/:user" element={<div>hi</div>} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Content>
          <Footer
            style={{
              // position: "fixed",
              textAlign: "center",
              // width: "100%",
              bottom: 0,
            }}
          >
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
