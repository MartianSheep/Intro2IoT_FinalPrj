import React, { useEffect } from "react";
import MapTypeScatterSymbolSeries from "./Map";

function MapWrapper(): JSX.Element {
  useEffect(() => {
    console.log("MOUNT");
  }, []);
  return (
    <div style={{ height: "100%", width: "100%", border: "1px solid red" }}>
      <MapTypeScatterSymbolSeries />
    </div>
  );
}

export default MapWrapper;
