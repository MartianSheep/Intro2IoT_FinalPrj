import React from "react";
import "./Map.css";
import WorldLocations from "./WorldLocations";
import WorldUtils from "./WorldUtils";
import { IgrGeographicMapModule } from "igniteui-react-maps";
import { IgrGeographicMap } from "igniteui-react-maps";
import { IgrGeographicSymbolSeries } from "igniteui-react-maps";
import { IgrDataChartInteractivityModule } from "igniteui-react-charts";
import { IgrDataContext } from "igniteui-react-core";
import { MarkerType } from "igniteui-react-charts";

import { IgrBingMapsMapImagery } from "igniteui-react-maps";
import { BingMapsImageryStyle } from "igniteui-react-maps";
import { IgrArcGISOnlineMapImagery } from "igniteui-react-maps";
import { EsriUtility, EsriStyle } from "./EsriUtils";

import { Segmented } from "antd";

IgrGeographicMapModule.register();
IgrDataChartInteractivityModule.register();

interface MyState {
  mapMode: any;
}
type MyProps = {
  // using `interface` is also ok
  message?: string;
};

export default class MapTypeScatterSymbolSeries extends React.Component<
  MyProps,
  MyState
> {
  public geoMap!: IgrGeographicMap;

  constructor(props: any) {
    super(props);

    // this.onMapRef = this.onMapRef.bind(this);
    this.onMapRef = this.onMapRef.bind(this);
    this.createTooltip = this.createTooltip.bind(this);
  }
  state: MyState = {
    mapMode: "test",
  };

  public onMapRef(geoMap: IgrGeographicMap) {
    if (!geoMap) {
      return;
    }
    const tileSource = new IgrArcGISOnlineMapImagery();
    tileSource.mapServerUri = EsriUtility.getUri(EsriStyle.WorldTopographicMap);
    geoMap.backgroundContent = tileSource;

    // const tileSource = new IgrBingMapsMapImagery();
    // tileSource.apiKey = WorldUtils.getBingKey();
    // tileSource.imageryStyle = BingMapsImageryStyle.AerialWithLabels;

    // // resolving BingMaps uri based on HTTP protocol of hosting website
    // let tileUri = tileSource.actualBingImageryRestUri;
    // let isHttpSecured = window.location.toString().startsWith("https:");
    // if (isHttpSecured) {
    //   tileSource.bingImageryRestUri = tileUri.replace("http:", "https:");
    // } else {
    //   tileSource.bingImageryRestUri = tileUri.replace("https:", "http:");
    // }

    // geoMap.backgroundContent = tileSource;

    this.geoMap = geoMap;
    this.geoMap.updateZoomWindow({
      left: 0.2,
      top: 0.1,
      width: 0.6,
      height: 0.6,
    });

    this.addSeriesWith(WorldLocations.getCities(), "Orange");
    this.addSeriesWith(WorldLocations.getCapitals(), "rgb(32, 146, 252)");

    // optional - navigating to a map region
  }

  public render(): JSX.Element {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          border: "1px solid yellow",
        }}
      >
        <Segmented
          style={{
            position: "fixed",
            zIndex: 1,
            bottom: 0,
            right: 0,
            margin: 20,
            backgroundColor: "#164c7e",
            color: "white",
          }}
          options={["空照", "地名", "道路"]}
          onChange={(e) => {
            this.setState({ mapMode: e });
          }}
        />
        <IgrGeographicMap
          ref={this.onMapRef}
          width="100%"
          height="100%"
          zoomable="true"
          worldRect={{ left: 120, top: 21.7, width: 2, height: 3.7 }}
        />
      </div>
    );
  }

  // public onMapRef(geoMap: IgrGeographicMap) {
  //   if (!geoMap) {
  //     return;
  //   }

  //   this.geoMap = geoMap;
  //   this.geoMap.updateZoomWindow({
  //     left: 0.2,
  //     top: 0.1,
  //     width: 0.6,
  //     height: 0.6,
  //   });

  //   this.addSeriesWith(WorldLocations.getCities(), "Green");
  //   this.addSeriesWith(WorldLocations.getCapitals(), "rgb(32, 146, 252)");
  // }

  public addSeriesWith(locations: any[], brush: string) {
    const symbolSeries = new IgrGeographicSymbolSeries({
      name: "symbolSeries",
    });
    symbolSeries.dataSource = locations;
    symbolSeries.markerType = MarkerType.Pyramid;
    symbolSeries.latitudeMemberPath = "lat";
    symbolSeries.longitudeMemberPath = "lon";
    symbolSeries.markerBrush = "White";
    symbolSeries.markerOutline = brush;
    symbolSeries.tooltipTemplate = this.createTooltip;
    symbolSeries.thickness = 10000;

    this.geoMap.series.add(symbolSeries);
  }

  public createTooltip(context: any) {
    const dataContext = context.dataContext as IgrDataContext;
    if (!dataContext) return null;

    const dataItem = dataContext.item as any;
    if (!dataItem) return null;

    const brush = dataContext.series.markerOutline;
    const seriesStyle = { color: brush } as React.CSSProperties;

    const lat = WorldUtils.toStringLat(dataItem.lat);
    const lon = WorldUtils.toStringLon(dataItem.lon);

    return (
      <div>
        <div className="tooltipTitle" style={seriesStyle}>
          {dataItem.name}
        </div>
        <div className="tooltipBox">
          <div className="tooltipRow">
            <div className="tooltipLbl">Country:</div>
            <div className="tooltipVal">{dataItem.country}</div>
          </div>
          <div className="tooltipRow">
            <div className="tooltipLbl">Latitude:</div>
            <div className="tooltipVal">{lat}</div>
          </div>
          <div className="tooltipRow">
            <div className="tooltipLbl">Longitude:</div>
            <div className="tooltipVal">{lon}</div>
          </div>
        </div>
      </div>
    );
  }
}
