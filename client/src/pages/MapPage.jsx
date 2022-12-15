import React, { useRef, useState } from "react";
import {
  IgrGeographicMapModule,
  IgrGeographicMap,
  IgrGeographicSymbolSeries,
} from "igniteui-react-maps";
import { IgrDataChartInteractivityModule } from "igniteui-react-charts";

IgrGeographicMapModule.register();
IgrDataChartInteractivityModule.register();

function MapPage(props) {
  const map = useRef(null);
  const test = () => {
    const symbolSeries = new IgrGeographicSymbolSeries({
      name: "symbolSeries",
    });
    symbolSeries.dataSource = {
      name: "塔芬谷山屋",
      longitude: 121.026735,
      latitude: 23.419595,
      elevation: 2643,
      water: 0,
      electricity: 0,
    };
    symbolSeries.latitudeMemberPath = "latitude";
    symbolSeries.longitudeMemberPath = "longitude";
    map.current.series.add(symbolSeries);
    console.log(map.current.series);
  };
  return (
    <div style={{ height: "100%", width: "100%", border: "solid 1px blue" }}>
      <button onClick={test}>test</button>
      <IgrGeographicMap
        ref={map}
        worldRect={{ left: 120, top: 21.7, width: 2, height: 3.7 }}
        width="100%"
        height="100%"
        zoomable="true"
      />
    </div>
  );
}

export default MapPage;
