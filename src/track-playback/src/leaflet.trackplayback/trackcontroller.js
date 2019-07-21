import L from "leaflet";

import { isArray } from "./util";
import { Track } from "./track";

/**
 * 控制器类
 * 控制轨迹和绘制
 */
export const TrackController = L.Class.extend({
  initialize: function(data, draw, options) {
    L.setOptions(this, options);
    this._activeScores = [];
    this._activeDrawings = [];
    this._activeFlagboxes = [];
    this._tracks = data.tracks;
    this._scores = data.scores;
    this._drawings = data.drawings;
    this._objectivepoints = data.objectivepoints;
    this.addTrack(data.tracks || []);

    this._draw = draw;

    this._updateTime();
  },

  getMinTime: function() {
    return this._minTime;
  },

  getMaxTime: function() {
    return this._maxTime;
  },

  addTrack: function(track) {
    if (isArray(track)) {
      for (let i = 0, len = track.length; i < len; i++) {
        this.addTrack(track[i]);
      }
    } else if (track instanceof Track) {
      this._tracks.push(track);
      this._updateTime();
    } else {
      throw new Error(
        "tracks must be an instance of `Track` or an array of `Track` instance!"
      );
    }
  },

  drawTracksByTime: function(time) {
    this._draw.clear();
    // draw player locations
    for (let i = 0, len = this._tracks.length; i < len; i++) {
      let track = this._tracks[i];
      let tps = track.getTrackPointsBeforeTime(time);
      if (tps && tps.length) this._draw.drawTrack(tps);
    }
    // add scores to counter
    for (let i = 0; i < this._scores.length; i++) {
      let newScore = 0;
      let scores = this._scores[i];
      for (let j = 0; j < scores.length; j++) {
        if (scores[j].timestamp < time) {
          newScore = scores[j].score;
        }
      }
      this._activeScores[i] = newScore;
    }
    // draw mapdrawings to map
    for (let i = 0; i < this._drawings.length; i++) {
      let drawing = null;
      for (let j = 0; j < this._drawings[i].length; j++) {
        if (this._drawings[i][j].timestamp < time) {
          drawing = this._drawings[i][j];
        }
      }
      this._activeDrawings[i] = drawing;
    }
    // update flagbox status
    for (let i = 0; i < this._objectivepoints.length; i++) {
      let activebox = this._objectivepoints[i].history[0];
      for (let j = 0; j < this._objectivepoints[i].history.length; j++) {
        if (this._objectivepoints[i].history[j].timestamp < time) {
          activebox = this._objectivepoints[i].history[j];
        }
      }
      this._activeFlagboxes[i] = {
        objectivePointId: this._objectivepoints[i].objectivePointId,
        objectivePointDescription: this._objectivepoints[i]
          .objectivePointDescription,
        objectivePointMultiplier: this._objectivepoints[i]
          .objectivePointMultiplier,
        data: this._objectivepoints[i].data,
        history: activebox
      };
    }
  },

  _updateTime: function() {
    this._minTime = this._tracks[0].getStartTrackPoint().time;
    this._maxTime = this._tracks[0].getEndTrackPoint().time;
    for (let i = 0, len = this._tracks.length; i < len; i++) {
      let stime = this._tracks[i].getStartTrackPoint().time;
      let etime = this._tracks[i].getEndTrackPoint().time;
      if (stime < this._minTime) {
        this._minTime = stime;
      }
      if (etime > this._maxTime) {
        this._maxTime = etime;
      }
    }
  }
});

export const trackController = function(tracks, draw, options) {
  return new TrackController(tracks, draw, options);
};
