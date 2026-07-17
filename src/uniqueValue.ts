import Extent from "@arcgis/core/geometry/Extent";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import TextSymbol from "@arcgis/core/symbols/TextSymbol.js";
import Font from "@arcgis/core/symbols/Font.js";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";

//----------------------------------------------//
//              portalItem                      //
//----------------------------------------------//
const portalItem_url = { url: "https://gis.railway-sector.com/portal" };

export const portalItems = (id: any) => {
  return { id: id, portal: portalItem_url };
};

export type statisticsType = "count" | "sum";
export const cpackages = ["All", "N-01", "N-02", "N-03", "N-04"];

//-------------------------------------//
//           Common Properties         //
//-------------------------------------//
export const cp_f = "CP";
export const lineWidth = "6px";
export const col_cline = {
  nscr_hex: "#ff5f22",
  mmsp_hex: "#00b7ff",
  nscrex_hex: "#ff5f22",
};

export const col_point = "white";
export const size_point = "12px"; // original: 10px
export const linew_point = 2.5; // original: 1.5
export const fontS_station = 11;

export const color_halo_piern = "#ffffff";
export const size_halo_piern = 0.5;

export const col_work = "#38A800";
export const col_nonworkable = "#FF0000";
export const col_comp = "#0070ff";
export const col_work_obs = [152, 230, 0, 0.5];
export const col_comp_obs = [0, 112, 255, 0.5]; // [152, 230, 0, 0.5];
export const col_nonwork_obs = [255, 0, 0, 0.4];
export const col_nonwork_str_obs = [104, 104, 104, 0.4];

export const xoffset = 0;
export const yoffset = 13;

// Main Map:------------------------------------
export const home_rotation = 360; // 330
export const home_center = [120.7656353, 14.9174688];
export const home_scale = 292400;
export const minScale = 577790;
export const minScale_stn = minScale + 1000;
export const maxScale = 0;
export const maxScale_stn = 288896; //288896
export const opacity = 1;

export const primaryLabelColor = "#9ca3af";

//-------------------------------------//
//           Alignmnet Layers          //
//-------------------------------------//
//--- STATION POINT LAYER ---//
export const station_point_symbol = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    style: "circle",
    color: col_point,
    size: size_point, // pixels
    outline: { color: col_cline.nscr_hex, width: linew_point },
  }),
});

export const station_symbol: any = new TextSymbol({
  color: col_cline.nscrex_hex,
  haloColor: "white",
  haloSize: 0.4,
  yoffset: -20,
  font: new Font({ size: fontS_station, weight: "bold" }),
});

export const station_label = new LabelClass({
  symbol: station_symbol,
  deconflictionStrategy: "none", // show overlapping numbers
  labelPlacement: "center-left",
  labelExpressionInfo: { expression: "$feature.StnName" },
  minScale: minScale,
  maxScale: maxScale,
});

//--- CP BREAKLINE LAYER ---//
export const cp_brkline_label = new LabelClass({
  symbol: new TextSymbol({
    color: "white",
    haloColor: "#9ca3af",
    haloSize: 0.3,
    yoffset: 5,
    xoffset: -10,
    font: { size: 7 },
  }),
  labelPlacement: "above-along",
  labelExpressionInfo: { expression: "$feature.CP_Start" },
});

export const cp_brkline_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({ color: "#4ce600", width: "2px" }),
});

//--- PROW LAYER ---//
export const prow_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({ color: "#ff0000", width: "2px" }),
});

//--- TUNNEL LINE LAYER ---//
export const tunnel_label = new LabelClass({
  symbol: new TextSymbol({
    color: "#808080",
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    font: { size: 10, weight: "bold" },
  }),
  labelExpression: "TBM Tunnel",
  repeatLabel: false,
});

export const tunnel_render = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#808080",
    width: "2px",
    style: "short-dash",
  }),
});

