/* eslint-disable jsx-a11y/alt-text */
import { use, useEffect, useState } from "react";
import "../index.css";
import "../App.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-placement";
import "@arcgis/map-components/components/arcgis-compass";
import "@arcgis/map-components/components/arcgis-print";
import {
  basemapUserDefined,
  cp_break_lines,
  lotLayer,
  lotLayer_overview,
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

import { MyContext } from "../App";
import {
  home_center,
  home_rotation,
  home_scale,
  overViewCenter,
} from "../UniqueValues";
import ActionPanel from "./ActionPanel";
import { disableZooming, filterPileCapByCP, zoomToLayer } from "../Query";
import WorkablePileCapChart from "./WorkablePileCapChart";

function MapPanel() {
  const { contractPackage, component } = use(MyContext);

  // Main Map
  const [mapView, setMapView] = useState();
  const arcgisMap = document.querySelector("#arcgis-map");

  // Strip Map
  const [selectedStrip, setSelectedStrip] = useState(null);

  // Expand (Action Panel)
  const arcgisActionPanelExpand = document.querySelector("#actionpanel-expand");
  const [actionPanelExpanded, setActionPanelExpanded] = useState(true);

  reactiveUtils.when(
    () => arcgisActionPanelExpand?.expanded === false,
    () => setActionPanelExpanded(false)
  );

  reactiveUtils.when(
    () => arcgisActionPanelExpand?.expanded === true,
    () => setActionPanelExpanded(true)
  );

  // Legend
  const arcgisMapLegend = document.querySelector("arcgis-legend");
  const layerInfos = [
    {
      layer: pileCapLayer,
      title: "Piers",
    },
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
  ];

  useEffect(() => {
    if (contractPackage === "N-01") {
      arcgisMap?.view
        .goTo({
          center: [120.7656353, 14.9174688],
          zoom: 12,
        })
        .catch((err) => {
          // A rejected view indicates a fatal error making it unable to display.
          // Use the errback function to handle when the view doesn't load properly
          console.error("MapView rejected:", err);
        });
    } else {
      zoomToLayer(pileCapLayer, arcgisMap);
    }
  }, [contractPackage]);

  useEffect(() => {
    if (mapView) {
      // zoomToLayer(pileCapLayer, arcgisMap);
      arcgisMap.view.ui.add(arcgisActionPanelExpand, "top-right");
      arcgisMap.map.add(prowLayer);
      arcgisMap.map.add(lotLayer);
      arcgisMap.map.add(structureLayer);
      arcgisMap.map.add(pileCapLayer);
      arcgisMap.map.add(nloLayer);
      arcgisMap.map.add(utilityPointLayer);
      arcgisMap.map.add(n2StationLayer);
      arcgisMap.map.add(cp_break_lines);
      arcgisMap.map.add(stripMapLayer);

      arcgisMapLegend.layerInfos = layerInfos;
      arcgisMapLegend.hideLayersNotInCurrentView = false;
      arcgisMapLegend.respectLayerVisibilityDisabled = true;
    }
  });

  useEffect(() => {
    if (contractPackage || component) {
      filterPileCapByCP(contractPackage);

      if (component === "All") {
        pileCapLayer.renderer = pile_cap_renderer_all;
        pileCapLayer.labelingInfo = pierNumberLayer_label_all;
        lotLayer.visible = true;
        structureLayer.visible = true;
        nloLayer.visible = true;
        utilityPointLayer.visible = true;

        // overview
        pileCapLayer_overview.renderer = pile_cap_renderer_all;
        pileCapLayer_overview.labelingInfo = pierNumberLayer_label_all;
        lotLayer_overview.visible = true;
        structureLayer_overview.visible = true;
        nloLayer_overview.visible = true;
        utilityPointLayer_overview.visible = true;
      } else if (component === "Land") {
        pileCapLayer.renderer = pile_cap_renderer_land;
        pileCapLayer.labelingInfo = pierNumberLayer_label_land;
        lotLayer.visible = true;
        structureLayer.visible = false;
        nloLayer.visible = false;
        utilityPointLayer.visible = false;

        // overview
        pileCapLayer_overview.renderer = pile_cap_renderer_land;
        pileCapLayer_overview.labelingInfo = pierNumberLayer_label_land;
        lotLayer_overview.visible = true;
        structureLayer_overview.visible = false;
        nloLayer_overview.visible = false;
        utilityPointLayer_overview.visible = false;
      } else if (component === "Structure") {
        pileCapLayer.renderer = pile_cap_renderer_structure;
        pileCapLayer.labelingInfo = pierNumberLayer_label_struc;
        lotLayer.visible = false;
        structureLayer.visible = true;
        nloLayer.visible = false;
        utilityPointLayer.visible = false;

        // Overview
        pileCapLayer_overview.renderer = pile_cap_renderer_structure;
        pileCapLayer_overview.labelingInfo = pierNumberLayer_label_struc;
        lotLayer_overview.visible = false;
        structureLayer_overview.visible = true;
        nloLayer_overview.visible = false;
        utilityPointLayer_overview.visible = false;
      } else if (component === "ISF") {
        pileCapLayer.renderer = pile_cap_renderer_nlo;
        pileCapLayer.labelingInfo = pierNumberLayer_label_nlo;
        lotLayer.visible = false;
        structureLayer.visible = false;
        nloLayer.visible = true;
        utilityPointLayer.visible = false;

        // Overview
        pileCapLayer_overview.renderer = pile_cap_renderer_nlo;
        pileCapLayer_overview.labelingInfo = pierNumberLayer_label_nlo;
        lotLayer_overview.visible = false;
        structureLayer_overview.visible = false;
        nloLayer_overview.visible = true;
        utilityPointLayer_overview.visible = false;
      } else if (component === "Utility") {
        pileCapLayer.renderer = pile_cap_renderer_utility;
        pileCapLayer.labelingInfo = pierNumberLayer_label_utility;
        lotLayer.visible = false;
        structureLayer.visible = false;
        nloLayer.visible = false;
        utilityPointLayer.visible = true;

        // Overview
        pileCapLayer_overview.renderer = pile_cap_renderer_utility;
        pileCapLayer_overview.labelingInfo = pierNumberLayer_label_utility;
        lotLayer_overview.visible = false;
        structureLayer_overview.visible = false;
        nloLayer_overview.visible = false;
        utilityPointLayer_overview.visible = true;
      } else if (component === "Others") {
        pileCapLayer.renderer = pile_cap_renderer_others;
        pileCapLayer.labelingInfo = pierNumberLayer_label_others;
        lotLayer.visible = false;
        structureLayer.visible = false;
        nloLayer.visible = false;
        utilityPointLayer.visible = false;

        // Overview
        pileCapLayer_overview.renderer = pile_cap_renderer_others;
        pileCapLayer_overview.labelingInfo = pierNumberLayer_label_others;
        lotLayer_overview.visible = false;
        structureLayer_overview.visible = false;
        nloLayer_overview.visible = false;
        utilityPointLayer_overview.visible = false;
      }
    }
  }, [contractPackage, component]);

  //******************************************************** */
  // Overview map
  //******************************************************** */
  const [mapOverview, setMapOverview] = useState();
  const arcgisOverviewMap = document.querySelector("#arcgis-overview-map");

  // Expand (Overview Map)
  const arcgisOverviewMapExpand = document.querySelector("#overview-expanded");

  useEffect(() => {
    if (mapOverview) {
      arcgisMap.view.ui.add(arcgisOverviewMapExpand, "bottom-right");
      arcgisOverviewMap.map.add(prowLayer_overview);
      arcgisOverviewMap.map.add(n2CenterlineOverView);
      arcgisOverviewMap.map.add(lotLayer_overview);
      arcgisOverviewMap.map.add(structureLayer_overview);
      arcgisOverviewMap.map.add(pileCapLayer_overview);
      arcgisOverviewMap.map.add(nloLayer_overview);
      arcgisOverviewMap.map.add(utilityPointLayer_overview);
      arcgisOverviewMap.map.add(n2StationLayer_overview);
      arcgisOverviewMap.map.add(stripMapLayer_overview);

      // Disable all user navagating actions
      disableZooming(arcgisOverviewMap.view);
    }
  }, [arcgisMap]);

  //************************************************************* *//
  //************************************************************* *//
  // Feature Selection
  useEffect(() => {
    stripMapLayer.when(() => {
      arcgisMap?.view.on("click", (event) => {
        arcgisMap?.view.hitTest(event).then((response) => {
          const result = response.results[0];
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
    let highlight;
    selectedStrip &&
      arcgisMap?.whenLayerView(stripMapLayer).then((layerView) => {
        highlight = layerView.highlight(selectedStrip);
        arcgisMap.view.on("click", () => {
          highlight.remove();
        });
      });
  }, [selectedStrip]);

  return (
    <>
      <arcgis-map
        id="arcgis-map"
        basemap={basemapUserDefined}
        ground="world-elevation"
        zoom="12"
        center={home_center}
        rotation={home_rotation}
        // scale={home_scale}
        onarcgisViewReadyChange={(event) => {
          setMapView(event.target);
        }}
      >
        <arcgis-compass position="top-left"></arcgis-compass>

        {/* Printer widget */}
        <arcgis-expand
          position="top-left"
          expandedIcon="print"
          id="print-expand"
        >
          <arcgis-print position="top-left"></arcgis-print>
        </arcgis-expand>

        {/* Action Panel */}
        <arcgis-expand
          position="top-right"
          mode="floating"
          id="actionpanel-expand"
          expanded
          close-on-esc
        >
          <arcgis-placement>
            <ActionPanel id={actionPanelExpanded} />
          </arcgis-placement>
        </arcgis-expand>

        {/* Chart */}
        <arcgis-expand
          position="top-left"
          mode="floating"
          expandIcon="graph-pie-slice"
          close-on-esc
          expanded
        >
          <arcgis-placement>
            {arcgisMap && <WorkablePileCapChart />}
          </arcgis-placement>
        </arcgis-expand>

        {/* Legend */}
        <arcgis-legend
          position="bottom-right"
          id="arcgis-map-legend"
        ></arcgis-legend>

        {/*------------------------------------------------------------ */}
        {/* Overview Map */}
        <arcgis-expand id="overview-expanded" position="bottom-right">
          <arcgis-placement>
            <arcgis-map
              style={{
                width: "82.5vw",
                height: "40vh",
                borderStyle: "solid",
                borderColor: "grey",
                borderWidth: "1.7px",
              }}
              referenceElement="arcgis-map"
              id="arcgis-overview-map"
              basemap={basemapUserDefined}
              ground="world-elevation"
              zoom="16"
              rotation="305"
              center={overViewCenter}
              onarcgisViewReadyChange={(event) => {
                setMapOverview(event.target);
              }}
            ></arcgis-map>
          </arcgis-placement>
        </arcgis-expand>
      </arcgis-map>
    </>
  );
}

export default MapPanel;
