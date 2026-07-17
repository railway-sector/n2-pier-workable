/* eslint-disable jsx-a11y/alt-text */
import { use, useEffect, useState } from "react";
import "../index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import {
  basemapUserDefined,
  lotLayer_overview,
  n2CenterlineOverView,
  n2StationLayer_overview,
  nloLayer_overview,
  pileCapLayer_overview,
  prowLayer_overview,
  stripMapLayer,
  stripMapLayer_overview,
  structureLayer_overview,
  utilityPointLayer_overview,
  pcap_render_q,
} from "../layers";
import { overViewCenter } from "../uniqueValue";
import {
  addLayersToMap,
  disableZooming,
  queryDefinitionExpression,
  stripMapRenderer,
} from "../query";
import { MyContext } from "../contexts/MyContext";
import type { ArcgisMap } from "@arcgis/map-components/dist/components/arcgis-map";

const MapOverview = () => {
  const { cpackage, component } = use(MyContext);
  const [overviewReady, setOverviewReady] = useState<boolean>(false);

  const arcgisMap = document.querySelector("#arcgis-map") as ArcgisMap;
  const overviewMap = document.querySelector(
    "#arcgis-overview-map",
  ) as ArcgisMap;

  overviewMap?.viewOnReady(() => {
    overviewMap.hideAttribution = true;
    overviewMap && disableZooming(overviewMap?.view);
    setOverviewReady(true);
  });

  useEffect(() => {
    //--- Do not run codes until both views (main map & overview map) exist and
    //--- overview map is ready.
    //--- I.e., the codes below will not be executed initially.
    if (!overviewReady || !arcgisMap || !overviewMap) return;

    //--- Add overview map layers
    addLayersToMap(overviewMap?.map, [
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

    const qe = cpackage === "All" ? "1=1" : `CP = '${cpackage}'`;
    const qe2 = cpackage === "All" ? "1=1" : `GroupId = '${cpackage}'`;
    stripMapLayer.definitionExpression = `${qe} OR ${qe2}`;

    queryDefinitionExpression({
      queryExpression: qe,
      featureLayer1: pileCapLayer_overview,
      featureLayers2: [
        lotLayer_overview,
        structureLayer_overview,
        nloLayer_overview,
        utilityPointLayer_overview,
      ],
      componentArray: pcap_render_q,
      componentSelected: component,
    });

    stripMapRenderer(
      stripMapLayer,
      stripMapLayer_overview,
      arcgisMap,
      overviewMap,
    );
  }, [overviewReady, arcgisMap, overviewMap, cpackage, component]);

  return (
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
  );
};

export default MapOverview;
