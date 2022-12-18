import React from "react";
import "./Map.css";
import WorldLocations from "./WorldLocations";
import WorldUtils from "./WorldUtils";
import mountains from "./mountains.json";
import { IgrGeographicMapModule } from "igniteui-react-maps";
import { IgrGeographicMap } from "igniteui-react-maps";
import { IgrGeographicSymbolSeries } from "igniteui-react-maps";
import { IgrGeographicPolylineSeries } from "igniteui-react-maps";
import { IgrDataChartInteractivityModule } from "igniteui-react-charts";
import { IgrDataContext } from "igniteui-react-core";
import { IgrShapeDataSource } from "igniteui-react-core";
import { MarkerType } from "igniteui-react-charts";

import {
  IgrSeriesViewer,
  IgrDataChartMouseButtonEventArgs,
  IgrChartMouseEventArgs,
} from "igniteui-react-charts";

import { IgrBingMapsMapImagery } from "igniteui-react-maps";
import { BingMapsImageryStyle } from "igniteui-react-maps";
import { IgrArcGISOnlineMapImagery } from "igniteui-react-maps";
import { EsriUtility, EsriStyle } from "./EsriUtils";

import { Segmented, theme } from "antd";

IgrGeographicMapModule.register();
IgrDataChartInteractivityModule.register();

interface MyState {
  mapMode: any;
  tileSource: any;
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
    this.changeTile = this.changeTile.bind(this);
    this.zoomToNationPark = this.zoomToNationPark.bind(this);
    this.onSeriesMouseLeftButtonUp = this.onSeriesMouseLeftButtonUp.bind(this);
    this.onSeriesMouseEnter = this.onSeriesMouseEnter.bind(this);
  }
  state: MyState = {
    mapMode: "空照",
    tileSource: this.initTile(),
  };

  public initTile(): IgrArcGISOnlineMapImagery {
    const tileSource = new IgrArcGISOnlineMapImagery();
    tileSource.mapServerUri = EsriUtility.getUri(EsriStyle.WorldSatelliteMap);
    return tileSource;
  }

  private changeTile(e: any) {
    const tileSource = new IgrArcGISOnlineMapImagery();
    let uriName = EsriStyle.WorldSatelliteMap;
    if (e === "空照") {
      uriName = EsriStyle.WorldSatelliteMap;
    } else if (e === "等高線") {
      uriName = EsriStyle.WorldTopographicMap;
    } else if (e === "道路") {
      uriName = EsriStyle.WorldStreetMap;
    }
    tileSource.mapServerUri = EsriUtility.getUri(uriName);
    this.setState({ tileSource: tileSource });
  }

  private zoomToNationPark(e: any) {
    if (e === "雪霸") {
      this.geoMap.zoomToGeographic({
        left: 121,
        top: 24.22,
        width: 0.3,
        height: 0.3,
      });
    } else if (e === "太魯閣") {
      this.geoMap.zoomToGeographic({
        left: 121.2,
        top: 24.0,
        width: 0.4,
        height: 0.4,
      });
    } else if (e === "玉山") {
      this.geoMap.zoomToGeographic({
        left: 120.8,
        top: 23.2,
        width: 0.4,
        height: 0.4,
      });
    } else {
      this.geoMap.updateZoomWindow({
        left: 0,
        top: 0,
        width: 1,
        height: 1,
      });
    }
  }

  public onMapRef(geoMap: IgrGeographicMap) {
    if (!geoMap) return;
    this.geoMap = geoMap;
    this.addSeriesWith(mountains, "rgba(0, 134, 133,0.6)", MarkerType.Pyramid);
    this.addSeriesWith(
      WorldLocations.getCities(),
      "#3c9ae8",
      MarkerType.Diamond
    );
  }
  public onSeriesMouseLeftButtonUp(
    viewer: IgrSeriesViewer,
    event: IgrDataChartMouseButtonEventArgs
  ) {
    console.log(event.item);
  }
  public onSeriesMouseEnter(
    viewer: IgrSeriesViewer,
    event: IgrChartMouseEventArgs
  ) {
    console.log(event.item);
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
            backgroundColor: "#9AC5FF",
          }}
          size="large"
          options={["空照", "等高線", "道路"]}
          onChange={this.changeTile}
        />
        <Segmented
          style={{
            position: "fixed",
            zIndex: 1,
            bottom: 60,
            right: 0,
            margin: 20,
            backgroundColor: "#9AC5FF",
          }}
          // size="medium"
          options={["雪霸", "太魯閣", "玉山", "台灣"]}
          onChange={this.zoomToNationPark}
        />
        <IgrGeographicMap
          ref={this.onMapRef}
          width="100%"
          height="100%"
          zoomable="true"
          worldRect={{ left: 120, top: 21.7, width: 2, height: 3.7 }}
          backgroundContent={this.state.tileSource}
          seriesMouseLeftButtonUp={this.onSeriesMouseLeftButtonUp}
          seriesMouseEnter={this.onSeriesMouseEnter}
        />
      </div>
    );
  }

  public addSeriesWith(locations: any[], brush: string, shape: MarkerType) {
    const symbolSeries = new IgrGeographicSymbolSeries({
      name: "symbolSeries",
    });
    symbolSeries.dataSource = locations;
    symbolSeries.markerType = shape;
    symbolSeries.latitudeMemberPath = "lat";
    symbolSeries.longitudeMemberPath = "lon";
    symbolSeries.markerBrush = "Transparent";
    symbolSeries.markerOutline = brush;
    symbolSeries.tooltipTemplate = this.createTooltip;
    symbolSeries.thickness = 10000;

    this.geoMap.series.add(symbolSeries);
  }

  public onDataLoaded(sds: IgrShapeDataSource, e: any) {
    const shapeRecords = sds.getPointData();
    console.log("loaded WorldCities.shp " + shapeRecords.length);

    const geoPolylines: any[] = [];
    // parsing shapefile data and creating geo-polygons
    for (const record of shapeRecords) {
      // using field/column names from .DBF file
      const route = {
        points: record.points,
        name: record.fieldValues.Name,
        capacity: record.fieldValues.CapacityG,
        distance: record.fieldValues.DistanceKM,
      };
      geoPolylines.push(route);
    }

    const geoSeries = new IgrGeographicPolylineSeries({ name: "series" });
    geoSeries.dataSource = geoPolylines;
    geoSeries.shapeMemberPath = "points";
    geoSeries.shapeFilterResolution = 0.0;
    geoSeries.shapeStrokeThickness = 3;
    geoSeries.shapeStroke = "rgb(0, 255, 82, 1)";
    geoSeries.tooltipTemplate = this.createTooltip;

    this.geoMap.series.add(geoSeries);
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