//--- STRIP MAP LAYER ---//
export const strip_map_uniqueV = [
  {
    value: "Non-Workable",
    label: "Non-Workable",
    symbol: new SimpleFillSymbol({
      color: col_nonwork_obs,
      outline: { width: 0.8, color: "black" },
    }),
  },
  {
    value: "Workable",
    label: "Workable",
    symbol: new SimpleFillSymbol({
      color: col_work_obs,
      outline: { width: 0.8, color: "grey" },
    }),
  },
  {
    value: "Completed",
    label: "Completed",
    symbol: new SimpleFillSymbol({
      color: col_comp_obs,
      outline: { width: 0.8, color: "grey" },
    }),
  },
];

export const col_work_obs_ov = [152, 230, 0, 0.5];
export const col_nonworke_obs_ov = [255, 0, 0, 0.4];

export const strip_map_uniqueVuniqueValueInfos_overview = [
  {
    value: "No",
    label: "Workable",
    symbol: new SimpleFillSymbol({
      color: undefined,
      outline: { width: 0.8, color: col_work_obs_ov },
    }),
  },
  {
    value: "Yes",
    label: "Non-Workable",
    symbol: new SimpleFillSymbol({
      color: undefined,
      outline: { width: 0.8, color: col_nonworke_obs_ov },
    }),
  },
];

const defaultFill = new SimpleFillSymbol({
  color: [169, 169, 169, 0.7],
  outline: { width: 0.8, color: "grey" },
});

export const strip_map_renderer = new UniqueValueRenderer({
  field: "Workability",
  defaultSymbol: defaultFill,
  uniqueValueInfos: strip_map_uniqueV,
});

//--- MONOPILE LAYER ---//
export const monopile_render = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: "#4c4d4b",
    style: "solid",
    outline: { width: 1, color: [255, 255, 255, 1] },
  }),
});

export const monopile_label = new LabelClass({
  symbol: new TextSymbol({
    color: "black",
    font: { size: 10 },
    xoffset: 10,
    yoffset: 10,
  }),
  labelPlacement: "above-right",
  labelExpressionInfo: { expression: '$feature.PierNumber + " (Monopile)"' },
});

export const monopile_label_overview = new LabelClass({
  symbol: new TextSymbol({ color: "black", font: { size: 9.5 } }),
  labelPlacement: "below-center",
  labelExpressionInfo: { expression: "'Monopile'" },
  where: "AllWorkable = 0 AND PierNumber = 'P-160SB'",
});

//-------------------------------------//
//       Pile Cap & Other Layers       //
//-------------------------------------//
// Declare labels and symbology delineating
// obstructing objects corresponding to pile caps

//--- PILE CAP LAYER: PIER NUMBER ---//
export const workable_fields = [
  "AllWorkable",
  "LandWorkable",
  "StrucWorkable",
  "NLOWorkable",
  "UtilWorkable",
  "OthersWorkable",
];

export const work_name_to_field = [
  { name: "All", field: "AllWorkable" },
  { name: "Land", field: "LandWorkable" },
  { name: "Structure", field: "StrucWorkable" },
  { name: "ISF", field: "NLOWorkable" },
  { name: "Utility", field: "UtilWorkable" },
  { name: "Others", field: "OthersWorkable" },
];

export const work_status_q = [
  { value: 0, category: "Workable", color: "#38A800" },
  { value: 1, category: "Non-Workable", color: "#FF0000" },
  { value: 2, category: "Completed", color: "#0070ff" },
];

export const workpier_uniqueV = work_status_q.map((f: any) => {
  return Object.assign({
    value: f.value,
    label: f.category,
    symbol: new SimpleFillSymbol({
      color: f.color,
      outline: { width: 1, color: "black" },
    }),
  });
});

export const pcap_all_renderer = new UniqueValueRenderer({
  field: workable_fields[0],
  uniqueValueInfos: workpier_uniqueV,
});

// WORKABLE
export const workall_piern_number_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_work,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "always-horizontal",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "AllWorkable = 0",
});

// NON-WORKABLE
export const nonwork_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_nonworkable,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "always-horizontal",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "AllWorkable = 1",
});

// COMPLETED
export const comp_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_comp,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "always-horizontal",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "AllWorkable = 2",
});

