import React, { useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout, Menu } from "antd";

import items from "./MenuList";
import MapWrapper from "../MapPage/MapWrapper";

const { Content, Sider } = Layout;

function MainLayout(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="dark"
        >
          <div
            style={{
              height: 64,
              margin: 0,
              background: "rgba(0, 255, 255, 0.2)",
            }}
          />
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: "0", border: "solid 1px blue" }}>
            {/* <MapWrapper /> */}
            <Routes>
              <Route path="/map" element={<MapWrapper />}></Route>
              <Route path="/cabin" element={<div>cabin</div>} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default MainLayout;
