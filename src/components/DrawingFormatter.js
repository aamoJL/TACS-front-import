import L from "leaflet";

const polylineFormat = data => {
  return {
    type: "polyline",
    coordinates: data._latlngs.map(ltlg => [ltlg.lat, ltlg.lng])
  };
};

const polygonFormat = data => {
  return {
    type: "polygon",
    coordinates: [data._latlngs[0].map(ltlg => [ltlg.lat, ltlg.lng])]
  };
};

const rectangleFromat = data => {
  return {
    type: "rectangle",
    coordinates: [
      [data._bounds._northEast.lat, data._bounds._northEast.lng],
      [data._bounds._southWest.lat, data._bounds._southWest.lng]
    ]
  };
};

const circleFormat = data => {
  return {
    type: "circle",
    coordinates: [data._latlng.lat, data._latlng.lng],
    radius: data._mRadius
  };
};

const markerFormat = data => {
  return {
    type: "marker",
    coordinates: [data._latlng.lat, data._latlng.lng]
  };
};

const textFormat = data => {
  // workaround as tooltip._content does not exist when deleting textbox
  let text = data._tooltip._content
    ? data._tooltip._content.innerText
    : data._tooltip._container.innerText;
  return {
    type: "textbox",
    coordinates: [data._latlng.lat, data._latlng.lng],
    text: text
  };
};

const flagboxFormat = data => {
  return {
    type: "flagbox",
    coordinates: [data._latlng.lat, data._latlng.lng]
  };
};

var DrawingFormatter = {
  polyline: polylineFormat,
  polygon: polygonFormat,
  rectangle: rectangleFromat,
  circle: circleFormat,
  marker: markerFormat,
  textbox: textFormat,
  flagbox: flagboxFormat
};

export const initialTextSetup = (layer, text) => {
  // have to create tooltip as a DOM element to allow text selecting. maybe
  let tooltip = L.DomUtil.create("div", "editable");
  // need ids for tooltips to be able to add a blur event to them
  tooltip.innerHTML =
    '<div contenteditable="true" placeholder="Click out to save" id="' +
    layer._leaflet_id +
    '">' +
    text +
    "</div>";
  layer.bindTooltip(tooltip, {
    permanent: true,
    direction: "bottom",
    interactive: true
  });
  // disable dragging when cursor is over marker (tooltip)
  // clicking on tooltip fires the marker's click handler, hence e.layer.on
  layer.on("mouseover", function() {
    layer._map.dragging.disable();
  });
  // enable dragging again when cursor is out of marker (tooltip)
  layer.on("mouseout", function() {
    layer._map.dragging.enable();
  });
  // show placeholder text again upon emptying textbox
  layer.on("keyup", function() {
    // when the text area is emptied, a <br> appears
    // manually removing it so that the placeholder text can show
    if (
      tooltip.innerHTML ===
        '<div placeholder="Click out to save" contenteditable="true" id ="' +
          layer._leaflet_id +
          "><br></div>" ||
      tooltip.innerHTML ===
        '<div placeholder="Click out to save" contenteditable="true" id ="' +
          layer._leaflet_id +
          "><div><br></div></div>"
    ) {
      tooltip.innerHTML =
        '<div placeholder="Click out to save" contenteditable="true" id ="' +
        layer._leaflet_id +
        "></div>";
    }
  });
  layer.options.oldText = text;
  return;
};

export default DrawingFormatter;