export const piern_labels = [
  nonwork_piern_label,
  workall_piern_number_label,
  comp_piern_label,
];

//--- OBSTRUTING LAND ---//
export const pcap_land_renderer = new UniqueValueRenderer({
  field: workable_fields[1],
  uniqueValueInfos: workpier_uniqueV,
});

// WORKABLE
export const workland_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_work,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "always-horizontal",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "LandWorkable = 0",
});

// NON-WORKABLE
export const nonworkland_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_nonworkable,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "above-right",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "LandWorkable = 1",
});

// COMPLETED
export const compland_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_comp,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "always-horizontal",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "AllWorkable = 2",
});

export const piern_land_label = [
  nonworkland_piern_label,
  workland_piern_label,
  compland_piern_label,
];

//---  OBSTRUTING STRUCTURE (BUILDING) ---//
export const pcap_str_renderer = new UniqueValueRenderer({
  field: workable_fields[2],
  uniqueValueInfos: workpier_uniqueV,
});

// WORKABLE
export const workstr_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_work,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "above-right",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "StrucWorkable = 0",
});

// NON-WORKABLE
export const nonworkstr_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_nonworkable,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "above-right",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "StrucWorkable = 1",
});

// COMPLETED
export const compstr_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_comp,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "always-horizontal",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "AllWorkable = 2",
});

export const piern_str_label = [
  nonworkstr_piern_label,
  workstr_piern_label,
  compstr_piern_label,
];

//--- OBSTRUTING HOUSEHOLDS ---//
export const pcap_nlo_renderer = new UniqueValueRenderer({
  field: workable_fields[3],
  uniqueValueInfos: workpier_uniqueV,
});

// WORKABLE
export const worknlo_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_work,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "above-right",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "NLOWorkable = 0",
});

// NON-WORKABLE
export const nonworknlo_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_nonworkable,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "above-right",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "NLOWorkable = 1",
});

// COMPLETED
export const compnlo_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_comp,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "always-horizontal",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "AllWorkable = 2",
});

export const piern_nlo_label = [
  nonworknlo_piern_label,
  worknlo_piern_label,
  compnlo_piern_label,
];

//--- OBSTRUTING UTILITY ---//
export const pcap_util_renderer = new UniqueValueRenderer({
  field: workable_fields[4],
  uniqueValueInfos: workpier_uniqueV,
});

// WORKABLE
export const workutil_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_work,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "above-right",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "UtilWorkable = 0",
});

// NON-WORKABLE
export const nonworkutil_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_nonworkable,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "above-right",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "UtilWorkable = 1",
});

// COMPLETED
export const computil_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_comp,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "always-horizontal",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "AllWorkable = 2",
});

export const piern_util_label = [
  nonworkutil_piern_label,
  workutil_piern_label,
  computil_piern_label,
];

//--- OBSTRUTING OTHERS ---//
export const pcap_other_renderer = new UniqueValueRenderer({
  field: workable_fields[5],
  uniqueValueInfos: workpier_uniqueV,
});

// WORKABLE
export const workother_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_work,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "above-right",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "OthersWorkable = 0",
});

// NON-WORKABLE
export const nonworkother_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_nonworkable,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "above-right",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "OthersWorkable = 1",
});

// COMPLETED
export const compother_piern_label = new LabelClass({
  symbol: new TextSymbol({
    color: col_comp,
    haloColor: color_halo_piern,
    haloSize: size_halo_piern,
    yoffset: yoffset,
    font: { size: 10, weight: "bold" },
  }),
  labelPlacement: "always-horizontal",
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  where: "AllWorkable = 2",
});

export const piern_other_label = [
  nonworkother_piern_label,
  workother_piern_label,
  compother_piern_label,
];

//-------------------------------------//
//       OBSTRUCTION LAYERS            //
//-------------------------------------//
//--- OBSTRUTING LAND ---//
export const lotIdLabel = new LabelClass({
  labelExpressionInfo: { expression: "$feature.LotID" },
  symbol: {
    type: "text",
    color: "black", //'#E1E1E1',
    haloColor: "#E1E1E1",
    haloSize: 0.35,
    font: { size: 9 },
  },
  minScale: 3000,
  maxScale: 0,
});

