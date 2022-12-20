import React, { useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout, Menu, theme, Typography } from "antd";

import items from "./MenuList";
import MapWrapper from "../MapPage/MapWrapper";
import LineMap from "../LineMap/LineMap";
import TablePage from "../TablePage/TablePage";

const { Content, Sider, Header, Footer } = Layout;

function MainLayout(): JSX.Element {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <BrowserRouter>
      <Layout hasSider>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
          theme="light"
        >
          <div
            style={{
              height: 64,
              margin: 0,
              background: "rgba(0, 255, 255, 0.2)",
              display: "flex",
              justifyContent: "center",
              // alignItems: "center",
              paddingTop: 15,
              // paddingLeft: 30,
            }}
          >
            <Typography.Title level={2}>第13組</Typography.Title>
          </div>
          <Menu
            theme="light"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
          <Content style={{ margin: "0", overflow: "initial" }}>
            {/* <MapWrapper /> */}
            <Routes>
              <Route path="/cabin" element={<TablePage />} />
              <Route path="/map" element={<MapWrapper />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default MainLayout;
