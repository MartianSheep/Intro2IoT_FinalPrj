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
// import useMap from "./hooks/MapHook";
import KeepAlive from "react-activation";

import ErrorPage from "./pages/ErrorPage";
import MapPage from "./pages/MapPage";

// import MapTypeScatterSymbolSeries from "./pages/TestMap";

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
  const navigate = useNavigate();
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
              height: "100%",
              width: "100%",
            }}
          >
            {/* <KeepAlive style={{ height: "100%" }}> */}
            <Routes>
              <Route exact path="/" element={<div>hi</div>} />

              {/* <Route exact path="/map" element={<MapPage />} /> */}
              <Route exact path="/map" element={<MapPage />} />
              <Route exact path="/list" element={<div>list</div>} />
              <Route exact path="/upcoming/:user" element={<div>hi</div>} />
              <Route exact path="/record/:user" element={<div>hi</div>} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
            {/* </KeepAlive> */}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
