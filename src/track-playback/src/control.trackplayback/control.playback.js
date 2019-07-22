import L from "leaflet";
import { flagboxIcon } from "../../../components/DrawToolsPanel";

export const TrackPlayBackControl = L.Control.extend({
  options: {
    position: "topright",
    showOptions: true,
    showInfo: true,
    showSlider: true,
    autoPlay: false
  },

  initialize: function(trackplayback, map, options) {
    this.map = map;
    this.factions = [];
    L.Control.prototype.initialize.call(this, options);
    this.trackPlayBack = trackplayback;
    this.trackPlayBack.on("tick", this._tickCallback, this);
    this.leafletDrawings = [];
    this.mapflagboxes = [];
  },

  // init object to pass drawing data to right function
  _drawFunction: function(data, time) {
    // create leaflet objects
    var createMarker = data => {
      return L.marker(data.coordinates).addTo(this.map);
    };
    var createPolyline = data => {
      return L.polyline(data.coordinates, {
        color: data.color || "#0000ff",
        time: time
      }).addTo(this.map);
    };
    var createPolygon = data => {
      return L.polygon(data.coordinates, {
        color: data.color || "#0000ff",
        time: time
      }).addTo(this.map);
    };
    var createRectangle = data => {
      return L.rectangle(data.coordinates, {
        color: data.color || "#0000ff",
        time: time
      }).addTo(this.map);
    };
    var createCircle = data => {
      return L.circle(data.coordinates, {
        radius: data.radius,
        color: data.color || "#0000ff",
        time: time
      }).addTo(this.map);
    };
    var obj = {
      marker: createMarker,
      polyline: createPolyline,
      polygon: createPolygon,
      rectangle: createRectangle,
      circle: createCircle,
      textbox: null
    };
    return obj[data.type](data);
  },

  onAdd: function(map) {
    this._initContainer();
    return this._container;
  },

  onRemove: function(map) {
    this.trackPlayBack.dispose();
    this.trackPlayBack.off("tick", this._tickCallback, this);
  },

  /**
   * 根据unix时间戳(单位:秒)获取时间字符串
   * @param  {[int]} time     [时间戳（精确到秒）]
   * @param  {[string]} accuracy [精度，日：d, 小时：h,分钟：m,秒：s]
   * @return {[string]}          [yy:mm:dd hh:mm:ss]
   */
  getTimeStrFromUnix: function(time, accuracy = "s") {
    return `
      ${new Date(time).toLocaleDateString("en-US")} 
      ${new Date(time * 1e3).toISOString().slice(-13, -5)}
    `;
  },

  _initContainer: function() {
    var className = "leaflet-control-playback";
    this._container = L.DomUtil.create("div", className);
    L.DomEvent.disableClickPropagation(this._container);

    this._optionsContainer = this._createContainer(
      "optionsContainer",
      this._container
    );
    this._buttonContainer = this._createContainer(
      "buttonContainer",
      this._container
    );
    this._infoContainer = this._createContainer(
      "infoContainer",
      this._container
    );
    this._sliderContainer = this._createContainer(
      "sliderContainer",
      this._container
    );
    this._filterContainer = this._createContainer(
      "filterContainer",
      this._container
    );
    /*     this._lineCbx = this._createCheckbox(
      "show trackLine",
      "show-trackLine",
      this._optionsContainer,
      this._showTrackLine
    ); */
    // create checkboxes for filtering persons based on their class
    this._filterInfantry = this._createCheckbox(
      "show infantry units",
      "show-infantry",
      this._filterContainer,
      this._showInfantry
    );
    this._filterRecon = this._createCheckbox(
      "show recon units",
      "show-recon",
      this._filterContainer,
      this._showRecon
    );
    this._filterMechanized = this._createCheckbox(
      "show mechanized units",
      "show-mechanized",
      this._filterContainer,
      this._showMechanized
    );
    // show some text between class based and faction based filtering
    this._factionText = this._createInfo(
      "Faction filtering:",
      "",
      "faction-text-filter",
      this._filterContainer
    );
    // get factions in replay
    this.factions = this.trackPlayBack.passFactions();
    // create checkboxes for filtering persons based on their faction
    this._factionCheckboxes = this.factions.map(faction => {
      return this._createCheckbox(
        `show ${faction.name}`,
        `show-${faction.name}`,
        this._filterContainer,
        this._showFaction
      );
    });
    // create a div container for score replay
    this._scoreContainer = this._createContainer(
      "scoreContainer",
      this._container
    );
    // create score blocks for each faction
    // don't create an admin scorebox
    this._factionScoreboxes = this.factions.map(faction => {
      if (faction.name !== "admin")
        return this._createInfo(
          `${faction.name}: `,
          0,
          "scoreBlock",
          this._scoreContainer
        );
    });
    // pop the admin faction
    this._factionScoreboxes.pop();

    this._playBtn = this._createButton(
      "play",
      "btn-stop",
      this._buttonContainer,
      this._play
    );
    this._restartBtn = this._createButton(
      "replay",
      "btn-restart",
      this._buttonContainer,
      this._restart
    );
    this._slowSpeedBtn = this._createButton(
      "decrease speed",
      "btn-slow",
      this._buttonContainer,
      this._slow
    );
    this._quickSpeedBtn = this._createButton(
      "increase speed",
      "btn-quick",
      this._buttonContainer,
      this._quick
    );
    /*     this._closeBtn = this._createButton(
      "close",
      "btn-close",
      this._buttonContainer,
      this._close
    ); */

    this._infoStartTime = this._createInfo(
      "Game started: ",
      this.getTimeStrFromUnix(this.trackPlayBack.getStartTime()),
      "info-start-time",
      this._infoContainer
    );
    this._infoEndTime = this._createInfo(
      "Game ended: ",
      this.getTimeStrFromUnix(this.trackPlayBack.getEndTime()),
      "info-end-time",
      this._infoContainer
    );
    this._infoCurTime = this._createInfo(
      "Current time: ",
      this.getTimeStrFromUnix(this.trackPlayBack.getCurTime()),
      "info-cur-time",
      this._infoContainer
    );
    this._infoSpeedRatio = this._createInfo(
      "speed: ",
      `X${this.trackPlayBack.getSpeed()}`,
      "info-speed-ratio",
      this._infoContainer
    );

    this._slider = this._createSlider(
      "time-slider",
      this._sliderContainer,
      this._scrollchange
    );

    return this._container;
  },

  _createContainer: function(className, container) {
    return L.DomUtil.create("div", className, container);
  },

  _createCheckbox: function(labelName, className, container, fn) {
    let divEle = L.DomUtil.create(
      "div",
      className + " trackplayback-checkbox",
      container
    );

    let inputEle = L.DomUtil.create("input", "trackplayback-input", divEle);
    let inputId = `trackplayback-input-${L.Util.stamp(inputEle)}`;
    inputEle.setAttribute("type", "checkbox");
    inputEle.setAttribute("id", inputId);
    inputEle.checked = true;

    let labelEle = L.DomUtil.create("label", "trackplayback-label", divEle);
    labelEle.setAttribute("for", inputId);
    labelEle.innerHTML = labelName;

    L.DomEvent.on(inputEle, "change", fn, this);

    return divEle;
  },

  _createButton: function(title, className, container, fn) {
    let link = L.DomUtil.create("a", className, container);
    link.href = "#";
    link.title = title;

    /*
     * Will force screen readers like VoiceOver to read this as "Zoom in - button"
     */
    link.setAttribute("role", "button");
    link.setAttribute("aria-label", title);

    L.DomEvent.disableClickPropagation(link);
    L.DomEvent.on(link, "click", fn, this);

    return link;
  },

  _createInfo: function(title, info, className, container) {
    let infoContainer = L.DomUtil.create("div", "info-container", container);
    let infoTitle = L.DomUtil.create("span", "info-title", infoContainer);
    infoTitle.innerHTML = title;
    let infoEle = L.DomUtil.create("span", className, infoContainer);
    infoEle.innerHTML = info;
    return infoEle;
  },

  _createSlider: function(className, container, fn) {
    let sliderEle = L.DomUtil.create("input", className, container);
    sliderEle.setAttribute("type", "range");
    sliderEle.setAttribute("min", this.trackPlayBack.getStartTime());
    sliderEle.setAttribute("max", this.trackPlayBack.getEndTime());
    sliderEle.setAttribute("value", this.trackPlayBack.getCurTime());

    L.DomEvent.on(
      sliderEle,
      "click mousedown dbclick",
      L.DomEvent.stopPropagation
    )
      .on(sliderEle, "click", L.DomEvent.preventDefault)
      .on(sliderEle, "change", fn, this)
      .on(sliderEle, "mousemove", fn, this);

    return sliderEle;
  },

  _showTrackLine(e) {
    if (e.target.checked) {
      this.trackPlayBack.showTrackLine();
    } else {
      this.trackPlayBack.hideTrackLine();
    }
  },

  _showInfantry(e) {
    this.trackPlayBack.toggleInfantry(e.target.checked);
  },

  _showRecon(e) {
    this.trackPlayBack.toggleRecon(e.target.checked);
  },

  _showMechanized(e) {
    this.trackPlayBack.toggleMechanized(e.target.checked);
  },
  _showFaction(e) {
    let target = e.target.parentNode.className.substring(
      5,
      e.target.parentNode.className.indexOf(" ")
    );
    this.trackPlayBack.toggleFactions(e.target.checked, target);
    for (let faction of this.factions) {
      if (faction.name === target) {
        faction.active = e.target.checked;
        break;
      }
    }
  },

  _resetMap() {
    this.leafletDrawings.forEach(drawing => {
      if (drawing) this.map.removeLayer(drawing);
    });
    this.leafletDrawings = [];
    this.mapflagboxes.forEach(box => {
      if (box) this.map.removeLayer(box);
    });
    this.mapflagboxes = [];
  },

  _play: function() {
    let hasClass = L.DomUtil.hasClass(this._playBtn, "btn-stop");
    if (hasClass) {
      L.DomUtil.removeClass(this._playBtn, "btn-stop");
      L.DomUtil.addClass(this._playBtn, "btn-start");
      this._playBtn.setAttribute("title", "stop");
      this.trackPlayBack.start();
    } else {
      L.DomUtil.removeClass(this._playBtn, "btn-start");
      L.DomUtil.addClass(this._playBtn, "btn-stop");
      this._playBtn.setAttribute("title", "play");
      this.trackPlayBack.stop();
    }
  },

  _restart: function() {
    // 播放开始改变播放按钮样式
    this._resetMap();
    L.DomUtil.removeClass(this._playBtn, "btn-stop");
    L.DomUtil.addClass(this._playBtn, "btn-start");
    this._playBtn.setAttribute("title", "stop");
    this.trackPlayBack.rePlaying();
  },

  _slow: function() {
    this.trackPlayBack.slowSpeed();
    let sp = this.trackPlayBack.getSpeed();
    this._infoSpeedRatio.innerHTML = `X${sp}`;
  },

  _quick: function() {
    this.trackPlayBack.quickSpeed();
    let sp = this.trackPlayBack.getSpeed();
    this._infoSpeedRatio.innerHTML = `X${sp}`;
  },

  _close: function() {
    L.DomUtil.remove(this._container);
    if (this.onRemove) {
      this.onRemove(this._map);
    }
    return this;
  },

  _scrollchange: function(e) {
    this._resetMap();
    let val = Number(e.target.value);
    this.trackPlayBack.setCursor(val);
  },

  _tickCallback: function(e) {
    // 更新时间
    let time = this.getTimeStrFromUnix(e.time);
    this._infoCurTime.innerHTML = time;
    this._slider.value = e.time;
    // 播放结束后改变播放按钮样式
    if (e.time >= this.trackPlayBack.getEndTime()) {
      L.DomUtil.removeClass(this._playBtn, "btn-start");
      L.DomUtil.addClass(this._playBtn, "btn-stop");
      this._playBtn.setAttribute("title", "play");
      this.trackPlayBack.stop();
    }
    // tick scores
    for (let i = 0; i < this._factionScoreboxes.length; i++) {
      this._factionScoreboxes[i].innerHTML = this.trackPlayBack.passScores(i);
    }
    // tick drawings
    this._tickDrawings(e.time);
    // tick flagboxes
    let flagboxes = this.trackPlayBack.passFlagboxes();
    for (let i = 0; i < flagboxes.length; i++) {
      if (!this.mapflagboxes[i]) {
        this.mapflagboxes[i] = this._createFlagbox(flagboxes[i]);
        this.mapflagboxes[i].bindPopup(this._createPopup(flagboxes[i]));
      } else if (
        flagboxes[i].history.timestamp > this.mapflagboxes[i].options.time
      ) {
        this.map.removeLayer(this.mapflagboxes[i]);
        this.mapflagboxes[i] = this._createFlagbox(flagboxes[i]);
        this.mapflagboxes[i].bindPopup(this._createPopup(flagboxes[i]));
      }
    }
    //
    // 更新时间轴
  },

  _createPopup: function(box) {
    return `
    NodeId: ${box.objectivePointDescription} <br />
    Value: ${box.objectivePointMultiplier} <br />
    Owner: ${box.history.owner.factionName} <br />
    Status: ${box.history.action.message}
  `;
  },

  _createFlagbox: function(box) {
    return L.marker(box.data.coordinates, {
      icon: flagboxIcon(box.history.owner.colour, box.history.action.status),
      time: box.history.timestamp
    }).addTo(this.map);
  },

  _tickDrawings: function(time) {
    // tick drawings
    let drawings = this.trackPlayBack.passDrawings();
    for (let i = 0; i < drawings.length; i++) {
      let show = true;
      // check if drawing is filtered by faction
      // only if drawing is not null
      if (drawings[i]) {
        let index = this.factions.findIndex(
          x => x.name === drawings[i].data.faction
        );
        show = this.factions[index].active;
      }
      // if the drawing is null, remove the layer from map if it exists
      // if the drawing is not null, but set to inactive, remove the layer
      // if the faction has been filtered, remove the layer
      if (!drawings[i] || !drawings[i].drawingIsActive || !show) {
        if (this.leafletDrawings[i]) {
          this.map.removeLayer(this.leafletDrawings[i]);
          this.leafletDrawings[i] = null;
        }
      }
      // draw layer if it's active
      else if (drawings[i].drawingIsActive && !this.leafletDrawings[i]) {
        this.leafletDrawings[i] = this._drawFunction(
          drawings[i].data,
          drawings[i].timestamp
        );
      }
      // draw the element again if it has been updated
      else if (
        this.leafletDrawings[i] &&
        drawings[i].timestamp > this.leafletDrawings[i].options.time
      ) {
        this.map.removeLayer(this.leafletDrawings[i]);
        this.leafletDrawings[i] = this._drawFunction(
          drawings[i].data,
          drawings[i].timestamp
        );
      }
    }
  }
});

export const trackplaybackcontrol = function(trackplayback, map, options) {
  return new TrackPlayBackControl(trackplayback, map, options);
};
