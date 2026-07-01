/* eslint-disable jsx-a11y/alt-text */
import { use, useEffect, useState } from "react";
import "../index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-compass";
import "@arcgis/map-components/components/arcgis-print";
import {
  basemapUserDefined,
  cp_break_lines,
  layerInfos,
  lotLayer,
  lotLayer_overview,
  monopilesLayer,
  n2CenterlineOverView,
  n2StationLayer,
  n2StationLayer_overview,
  nloLayer,
  nloLayer_overview,
  pileCapLayer,
  pileCapLayer_overview,
  prowLayer,
  prowLayer_overview,
  queryRenderArray,
  stripMapLayer,
  stripMapLayer_overview,
  structureLayer,
  structureLayer_overview,
  utilityPointLayer,
  utilityPointLayer_overview,
} from "../layers";
import "@esri/calcite-components/dist/components/calcite-button";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import { home_center, home_rotation, overViewCenter } from "../UniqueValues";
import ActionPanel from "./ActionPanel";
import {
  addLayersToMap,
  disableZooming,
  queryDefinitionExpression,
  stripMapRenderer,
  zoomToLayer,
} from "../Query";
import WorkablePileCapChart from "./WorkablePileCapChart";
import { MyContext } from "../contexts/MyContext";
import type { ArcgisMap } from "@arcgis/map-components/dist/components/arcgis-map";
import type { ArcgisLegend } from "@arcgis/map-components/components/arcgis-legend";

