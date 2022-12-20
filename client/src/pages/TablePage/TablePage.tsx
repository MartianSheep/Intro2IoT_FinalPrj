import { Table, theme, Typography, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Icon from "@ant-design/icons";

import WaterSvg from "../../svgs/water-bottle.svg";

import React, { useEffect, useState } from "react";
import axios from "../../apis/axios";
import WaterIcon from "./WaterIcon";

import moment from "moment";
import "moment/locale/zh-tw";

// const CustomSvf = React.forwardRef<string, SVGSVGProps<>>((component) => (
//   <Icon component={component} />
// ));

interface DataType {
  name: string;
  key: string;
  water: number;
  electricity: number;
  // temperature: number;
  lastUpdated: string;
  tags: string[];
}

const TablePage = (): JSX.Element => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [cabins, setCabins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data: any = await axios.get("cabins");

      setCabins(
        data
          .filter((d: any) => d.water !== undefined && d.water >= 0)
          .map((d: any) => ({
            ...d,
            water: Math.round((d.water * 5) / (d.waterEmpty - d.waterFull)),
          }))
      );
    };

    // call the function
    fetchData().catch(console.error);
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: "山屋",
      dataIndex: "name",
      key: "name",
      render: (text) => <Typography.Title level={5}>{text}</Typography.Title>,
    },
    {
      title: "標籤",
      dataIndex: "tags",
      key: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "水量",
      dataIndex: "water",
      key: "water",
      render: (data) => <WaterIcon number={data} />,
    },
    {
      title: "電量",
      dataIndex: "electricity",
      key: "electricity",
      render: (data) =>
        data && data >= 0 ? <WaterIcon number={data} /> : <></>,
    },
    {
      title: "上次更新",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render: (text) => (
        <Typography.Text type="secondary">
          {moment(text).locale("zh-tw").fromNow()}
        </Typography.Text>
      ),
    },
  ];

  return (
    <div
      style={{
        height: "100vh",
        // border: "1px purple solid",
        overflow: "scroll",
      }}
    >
      <Table dataSource={cabins} columns={columns} style={{ margin: 20 }} />
    </div>
  );
};

export default TablePage;
