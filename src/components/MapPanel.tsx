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
  lotLayer,
  lotLayer_overview,
  monopilesLayer,
  n2CenterlineOverView,
  n2StationLayer,
  n2StationLayer_overview,
  nloLayer,
  nloLayer_overview,
  pierNumberLayer_label_all,
  pierNumberLayer_label_land,
  pierNumberLayer_label_nlo,
  pierNumberLayer_label_others,
  pierNumberLayer_label_struc,
  pierNumberLayer_label_utility,
  pile_cap_renderer_all,
  pile_cap_renderer_land,
  pile_cap_renderer_nlo,
  pile_cap_renderer_others,
  pile_cap_renderer_structure,
  pile_cap_renderer_utility,
  pileCapLayer,
  pileCapLayer_overview,
  prowLayer,
  prowLayer_overview,
  stripMapLayer,
  stripMapLayer_overview,
  structureLayer,
  structureLayer_overview,
  utilityPointLayer,
  utilityPointLayer_overview,
} from "../layers";
import Extent from "@arcgis/core/geometry/Extent";
import "@esri/calcite-components/dist/components/calcite-button";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import { home_center, home_rotation, overViewCenter } from "../UniqueValues";
import ActionPanel from "./ActionPanel";
import {
  disableZooming,
  queryDefinitionExpression,
  zoomToLayer,
} from "../Query";
import WorkablePileCapChart from "./WorkablePileCapChart";
import { MyContext } from "../contexts/MyContext";
import type { ArcgisMap } from "@arcgis/map-components/dist/components/arcgis-map";
import type { ArcgisLegend } from "@arcgis/map-components/components/arcgis-legend";