function MapPanel() {
  const { cpackage, component } = use(MyContext);

  const arcgisMap = document.querySelector("#arcgis-map") as ArcgisMap;
  const arcgisOverviewMap = document.querySelector(
    "#arcgis-overview-map",
  ) as ArcgisMap;
  const arcgisMapLegend = document.querySelector(
    "arcgis-legend",
  ) as ArcgisLegend;

  const [_mapView, setMapView] = useState<any>();

  //--- Expand (Action Panel)
  const paneExpand: any = document.querySelector("actionpanel-expand");
  const [actionPanelExpanded, setActionPanelExpanded] = useState(true);

  reactiveUtils.when(
    () => paneExpand?.expanded === false,
    () => setActionPanelExpanded(false),
  );

  reactiveUtils.when(
    () => paneExpand?.expanded === true,
    () => setActionPanelExpanded(true),
  );

  arcgisMap?.viewOnReady(() => {
    //--- Map
    arcgisMap.view.ui.add(paneExpand, "top-right");
    addLayersToMap(arcgisMap?.map, [
      prowLayer,
      lotLayer,
      structureLayer,
      pileCapLayer,
      nloLayer,
      utilityPointLayer,
      n2StationLayer,
      cp_break_lines,
      stripMapLayer,
      monopilesLayer,
    ]);
    arcgisMap.hideAttribution = true;
    arcgisMapLegend.layerInfos = layerInfos;
    arcgisMapLegend.hideLayersNotInCurrentView = false;
    arcgisMapLegend.ignoreLayerVisibility = true;

    //--- Overview map
    addLayersToMap(arcgisOverviewMap?.map, [
      prowLayer_overview,
      n2CenterlineOverView,
      lotLayer_overview,
      structureLayer_overview,
      pileCapLayer_overview,
      nloLayer_overview,
      utilityPointLayer_overview,
      n2StationLayer_overview,
      stripMapLayer_overview,
    ]);

    arcgisOverviewMap.hideAttribution = true;
    arcgisOverviewMap && disableZooming(arcgisOverviewMap?.view);
  });

  useEffect(() => {
    const qe = cpackage === "All" ? "1=1" : `CP = '${cpackage}'`;
    const qe2 = cpackage === "All" ? "1=1" : `GroupId = '${cpackage}'`;
    stripMapLayer.definitionExpression = `${qe} OR ${qe2}`;

    queryDefinitionExpression({
      queryExpression: qe,
      featureLayer1: pileCapLayer,
      featureLayers2: [lotLayer, structureLayer, nloLayer, utilityPointLayer],
      componentArray: queryRenderArray,
      componentSelected: component,
    });

    queryDefinitionExpression({
      queryExpression: qe,
      featureLayer1: pileCapLayer_overview,
      featureLayers2: [
        lotLayer_overview,
        structureLayer_overview,
        nloLayer_overview,
        utilityPointLayer_overview,
      ],
      componentArray: queryRenderArray,
      componentSelected: component,
    });
  }, [cpackage, component]);

  useEffect(() => {
    zoomToLayer(pileCapLayer, arcgisMap);
  }, [cpackage]);

  //--- Overview Map renderer
  stripMapRenderer(
    stripMapLayer,
    stripMapLayer_overview,
    arcgisMap,
    arcgisOverviewMap,
  );

  return (
    <arcgis-map
      id="arcgis-map"
      basemap={basemapUserDefined}
      ground="world-elevation"
      zoom={12}
      center={home_center}
      rotation={home_rotation}
      onarcgisViewReadyChange={(event: any) => {
        setMapView(event.target.id);
      }}
    >
      <arcgis-compass slot="top-left"></arcgis-compass>

      {/* Printer widget */}
      <arcgis-expand slot="top-left" expandIcon="print" id="print-expand">
        <arcgis-print></arcgis-print>
      </arcgis-expand>

      {/* Action Panel */}
      <arcgis-expand
        slot="top-right"
        mode="floating"
        id="actionpanel-expand"
        expanded
      >
        <div style={{ maxHeight: "200px" }}>
          <ActionPanel id={actionPanelExpanded} />
        </div>
      </arcgis-expand>

      {/* Chart */}
      <arcgis-expand
        slot="top-left"
        mode="floating"
        expandIcon="graph-pie-slice"
        close-on-esc
        expanded
      >
        {arcgisMap && <WorkablePileCapChart />}
      </arcgis-expand>

      <arcgis-expand
        slot="top-left"
        mode="floating"
        expandIcon="information"
        close-on-esc
      >
        <div style={{ width: "300px", paddingLeft: "20px" }}>
          <p
            style={{
              fontWeight: "bold",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Useful Information
          </p>
          This smart map displays two things:
          <ul>
            <li>Worakbe pile caps, </li>
            <li>
              Obstructing lots, structures, households, utilities, and
              others.{" "}
            </li>
          </ul>
          <div style={{ paddingLeft: "20px" }}>
            <li>
              The source of data:{" "}
              <b style={{ color: "black" }}>Master list tables</b> provided by
              the RAP Team and N2 Civil Team.
            </li>
            <li>
              {" "}
              Frequency of updating information:{" "}
              <b style={{ color: "black" }}>Weekly</b>.
            </li>
            <li>
              {" "}
              Note that obstructing utilities only include point features (e.g.,
              utility poles) but not line feature (e.g., telecom line or
              cables).
            </li>
          </div>
        </div>
      </arcgis-expand>

      {/* Legend */}
      <arcgis-legend
        style={{ width: "70%" }}
        slot="bottom-right"
        id="arcgis-map-legend"
      ></arcgis-legend>

      {/*------------------------------------------------------------ */}
      {/* Overview Map */}
      <arcgis-expand id="overview-expanded" slot="bottom-right">
        <div>
          <arcgis-map
            style={{
              width: "75.9vw",
              height: "40vh",
              position: "relative",
              borderStyle: "solid",
              borderColor: "grey",
              borderWidth: "1.7px",
            }}
            id="arcgis-overview-map"
            basemap={basemapUserDefined}
            ground="world-elevation"
            zoom={16}
            rotation={305}
            center={overViewCenter}
          ></arcgis-map>
        </div>
      </arcgis-expand>
    </arcgis-map>
  );
}

export default MapPanel;
