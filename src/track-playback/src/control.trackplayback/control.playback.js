import L from "leaflet";

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
    L.Control.prototype.initialize.call(this, options);
    this.trackPlayBack = trackplayback;
    this.trackPlayBack.on("tick", this._tickCallback, this);
    this.leafletDrawings = [];
  },

  // init object to pass drawing data to right function
  _drawFunction: function(data) {
    // create leaflet objects
    var createMarker = data => {
      return L.polyline(data.geometry.coordinates).addTo(this.map);
    };
    var createPolyline = data => {
      data.geometry.coordinates = data.geometry.coordinates.map(cords => {
        return [cords[1], cords[0]];
      });
      return L.polyline(data.geometry.coordinates, {
        color: data.properties.color
      }).addTo(this.map);
    };
    var createPolygon = data => {
      // geoJSON has lat lng wrong way so turn them around
      data.geometry.coordinates = data.geometry.coordinates[0].map(cords => {
        return [cords[1], cords[0]];
      });
      return L.polygon(data.geometry.coordinates, {
        color: data.properties.color
      }).addTo(this.map);
    };
    var createRectangle = data => {
      return L.rectangle(data.geometry.coordinates, {
        color: data.properties.color
      }).addTo(this.map);
    };
    var createCircle = data => {
      return L.circle(data.geometry.coordinates, {
        radius: data.properties.radius
      }).addTo(this.map);
    };
    // handle faulty cords
    if (!data.geometry.coordinates[0][0]) {
      return null;
    }

    var obj = {
      Marker: createMarker,
      LineString: createPolyline,
      Polygon: createPolygon,
      Rectangle: createRectangle,
      Circle: createCircle
    };
    return obj[data.geometry.type](data);
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
    /*     time = parseInt(time * 1000);
    let newDate = new Date(time);
    let year = newDate.getFullYear();
    let month =
      newDate.getMonth() + 1 < 10
        ? "0" + (newDate.getMonth() + 1)
        : newDate.getMonth() + 1;
    let day =
      newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
    let hours =
      newDate.getHours() < 10 ? "0" + newDate.getHours() : newDate.getHours();
    let minuts =
      newDate.getMinutes() < 10
        ? "0" + newDate.getMinutes()
        : newDate.getMinutes();
    let seconds =
      newDate.getSeconds() < 10
        ? "0" + newDate.getSeconds()
        : newDate.getSeconds();
    let ret;
    if (accuracy === "d") {
      ret = year + "-" + month + "-" + day;
    } else if (accuracy === "h") {
      ret = year + "-" + month + "-" + day + " " + hours;
    } else if (accuracy === "m") {
      ret = year + "-" + month + "-" + day + " " + hours + ":" + minuts;
    } else {
      ret =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minuts +
        ":" +
        seconds;
    }
    return ret; */
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
    let factions = this.trackPlayBack.passFactions();
    // create checkboxes for filtering persons based on their faction
    this._factionCheckboxes = factions.map(faction => {
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
    this._factionScoreboxes = factions.map(faction => {
      return this._createInfo(
        `${faction.name}: `,
        0,
        "scoreBlock",
        this._scoreContainer
      );
    });

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
    this.trackPlayBack.toggleFactions(
      e.target.checked,
      e.target.parentNode.className.substring(
        5,
        e.target.parentNode.className.indexOf(" ")
      )
    );
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
    let val = Number(e.target.value);
    this.trackPlayBack.setCursor(val);
  },

  _tickCallback: function(e) {
    // 更新时间
    let time = this.getTimeStrFromUnix(e.time);
    this._infoCurTime.innerHTML = time;
    // tick scores
    for (let i = 0; i < this._factionScoreboxes.length; i++) {
      this._factionScoreboxes[i].innerHTML = this.trackPlayBack.passScores(i);
    }
    // tick drawings
    let drawings = this.trackPlayBack.passDrawings();
    for (let i = 0; i < drawings.length; i++) {
      // skip if undefined
      if (!drawings[i]) return;
      // remove if it's not active
      if (!drawings[i].drawingIsActive && this.leafletDrawings[i]) {
        this.map.removeLayer(this.leafletDrawings[i]);
        this.leafletDrawings[i] = null;
        return;
      }
      // else draw the marker if it's not drawn
      if (!this.leafletDrawings[i]) {
        this.leafletDrawings[i] = this._drawFunction(drawings[i].data);
      }
    }
    //
    // 更新时间轴
    this._slider.value = e.time;
    // 播放结束后改变播放按钮样式
    if (e.time >= this.trackPlayBack.getEndTime()) {
      L.DomUtil.removeClass(this._playBtn, "btn-start");
      L.DomUtil.addClass(this._playBtn, "btn-stop");
      this._playBtn.setAttribute("title", "play");
      this.trackPlayBack.stop();
    }
  }
});

export const trackplaybackcontrol = function(trackplayback, map, options) {
  return new TrackPlayBackControl(trackplayback, map, options);
};
