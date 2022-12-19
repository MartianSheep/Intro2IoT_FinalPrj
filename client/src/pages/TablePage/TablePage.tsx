import { Table, theme } from "antd";
import React, { useEffect, useState } from "react";
import axios from "../../apis/axios";

const TablePage = (): JSX.Element => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [cabins, setCabins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data: any = await axios.get("cabins");
      setCabins(data);
    };

    // call the function
    fetchData().catch(console.error);
  }, []);

  const columns = [
    {
      title: "山屋",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "經度",
      dataIndex: "lon",
      key: "lon",
    },
    {
      title: "緯度",
      dataIndex: "lat",
      key: "lat",
    },
    {
      title: "海拔",
      dataIndex: "elevation",
      key: "elevation",
    },
    {
      title: "水量",
      dataIndex: "water",
      key: "water",
    },
  ];

  return (
    <div
      style={{
        maxHeight: "100%",
        border: "1px purple solid",
        overflow: "scroll",
      }}
    >
      <Table dataSource={cabins} columns={columns} style={{ margin: 50 }} />
    </div>
  );
};

export default TablePage;
