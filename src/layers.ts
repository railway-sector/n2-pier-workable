import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Basemap from "@arcgis/core/Basemap";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import {
  cp_brkline_label,
  cp_brkline_renderer,
  lineSymbolOverview_nscrex,
  lot_layer_renderer,
  lotIdLabel,
  monopile_label,
  monopile_render,
  nlo_renderer,
  nonwork_piern_label,
  opacity,
  pcap_all_renderer,
  pcap_land_renderer,
  pcap_nlo_renderer,
  pcap_other_renderer,
  pcap_str_renderer,
  pcap_util_renderer,
  piern_labels,
  piern_land_label,
  piern_nlo_label,
  piern_other_label,
  piern_str_label,
  piern_util_label,
  portalItems,
  prow_renderer,
  station_label,
  station_point_symbol,
  strip_map_renderer,
  struc_layer_renderer,
  strucLabel,
  utility_marker_renderer,
  workall_piern_number_label,
} from "./uniqueValue";

//-------------------------------------//
//           Alignmnet Layers          //
//-------------------------------------//
export const basemapUserDefined = new Basemap({
  baseLayers: [
    new VectorTileLayer({
      portalItem: { id: "c62a1769441f4dfca8ef64dd860d6d15" },
    }),
  ],
});

//--- STATION POINT LAYER ---//
export const n2StationLayer = new FeatureLayer({
  portalItem: portalItems("ace32f63bafc40f6bcfeecbee5fa6c69"),
  layerId: 1,
  title: "Station",
  popupEnabled: false,
  definitionExpression: "Station <> 'NCC'",
  renderer: station_point_symbol,
  labelingInfo: [station_label],
  opacity: opacity,
});
n2StationLayer.listMode = "hide";

//--- CP BREAKLINE LAYER ---//
export const cp_break_lines = new FeatureLayer({
  portalItem: portalItems("38c8a9beadcc456191f0f0768acde8f2"),
  title: "CP Break Line",
  renderer: cp_brkline_renderer,
  labelingInfo: [cp_brkline_label],
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});
cp_break_lines.listMode = "hide";

//--- PROW LAYER ---//
export const prowLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/N2_Alignment/FeatureServer/1",
  layerId: 1,
  title: "PROW",
  popupEnabled: false,
  renderer: prow_renderer,
});
prowLayer.listMode = "hide";

///--- STRIP MAP LAYER ---//
export const stripMapLayer = new FeatureLayer({
  portalItem: portalItems("2f183f5686314b958a4e13a811960c12"),
  outFields: ["PhotoURL", "PageNumber", "Angle"],
  title: "Strip Map",
  popupEnabled: false,
  renderer: strip_map_renderer,
  maxScale: 5000,
  minScale: 0,
});

//--- MONOPILE LAYER ---
export const monopilesLayer = new FeatureLayer({
  portalItem: portalItems("6f4bf8c34d344277bb69f6590096203f"),
  minScale: 150000,
  maxScale: 0,
  definitionExpression:
    "PierNumber IN ('P-159C', 'P-159NB', 'P-159SB', 'P-160C', 'P-160NB', 'P-160SB')",
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
  renderer: monopile_render,
  labelingInfo: [monopile_label],
});
monopilesLayer.listMode = "hide";

