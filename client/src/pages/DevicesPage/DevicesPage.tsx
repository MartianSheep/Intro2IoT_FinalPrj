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

  const batteryCal = (raw: number) => {
    if (raw === undefined || raw < 0) return -1;
    let res: number = Math.round((raw - 900) / 52);
    if (res > 5) res = 5;
    if (res < 0) res = 0;
    return res;
  };

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
      title: "代號",
      dataIndex: "name",
      key: "name",
      render: (name) => <Typography.Text>{name}</Typography.Text>,
    },
    {
      title: "類型",
      dataIndex: "type",
      key: "type",
      render: (data) =>
        data === "gateway" ? (
          <Tag color="volcano">閘道</Tag>
        ) : (
          <Tag color="green">普通</Tag>
        ),
    },
    {
      title: "電量",
      dataIndex: "battery",
      key: "battery",
      render: (data) =>
        data && data >= 0 ? (
          <IconArray number={batteryCal(data)} type="electricity" />
        ) : (
          <Typography.Text type="secondary">無資料</Typography.Text>
        ),
    },
    {
      title: "經度",
      dataIndex: "lon",
      key: "lon",
      render: (data) => data.toFixed(4),
    },
    {
      title: "緯度",
      dataIndex: "lat",
      key: "lat",
      render: (data) => data.toFixed(4),
    },

    {
      title: "海拔",
      dataIndex: "elevation",
      key: "elevation",
    },
    {
      title: "上次活動",
      dataIndex: "lastActive",
      key: "lastActive",
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