function MapPanel() {
  const { contractPackage, component } = use(MyContext);

  // Main Map
  const arcgisMap = document.querySelector("#arcgis-map") as ArcgisMap;
  const [mapView, setMapView] = useState<any>();

  // Overview Map
  const arcgisOverviewMap = document.querySelector(
    "#arcgis-overview-map",
  ) as ArcgisMap;

  // Strip Map
  const [selectedStrip, setSelectedStrip] = useState(null);

  // Expand (Action Panel)
  const arcgisActionPanelExpand: any =
    document.querySelector("actionpanel-expand");
  const [actionPanelExpanded, setActionPanelExpanded] = useState(true);

  reactiveUtils.when(
    () => arcgisActionPanelExpand?.expanded === false,
    () => setActionPanelExpanded(false),
  );

  reactiveUtils.when(
    () => arcgisActionPanelExpand?.expanded === true,
    () => setActionPanelExpanded(true),
  );

  // Legend
  const arcgisMapLegend = document.querySelector(
    "arcgis-legend",
  ) as ArcgisLegend;
  const layerInfos = [
    {
      layer: lotLayer,
      title: "Land",
    },
    {
      layer: structureLayer,
      title: "Structure",
    },
    {
      layer: nloLayer,
      title: "NLO (Non-Land Owner)",
    },
    {
      layer: utilityPointLayer,
      title: "Utility Work (Incomplete)",
    },
    {
      layer: stripMapLayer,
      title: "Strip Map",
    },
    {
      layer: pileCapLayer,
      title: "Pile Cap",
    },
  ];

  arcgisMap?.viewOnReady(() => {
    console.log(mapView);
    arcgisMap.view.ui.add(arcgisActionPanelExpand, "top-right");
    arcgisMap?.map?.add(prowLayer);
    arcgisMap?.map?.add(lotLayer);
    arcgisMap?.map?.add(structureLayer);
    arcgisMap?.map?.add(pileCapLayer);
    arcgisMap?.map?.add(nloLayer);
    arcgisMap?.map?.add(utilityPointLayer);
    arcgisMap?.map?.add(n2StationLayer);
    arcgisMap?.map?.add(cp_break_lines);
    arcgisMap?.map?.add(stripMapLayer);
    arcgisMap?.map?.add(monopilesLayer);
    arcgisMap.hideAttribution = true;

    arcgisMapLegend.layerInfos = layerInfos;
    arcgisMapLegend.hideLayersNotInCurrentView = false;
    arcgisMapLegend.ignoreLayerVisibility = true;

    // Overview map
    arcgisOverviewMap?.map?.add(prowLayer_overview);
    arcgisOverviewMap?.map?.add(n2CenterlineOverView);
    arcgisOverviewMap?.map?.add(lotLayer_overview);
    arcgisOverviewMap?.map?.add(structureLayer_overview);
    arcgisOverviewMap?.map?.add(pileCapLayer_overview);
    arcgisOverviewMap?.map?.add(nloLayer_overview);
    arcgisOverviewMap?.map?.add(utilityPointLayer_overview);
    arcgisOverviewMap?.map?.add(n2StationLayer_overview);
    arcgisOverviewMap?.map?.add(stripMapLayer_overview);
    arcgisOverviewMap?.map?.add(monopilesLayer);
    arcgisOverviewMap.hideAttribution = true;
    arcgisOverviewMap && disableZooming(arcgisOverviewMap?.view);
  });

  useEffect(() => {
    const test = [
      {
        component: "All",
        renderer: pile_cap_renderer_all,
        labelInfo: pierNumberLayer_label_all,
      },
      {
        component: "Land",
        layerv: lotLayer,
        renderer: pile_cap_renderer_land,
        labelInfo: pierNumberLayer_label_land,
      },
      {
        component: "Structure",
        layerv: structureLayer,
        renderer: pile_cap_renderer_structure,
        labelInfo: pierNumberLayer_label_struc,
      },
      {
        component: "ISF",
        layerv: nloLayer,
        renderer: pile_cap_renderer_nlo,
        labelInfo: pierNumberLayer_label_nlo,
      },
      {
        component: "Utility",
        layerv: utilityPointLayer,
        renderer: pile_cap_renderer_utility,
        labelInfo: pierNumberLayer_label_utility,
      },
      {
        component: "Others",
        renderer: pile_cap_renderer_others,
        labelInfo: pierNumberLayer_label_others,
      },
    ];

    const qe = contractPackage === "All" ? "1=1" : `CP = '${contractPackage}'`;
    const qe2 =
      contractPackage === "All" ? "1=1" : `GroupId = '${contractPackage}'`;
    stripMapLayer.definitionExpression = `${qe} OR ${qe2}`;

    queryDefinitionExpression({
      queryExpression: qe,
      featureLayer1: pileCapLayer,
      featureLayers2: [lotLayer, structureLayer, nloLayer, utilityPointLayer],
      componentArray: test,
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
      componentArray: test,
      componentSelected: component,
    });
  }, [contractPackage, component]);

  useEffect(() => {
    zoomToLayer(pileCapLayer, arcgisMap);
  }, [contractPackage]);

  // Feature Selection
  useEffect(() => {
    stripMapLayer.when(() => {
      arcgisMap?.view.on("click", (event) => {
        arcgisMap?.view.hitTest(event).then((response) => {
          const result: any = response.results[0];
          // const title = result?.graphic.layer.title;
          if (result) {
            if (result.graphic.layer) {
              const layer_name = result.graphic.layer.title;
              if (layer_name === "Strip Map") {
                // view rotate
                arcgisMap.view.rotation = 305;

                // overview new extent
                const page_number = result.graphic.attributes["PageNumber"];
                const angle = result.graphic.attributes["Angle"];
                stripMapLayer_overview.definitionExpression =
                  "PageNumber = " + page_number;

                // const activeExtent = result?.graphic?.geometry?.extent.clone();
                const xmax = result.graphic.geometry.extent.xmax;
                const ymax = result.graphic.geometry.extent.ymax;
                const xmin = result.graphic.geometry.extent.xmin;
                const ymin = result.graphic.geometry.extent.ymin;

                const new_extent = new Extent({
                  xmax: xmax,
                  ymax: ymax,
                  xmin: xmin,
                  ymin: ymin,
                  spatialReference: {
                    wkid: 102100,
                  },
                });

                arcgisOverviewMap.extent = new_extent;
                arcgisOverviewMap.rotation = 360 - angle;
                arcgisOverviewMap.zoom = 17;

                setSelectedStrip(result.graphic.attributes["OBJECTID"]);
              }
            }
          }
        });
      });
    });
  });

  // Higlight selected strip
  useEffect(() => {
    let highlight: any;
    selectedStrip &&
      arcgisMap?.whenLayerView(stripMapLayer).then((layerView) => {
        highlight = layerView.highlight(selectedStrip);
        arcgisMap?.view.on("click", () => {
          highlight.remove();
        });
      });
  }, [selectedStrip]);

  return (
    <arcgis-map
      id="arcgis-map"
      basemap={basemapUserDefined}
      ground="world-elevation"
      zoom={12}
      center={home_center}
      rotation={home_rotation}
      // scale={home_scale}
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
        // close-on-esc
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
        // expanded
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
        // legendStyle="card"
        // cardStyleLayout="stack"
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
            // referenceElement="arcgis-map"
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
