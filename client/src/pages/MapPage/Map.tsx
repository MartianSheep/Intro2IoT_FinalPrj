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

import { Segmented, theme, Typography, Select } from "antd";

import moment from "moment";
import "moment/locale/zh-tw";

import axios from "../../apis/axios";

import IconArray from "../../containers/IconArray";

IgrGeographicMapModule.register();
IgrDataChartInteractivityModule.register();

interface MyState {
  mapMode: any;
  tileSource: any;
}
type MyProps = {
  message?: string;
};
interface CabinDataType {
  name: string;
  key: string;
  water: number;
  electricity: number;
  lastUpdated: string;
  tags: string[];
  link: string;
  waterEmpty: number;
  waterFull: number;
}
export default class Map extends React.Component<MyProps, MyState> {
  public geoMap!: IgrGeographicMap;

  constructor(props: any) {
    super(props);

    this.onMapRef = this.onMapRef.bind(this);
    this.createTooltip = this.createTooltip.bind(this);
    this.changeTile = this.changeTile.bind(this);
    this.zoomToNationPark = this.zoomToNationPark.bind(this);
    // this.onSeriesMouseLeftButtonUp = this.onSeriesMouseLeftButtonUp.bind(this);
    // this.onSeriesMouseEnter = this.onSeriesMouseEnter.bind(this);
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
    if (e === "雪霸國家公園") {
      this.geoMap.zoomToGeographic({
        left: 121,
        top: 24.22,
        width: 0.3,
        height: 0.3,
      });
    } else if (e === "太魯閣國家公園") {
      this.geoMap.zoomToGeographic({
        left: 121.2,
        top: 24.0,
        width: 0.4,
        height: 0.4,
      });
    } else if (e === "玉山國家公園") {
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

  public async onMapRef(geoMap: IgrGeographicMap) {
    if (!geoMap) return;

    const cabinsData: any = await axios.get("cabins");
    const devicesData: any = await axios.get("devices");

    this.geoMap = geoMap;
    this.addCabinsSeriesWith(cabinsData, "#c17500", MarkerType.Diamond);
    this.addEmergencySeriesWith(
      devicesData.filter((d: any) => d.emergency),
      "red",
      MarkerType.Triangle
    );
  }

  public render(): JSX.Element {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
        }}
      >
        <Segmented
          style={{
            position: "fixed",
            zIndex: 1,
            bottom: 0,
            right: 0,
            margin: 20,
            backgroundColor: "#f0f0f0",
          }}
          size="large"
          options={["空照", "等高線", "道路"]}
          onChange={this.changeTile}
        />

        <Select
          defaultValue="選擇區域"
          style={{
            position: "fixed",
            zIndex: 1,
            top: 0,
            right: 0,
            margin: 20,
            width: 150,
          }}
          onChange={this.zoomToNationPark}
          options={[
            {
              value: "雪霸國家公園",
              label: "雪霸國家公園",
            },
            {
              value: "太魯閣國家公園",
              label: "太魯閣國家公園",
            },

            {
              value: "玉山國家公園",
              label: "玉山國家公園",
            },
            {
              value: "台灣",
              label: "台灣",
            },
          ]}
        />
        <IgrGeographicMap
          ref={this.onMapRef}
          width="100%"
          height="100%"
          zoomable="true"
          worldRect={{ left: 120, top: 21.7, width: 2, height: 3.7 }}
          backgroundContent={this.state.tileSource}
          // seriesMouseLeftButtonUp={this.onSeriesMouseLeftButtonUp}
          // seriesMouseEnter={this.onSeriesMouseEnter}
        />
      </div>
    );
  }

  public addCabinsSeriesWith(
    locations: any[],
    brush: string,
    shape: MarkerType
  ) {
    const symbolSeries = new IgrGeographicSymbolSeries({
      name: "symbolSeries",
    });
    symbolSeries.dataSource = locations;
    symbolSeries.markerType = shape;
    symbolSeries.latitudeMemberPath = "lat";
    symbolSeries.longitudeMemberPath = "lon";
    symbolSeries.markerBrush = "White";
    symbolSeries.markerOutline = brush;
    symbolSeries.tooltipTemplate = this.createTooltip;
    symbolSeries.thickness = 10000;

    this.geoMap.series.add(symbolSeries);
  }
  public addEmergencySeriesWith(
    locations: any[],
    brush: string,
    shape: MarkerType
  ) {
    const symbolSeries = new IgrGeographicSymbolSeries({
      name: "symbolSeries",
    });
    symbolSeries.dataSource = locations;
    symbolSeries.markerType = shape;
    symbolSeries.latitudeMemberPath = "lat";
    symbolSeries.longitudeMemberPath = "lon";
    symbolSeries.markerBrush = "White";
    symbolSeries.markerOutline = brush;
    symbolSeries.tooltipTemplate = this.createEmergencyTooltip;
    symbolSeries.thickness = 10000;

    this.geoMap.series.add(symbolSeries);
  }

  public waterCal(cabinData: CabinDataType) {
    if (cabinData.water === undefined || cabinData.water < 0) return -1;
    let res: number = Math.round(
      (cabinData.water * 5) / (cabinData.waterEmpty - cabinData.waterFull)
    );
    if (res > 5) res = 5;
    if (res < 0) res = 0;

    res = 5 - res;
    return res;
  }

  public createEmergencyTooltip(context: any) {
    const dataContext = context.dataContext as IgrDataContext;
    if (!dataContext) return null;

    const dataItem = dataContext.item as any;
    if (!dataItem) return null;

    const brush = dataContext.series.markerOutline;
    return (
      <div>
        <Typography.Title level={5} type="danger">
          {dataItem.name}
        </Typography.Title>
        <Typography.Text type="danger">此處可能發生警急事件</Typography.Text>
        <div></div>
        <Typography.Text type="secondary">緯度：{dataItem.lat}</Typography.Text>
        <div></div>
        <Typography.Text type="secondary">經度：{dataItem.lon}</Typography.Text>
        <div></div>
        <Typography.Text type="secondary">
          海拔：{dataItem.elevation}
        </Typography.Text>
      </div>
    );
  }
  public createTooltip(context: any) {
    const dataContext = context.dataContext as IgrDataContext;
    if (!dataContext) return null;

    const dataItem = dataContext.item as any;
    if (!dataItem) return null;

    const brush = dataContext.series.markerOutline;
    const seriesStyle = { color: brush } as React.CSSProperties;

    return (
      <div>
        <div className="tooltipTitle" style={seriesStyle}>
          <Typography.Title level={5}>{dataItem.name}</Typography.Title>
        </div>
        {this.waterCal(dataItem) >= 0 && dataItem.water !== undefined ? (
          <>
            <IconArray number={this.waterCal(dataItem)} type="water" />
          </>
        ) : (
          <Typography.Text type="secondary">水量無資料</Typography.Text>
        )}
        <div style={{ height: 10 }}></div>
        {dataItem.electricity >= 0 && dataItem.electricity !== undefined ? (
          <IconArray number={dataItem.electricity} type="electricity" />
        ) : (
          <Typography.Text type="secondary">電量無資料</Typography.Text>
        )}
        <div style={{ height: 10 }}></div>
        {dataItem.lastUpdated && (
          <>
            <Typography.Text type="secondary">
              上次更新：{moment(dataItem.lastUpdated).locale("zh-tw").fromNow()}
            </Typography.Text>
          </>
        )}
      </div>
    );
  }
}
