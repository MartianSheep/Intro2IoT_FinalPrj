import { Table, theme, Typography, Tag, Modal, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import Icon from "@ant-design/icons";

import WaterSvg from "../../svgs/water-bottle.svg";

import React, { useEffect, useState } from "react";
import axios from "../../apis/axios";
// import WaterIcon from "./WaterIcon";
import IconArray from "../../containers/IconArray";

import moment from "moment";
import "moment/locale/zh-tw";

// const CustomSvf = React.forwardRef<string, SVGSVGProps<>>((component) => (
//   <Icon component={component} />
// ));

interface CabinDataType {
  name: string;
  key: string;
  water: number;
  electricity: number;
  lastUpdated: string;
  tags: string[];
  link: string;
}

const DevicesPage = (): JSX.Element => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [devices, setDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data: any = await axios.get("devices");
      setDevices(data);
    };

    // call the function
    fetchData().catch(console.error);
  }, []);

  const columns: ColumnsType<CabinDataType> = [
    {
      title: "山屋",
      dataIndex: ["name"],
      key: "name",
      render: (name, cabin) => (
        <Button type="link" style={{ fontWeight: "bold", color: "#007b43" }}>
          {name}
        </Button>
      ),
    },
    {
      title: "標籤",
      dataIndex: "tags",
      key: "tags",
      render: (tags: any) => (
        <div style={{ maxWidth: "100%" }}>
          {tags.map((tag: any) => (
            <Tag color={"green"} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "水量",
      dataIndex: "water",
      key: "water",
      render: (data) =>
        data && data >= 0 ? (
          <IconArray number={data} type="water" />
        ) : (
          <Typography.Text type="secondary">無資料</Typography.Text>
        ),
    },
    {
      title: "電量",
      dataIndex: "electricity",
      key: "electricity",
      render: (data) =>
        data && data >= 0 ? (
          <IconArray number={data} type="electricity" />
        ) : (
          <Typography.Text type="secondary">無資料</Typography.Text>
        ),
    },
    {
      title: "上次更新",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render: (text) =>
        text ? (
          <Typography.Text type="secondary">
            {moment(text).locale("zh-tw").fromNow()}
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">無資料</Typography.Text>
        ),
    },
  ];

  return (
    <div
      style={{
        height: "100vh",
        overflow: "scroll",
      }}
    >
      <Table dataSource={devices} columns={columns} style={{ margin: 20 }} />
    </div>
  );
};

export default DevicesPage;