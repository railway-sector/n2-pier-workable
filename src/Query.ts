/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  dateTable,
  lotLayer,
  lotLayer_overview,
  nloLayer,
  nloLayer_overview,
  pileCapLayer,
  pileCapLayer_overview,
  stripMapLayer,
  structureLayer,
  structureLayer_overview,
  utilityPointLayer,
  utilityPointLayer_overview,
} from "./layers";
import { home_rotation } from "./UniqueValues";

export const resizeObserverA = new ResizeObserver((entries: any) => {
  for (let entry of entries) {
    // entry.contentRect gives you the current width/height
    const { width, height } = entry.contentRect;

    console.log(`Current size: ${width}px x ${height}px`);

    // Example: Change background color if width is small
    if (width < 500 && entry.target instanceof HTMLElement) {
      entry.target.style.backgroundColor = "lightblue";
    }
  }
});

//------------------------------------------------//
//            Update As-of date                   //
//------------------------------------------------//
export function lastDateOfMonth(date: Date) {
  const old_date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const year = old_date.getFullYear();
  const month = old_date.getMonth() + 1;
  const day = old_date.getDate();
  const final_date = `${year}-${month}-${day}`;

  return final_date;
}

// Updat date
export async function dateUpdate(category: any) {
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const query = dateTable.createQuery();
  const queryExpression =
    "project = 'N2'" + " AND " + "category = '" + category + "'";
  query.where = queryExpression; // "project = 'N2'" + ' AND ' + "category = 'Land Acquisition'";

  return dateTable.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const dates = stats.map((result: any) => {
      // get today and date recorded in the table
      const today = new Date();
      const date = new Date(result.attributes.date);

      // Calculate the number of days passed since the last update
      const time_passed = today.getTime() - date.getTime();
      const days_passed = Math.round(time_passed / (1000 * 3600 * 24));

      const year = date.getFullYear();
      const month = monthList[date.getMonth()];
      const day = date.getDate();
      const final = year < 1990 ? "" : `${month} ${day}, ${year}`;
      return [final, days_passed];
    });
    return dates;
  });
}

//------------------------------------------------//
//             Filter Pile CAP by CP              //
//------------------------------------------------//
export function filterPileCapByCP(cp: any) {
  // cp = cp === "All" ? "N-01" : cp;

  const query_cp = cp === "All" ? "1=1" : "CP = '" + cp + "'";
  const query_cp2 = cp === "All" ? "1=1" : "GroupId = '" + cp + "'";
  pileCapLayer.definitionExpression = query_cp;
  pileCapLayer_overview.definitionExpression = query_cp;

  lotLayer.definitionExpression = query_cp;
  structureLayer.definitionExpression = query_cp;
  nloLayer.definitionExpression = query_cp;
  utilityPointLayer.definitionExpression = query_cp;
  stripMapLayer.definitionExpression = query_cp + " OR " + query_cp2;

  // Overview
  lotLayer_overview.definitionExpression = query_cp;
  structureLayer_overview.definitionExpression = query_cp;
  nloLayer_overview.definitionExpression = query_cp;
  utilityPointLayer_overview.definitionExpression = query_cp;
}

//------------------------------------------------//
//            Overview Map constraint             //
//------------------------------------------------//
export function disableZooming(view: any) {
  view.popup.dockEnabled = true;

  // Removes the zoom action on the popup
  view.popup.actions = [];

  // stops propagation of default behavior when an event fires
  function stopEvtPropagation(event: any) {
    event.stopPropagation();
  }

  // exlude the zoom widget from the default UI
  // view.ui.components = [];
  view.ui.components = [];

  // disable mouse wheel scroll zooming on the overView
  view?.on("mouse-wheel", stopEvtPropagation);

  // disable zooming via double-click on the overView
  view.on("double-click", stopEvtPropagation);

  // disable zooming out via double-click + Control on the overView
  view.on("double-click", ["Control"], stopEvtPropagation);

  // disables pinch-zoom and panning on the overView
  view.on("drag", stopEvtPropagation);

  // disable the overView's zoom box to prevent the Shift + drag
  // and Shift + Control + drag zoom gestures.
  view.on("drag", ["Shift"], stopEvtPropagation);
  view.on("drag", ["Shift", "Control"], stopEvtPropagation);

  // prevents zooming with the + and - keys
  view.on("key-down", (event: any) => {
    const prohibitedKeys = [
      "+",
      "-",
      "Shift",
      "_",
      "=",
      "ArrowUp",
      "ArrowDown",
      "ArrowRight",
      "ArrowLeft",
    ];
    const keyPressed = event.key;
    if (prohibitedKeys.indexOf(keyPressed) !== -1) {
      event.stopPropagation();
    }
  });

  return view;
}

//------------------------------------------------//
//                 Other functions                //
//------------------------------------------------//
// Zoom to layer
export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          // console.error(error);
          console.log("error");
        }
      });
  });
}

// Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  } else {
    return 0;
  }
}

// Return to home extent
const home_center: any = [120.9, 14.7832299];
export function homeExtentRenderer(view: any) {
  view.rotation = home_rotation;
  view.scale = 577790.5542885;
  view.center = home_center;
}

export const layersVisibleFalse = () => {
  lotLayer.visible = false;
  structureLayer.visible = false;
  nloLayer.visible = false;
  utilityPointLayer.visible = false;

  lotLayer_overview.visible = false;
  structureLayer_overview.visible = false;
  nloLayer_overview.visible = false;
  utilityPointLayer_overview.visible = false;
};
