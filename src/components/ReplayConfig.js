var options = {
  trackPointOptions: {
    // whether to draw track point
    isDraw: true,
    // whether to use canvas to draw it, if false, use leaflet api `L.circleMarker`
    useCanvas: false,
    stroke: true,
    color: "#000000",
    fill: true,
    fillColor: "rgba(0,0,0,0)",
    opacity: 0,
    radius: 12
  },
  targetOptions: {
    // whether to use an image to display target, if false, the program provides a default
    useImg: true,
    // if useImg is true, provide the imgUrl
    imgUrl: "../light-infantry.svg",
    // the width of target, unit: px
    width: 60,
    // the height of target, unit: px
    height: 40,
    // the stroke color of target, effective when useImg set false
    color: "#00f",
    // the fill color of target, effective when useImg set false
    fillColor: "#9FD12D"
  },
  clockOptions: {
    // the default speed
    // caculate method: fpstime * Math.pow(2, speed - 1)
    // fpstime is the two frame time difference
    speed: 10,
    // the max speed
    maxSpeed: 100
  },
  toolTipOptions: {
    offset: [0, 0],
    direction: "top",
    permanent: false
  }
};

export default options;
