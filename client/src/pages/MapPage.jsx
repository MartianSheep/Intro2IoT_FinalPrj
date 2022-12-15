import React, { useRef, useState } from "react";
import { IgrGeographicMapModule, IgrGeographicMap } from "igniteui-react-maps";
import { IgrDataChartInteractivityModule } from "igniteui-react-charts";

IgrGeographicMapModule.register();
IgrDataChartInteractivityModule.register();

function MapPage(props) {
  const map = useRef(null);
  const [zoom, setZoom] = useState();
  function handleClick() {
    // map.current.zoomToGeographic({ left: 121, top: 21, width: 1, height: 2.0 });
    map.current.updateZoomWindow({ left: 0, top: 0, width: 0.5, height: 0.5 });
    // console.log(map.current.actualWindowRect);
  }
  return (
    <div style={{ height: "100%", width: "100%", border: "solid 1px blue" }}>
      <button onClick={handleClick}>test</button>
      <IgrGeographicMap
        ref={map}
        worldRect={{ left: 120, top: 21, width: 2, height: 5.0 }}
        // previewRect={{ left: 0, top: 0, height: 0.5, width: 0.5 }}
        title="Items Sold"
        width="100%"
        height="100%"
        zoomable="true"
        windowRectChanged={() => {
          console.log(map.current.actualWindowRect);
        }}
      />
    </div>
  );
}

export default MapPage;