//-------------------------------------//
//          Pile Cap Layers            //
//-------------------------------------//
export const pileCapLayer = new FeatureLayer({
  portalItem: portalItems("6f4bf8c34d344277bb69f6590096203f"),
  title: "Pile Cap",
  minScale: 150000,
  maxScale: 0,
  renderer: pcap_all_renderer,
  labelingInfo: [workall_piern_number_label, nonwork_piern_label],
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- OBSTRUTING LAND ---//
export const lotLayer = new FeatureLayer({
  portalItem: portalItems("23500954a8d84a46886e76e6e0883a69"),
  layerId: 4,
  labelingInfo: [lotIdLabel],
  renderer: lot_layer_renderer,
  outFields: ["LotID"],
  title: "Land Acquisition",
  definitionExpression: "OwnershipType = 0 and Obstruction = 'Yes'",
  minScale: 10000,
  maxScale: 0,
  popupTemplate: { title: "{LotID}: {StatusLA}", lastEditInfoEnabled: false },
  elevationInfo: { mode: "on-the-ground" },
});

//--- OBSTRUTING STRUCTURE (BUILDING) ---//
export const structureLayer = new FeatureLayer({
  portalItem: portalItems("23500954a8d84a46886e76e6e0883a69"),
  layerId: 3,
  labelingInfo: [strucLabel],
  renderer: struc_layer_renderer,
  definitionExpression: "Obstruction = 'Yes'",
  title: "Structure",
  minScale: 2500,
  maxScale: 0,
  popupTemplate: {
    title: "{StrucID}: {StatusStruc}",
    lastEditInfoEnabled: false,
  },
  elevationInfo: { mode: "on-the-ground" },
});

//--- OBSTRUTING HOUSEHOLDS ---//
export const nloLayer = new FeatureLayer({
  portalItem: portalItems("23500954a8d84a46886e76e6e0883a69"),
  layerId: 1,
  renderer: nlo_renderer,
  definitionExpression: "StatusRC > 1",
  title: "NLO (Non-Land Owner)",
  elevationInfo: { mode: "on-the-ground" },
  minScale: 3000,
  maxScale: 0,
  popupTemplate: { title: "{StrucID}: {StatusRC}", lastEditInfoEnabled: false },
});

//--- OBSTRUTING UTILITY ---//
export const utilityPointLayer = new FeatureLayer({
  portalItem: portalItems("7507e625f480470a9af257d60cf67c1c"),
  layerId: 1,
  title: "Utility",
  minScale: 5000,
  maxScale: 0,
  renderer: utility_marker_renderer,
  popupTemplate: {
    title: "{comp_agency} - {UtilType}: {Status} for {LAYER} work",
    lastEditInfoEnabled: false,
  },
});

//-------------------------------------//
//           Overview Map              //
//-------------------------------------//
//--- STATIOIN POINT LAYER ---//
export const n2StationLayer_overview = new FeatureLayer({
  portalItem: portalItems("ace32f63bafc40f6bcfeecbee5fa6c69"),
  layerId: 1,
  title: "Station",
  popupEnabled: false,
  definitionExpression: "Station <> 'NCC'",
  renderer: station_point_symbol,
  labelingInfo: [station_label],
  opacity: opacity,
});
n2StationLayer_overview.listMode = "hide";

//--- PILE CAP LAYER ---//
export const pileCapLayer_overview = new FeatureLayer({
  portalItem: portalItems("6f4bf8c34d344277bb69f6590096203f"),
  title: "Pile Cap",
  maxScale: 0,
  renderer: pcap_land_renderer,
  labelingInfo: [workall_piern_number_label, nonwork_piern_label],
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- PROW LAYER ---//
export const prowLayer_overview = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/N2_Alignment/FeatureServer/1",
  layerId: 1,
  title: "PROW",
  popupEnabled: false,
  renderer: prow_renderer,
});
prowLayer_overview.listMode = "hide";

//--- CENTER LINE LAYER ---//
export const n2CenterlineOverView = new FeatureLayer({
  portalItem: portalItems("ace32f63bafc40f6bcfeecbee5fa6c69"),
  renderer: lineSymbolOverview_nscrex,
  layerId: 2,
  popupEnabled: false,
});

//--- OBSTRUCTING LOT LAYER ---//
export const lotLayer_overview = new FeatureLayer({
  portalItem: portalItems("23500954a8d84a46886e76e6e0883a69"),
  layerId: 4,
  labelsVisible: false,
  renderer: lot_layer_renderer,
  title: "Land Acquisition",
  outFields: ["LotID"],
  definitionExpression: "OwnershipType = 0 and Obstruction = 'Yes'",
  maxScale: 0,
  elevationInfo: { mode: "on-the-ground" },
});

//--- OBSTRUCTING STRUCTURE (BUILDING) ---//
export const structureLayer_overview = new FeatureLayer({
  portalItem: portalItems("23500954a8d84a46886e76e6e0883a69"),
  layerId: 3,
  labelsVisible: false,
  renderer: struc_layer_renderer,
  definitionExpression: "Obstruction = 'Yes'",
  labelingInfo: [strucLabel],
  title: "Structure",
  maxScale: 0,
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- OBSTRUCTING HOUSEHOLDS ---//
export const nloLayer_overview = new FeatureLayer({
  portalItem: portalItems("23500954a8d84a46886e76e6e0883a69"),
  layerId: 1,
  renderer: nlo_renderer,
  definitionExpression: "StatusRC > 1",
  title: "NLO (Non-Land Owner)",
  elevationInfo: { mode: "on-the-ground" },
  maxScale: 0,
  popupEnabled: false,
});

//--- OBSTRUCTING UTILITY POINTS ---//
export const utilityPointLayer_overview = new FeatureLayer({
  portalItem: portalItems("7507e625f480470a9af257d60cf67c1c"),
  layerId: 1,
  title: "Utility",
  maxScale: 0,
  renderer: utility_marker_renderer,
  popupEnabled: false,
});

//--- STRIP MAP LAYER ---//
export const stripMapLayer_overview = new FeatureLayer({
  portalItem: portalItems("2f183f5686314b958a4e13a811960c12"),
  outFields: ["PageNumber", "GroupId"],
  title: "Strip Map",
  popupEnabled: false,
  visible: false,
});

//-------------------------------------//
//           Other layers              //
//-------------------------------------//
export const dateTable = new FeatureLayer({
  portalItem: portalItems("b2a118b088a44fa0a7a84acbe0844cb2"),
});

//-------------------------------------//
//           Other parameters          //
//-------------------------------------//
export const layerInfos = [
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

//--- PILE CAP QUERIES FOR SYBMOLOGY & LABELS ---//
export const pcap_render_q = [
  {
    component: "All",
    renderer: pcap_all_renderer,
    labelInfo: piern_labels,
  },
  {
    component: "Land",
    layerv: lotLayer,
    renderer: pcap_land_renderer,
    labelInfo: piern_land_label,
  },
  {
    component: "Structure",
    layerv: structureLayer,
    renderer: pcap_str_renderer,
    labelInfo: piern_str_label,
  },
  {
    component: "ISF",
    layerv: nloLayer,
    renderer: pcap_nlo_renderer,
    labelInfo: piern_nlo_label,
  },
  {
    component: "Utility",
    layerv: utilityPointLayer,
    renderer: pcap_util_renderer,
    labelInfo: piern_util_label,
  },
  {
    component: "Others",
    renderer: pcap_other_renderer,
    labelInfo: piern_other_label,
  },
];