export const lot_layer_renderer = new UniqueValueRenderer({
  field: "Obstruction",
  uniqueValueInfos: [
    {
      value: "Yes",
      label: "Obstruction",
      symbol: new SimpleFillSymbol({
        color: col_nonwork_obs,
        outline: { width: 1, color: "black" },
      }),
    },
  ],
});

//--- OBSTRUTING STRUCTURE (BUILDING) ---//
export const strucLabel = new LabelClass({
  labelExpressionInfo: { expression: "$feature.StrucID" },
  symbol: {
    type: "text",
    color: "black", //'#E1E1E1',
    haloColor: "#E1E1E1",
    haloSize: 0.35,
    font: { size: 8 },
  },
});

export const struc_layer_renderer = new UniqueValueRenderer({
  field: "Obstruction",
  uniqueValueInfos: [
    {
      value: "Yes",
      label: "Obstruction",
      symbol: new SimpleFillSymbol({
        color: col_nonwork_str_obs,
        outline: { style: "short-dash", width: 1, color: "black" },
      }),
    },
  ],
});

//--- OBSTRUTING HOUSEHOLDS ---//
export const nlo_renderer = new UniqueValueRenderer({
  field: "Obstruction",
  uniqueValueInfos: [
    {
      value: "Yes",
      label: "Obstruction",
      symbol: new SimpleMarkerSymbol({
        color: "red",
        size: "8px",
        outline: { width: 0.3, color: "black" },
      }),
    },
  ],
});

//--- OBSTRUTING UTILITY ---//
export const size_util_marker = "20px";

function util_type_symbol(name: string, size: string) {
  return new PictureMarkerSymbol({ url: name, width: size, height: size });
}

export const utility_marker_renderer = new UniqueValueRenderer({
  valueExpression:
    "When($feature.Status == 0 && $feature.UtilType == 1, 'Telecom',\
                      $feature.Status == 0 && $feature.UtilType == 2, 'Water', \
                      $feature.Status == 0 && $feature.UtilType == 3, 'Sewage', \
                      $feature.Status == 0 && $feature.UtilType == 4, 'Power', \
                      $feature.Status == 0 && $feature.UtilType == 5, 'Oil',$feature.Comp_Agency)",

  uniqueValueInfos: [
    {
      value: "Telecom", // Telecom/Cable TV
      symbol: util_type_symbol(
        "https://EijiGorilla.github.io/Symbols/Telecom_Logo2.svg",
        size_util_marker,
      ),
    },
    {
      value: "Water", // water
      symbol: util_type_symbol(
        "https://EijiGorilla.github.io/Symbols/Water_Logo2.svg",
        size_util_marker,
      ),
    },
    {
      value: "Sewage", // Sewage
      symbol: util_type_symbol(
        "https://EijiGorilla.github.io/Symbols/Sewage_Logo2.svg",
        size_util_marker,
      ),
    },
    {
      value: "Power", // Power
      symbol: util_type_symbol(
        "https://EijiGorilla.github.io/Symbols/Power_Logo2.svg",
        size_util_marker,
      ),
    },
    {
      value: "Oil", // Oil & Gas
      symbol: util_type_symbol(
        "https://EijiGorilla.github.io/Symbols/Gas_Logo2.svg",
        size_util_marker,
      ),
    },
  ],
});

//-------------------------------------//
//           Overview Map              //
//-------------------------------------//
export const overViewCenter = [120.6736473, 15.0422548];
const default_extent = new Extent({
  xmax: 13446763.797407571,
  ymax: 1675633.4248131101,
  xmin: 13446180.965066897,
  ymin: 1675002.8193297577,
  spatialReference: { wkid: 102100 },
});
export const overViewDefaultExtent = default_extent;
export const zoom_overview = 7;

export const lineSymbolOverview_nscrex = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: col_cline.nscrex_hex,
    width: "2.5px",
    style: "solid",
  }),
});
