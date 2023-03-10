import React from "react";

interface Props {
  fillColor: string;
  key: string;
}

const WaterIcon = ({ fillColor, key }: Props) => {
  return (
    <svg
      key={key}
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_1"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      width="20"
      height="20"
    >
      <path
        fill={fillColor}
        d="M20,8.016C20.152,5.423,16.873,4.853,15,4V2a1,1,0,0,0,0-2H9A1,1,0,0,0,9,2V4L6.514,5A3.219,3.219,0,0,0,4.575,10H15a1,1,0,0,1,0,2H4.574a3.828,3.828,0,0,0,0,4H15a1,1,0,0,1,0,2H4.574A3.991,3.991,0,0,0,8,24h8a4.006,4.006,0,0,0,2.618-7,3.993,3.993,0,0,0,0-6A4.007,4.007,0,0,0,20,8.016Z"
      />
    </svg>
  );
};

export default WaterIcon;
