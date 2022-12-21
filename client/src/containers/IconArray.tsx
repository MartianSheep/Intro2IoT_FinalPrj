import React from "react";
import WaterIcon from "./WaterIcon";
import { ThunderboltFilled } from "@ant-design/icons";

interface Props {
  number: number;
  type: string;
}

const IconArray = ({ number, type }: Props) => {
  return (
    <div style={{ whiteSpace: "nowrap" }}>
      {[...Array(number)].map((e, i) =>
        type === "water" ? (
          <WaterIcon key={i.toString()} fillColor={"#69c0ff"} />
        ) : (
          <ThunderboltFilled style={{ fontSize: 20, color: "#ffbf00" }} />
        )
      )}
      {[...Array(5 - number)].map((e, i) =>
        type === "water" ? (
          <WaterIcon key={i.toString()} fillColor={"#dddddd"} />
        ) : (
          <ThunderboltFilled style={{ fontSize: 20, color: "#dddddd" }} />
        )
      )}
    </div>
  );
};

export default IconArray;
