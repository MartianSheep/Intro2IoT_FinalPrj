import React, { useEffect } from "react";
import MapTypeScatterSymbolSeries from "./Map";

function MapWrapper(): JSX.Element {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapTypeScatterSymbolSeries />
    </div>
  );
}

export default MapWrapper;
