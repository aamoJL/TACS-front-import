import React, { Component } from "react";
import L from "leaflet";
import { MapLayer, withLeaflet } from "react-leaflet";

class TextBox extends MapLayer {
  createLeafletElement(opts) {
    const TextBox = L.Marker.extend({
      options: {
        name: "",
        type: ""
      }
    });

    console.log(new TextBox());

    return new TextBox(opts.position);

    /*
    const TextBox = L.Marker.extend({
      options: {
        icon: L.divIcon({
          name: "textbox",
          type: "textbox",
          className: "", // empty class to override default styling
          iconSize: [20, 20],
          iconAnchor: [10, 20]
        }),
        repeatMode: false,
        interactive: true
      },
      onAdd: map => {
        console.log("hello");
        L.Marker.prototype.onAdd.call(this, map);

        let tooltip = L.DomUtil.create("div", "editable");

        // need ids for tooltips to be able to add a blur event to them
        tooltip.innerHTML =
          '<div contenteditable="true" placeholder="Click out to save" id="' +
          this._leaflet_id +
          '"></div>';

        console.log(this);

        this.bindTooltip(tooltip, {
          permanent: true,
          direction: "bottom",
          interactive: true
        });

        // disable dragging when cursor is over marker (tooltip)
        // clicking on tooltip fires the marker's click handler, hence e.layer.on
        this.on("mouseover", function() {
          this._map.dragging.disable();
        });

        // enable dragging again when cursor is out of marker (tooltip)
        this.on("mouseout", function() {
          this._map.dragging.enable();
        });

        // show placeholder text again upon emptying textbox
        this.on("keyup", function() {
          // when the text area is emptied, a <br> appears
          // manually removing it so that the placeholder text can show
          if (
            tooltip.innerHTML ===
              '<div placeholder="Click out to save" contenteditable="true"><br></div>' ||
            tooltip.innerHTML ===
              '<div placeholder="Click out to save" contenteditable="true"><div><br></div></div>'
          ) {
            tooltip.innerHTML =
              '<div placeholder="Click out to save" contenteditable="true"></div>';
          }
        });

        // blur event listener can't be given straight to a layer
        // getting element by ID and adding an event listener to the element
        document
          .getElementById(this._leaflet_id)
          .addEventListener("blur", this.makeGeoJSON.bind(this, this)); // can't put this.makeGeoJSON(e) straight, as it calls the function
        document.getElementById(this._leaflet_id).focus();
      }
      initialize: function(map, options) {
        this.type = "textbox"; // important to have a unique type, so that it won't get mixed up with other elements
        this.featureTypeCode = "textbox";
        L.Draw.Feature.prototype.initialize.call(this, map, options);
      }
    });
    */

    /*
    L.Draw.MarkerTextBox = L.Draw.Marker.extend({
      onAdd: map => {
        // have to create tooltip as a DOM element to allow text selecting. maybe
        let tooltip = L.DomUtil.create("div", "editable");

        // need ids for tooltips to be able to add a blur event to them
        tooltip.innerHTML =
          '<div contenteditable="true" placeholder="Click out to save" id="' +
          this._leaflet_id +
          '"></div>';

        this.bindTooltip(tooltip, {
          permanent: true,
          direction: "bottom",
          interactive: true
        });

        // disable dragging when cursor is over marker (tooltip)
        // clicking on tooltip fires the marker's click handler, hence e.layer.on
        this.on("mouseover", function() {
          this._map.dragging.disable();
        });

        // enable dragging again when cursor is out of marker (tooltip)
        this.on("mouseout", function() {
          this._map.dragging.enable();
        });

        // show placeholder text again upon emptying textbox
        this.on("keyup", function() {
          // when the text area is emptied, a <br> appears
          // manually removing it so that the placeholder text can show
          if (
            tooltip.innerHTML ===
              '<div placeholder="Click out to save" contenteditable="true"><br></div>' ||
            tooltip.innerHTML ===
              '<div placeholder="Click out to save" contenteditable="true"><div><br></div></div>'
          ) {
            tooltip.innerHTML =
              '<div placeholder="Click out to save" contenteditable="true"></div>';
          }
        });

        // blur event listener can't be given straight to a layer
        // getting element by ID and adding an event listener to the element
        document
          .getElementById(this._leaflet_id)
          .addEventListener("blur", this.makeGeoJSON.bind(this, this)); // can't put this.makeGeoJSON(e) straight, as it calls the function
        document.getElementById(this._leaflet_id).focus();
      },
      options: {
        icon: L.divIcon({
          className: "", // empty class to override default styling
          iconSize: [20, 20],
          iconAnchor: [10, 20]
        }),
        repeatMode: false,
        interactive: true
      },
      initialize: function(map, options) {
        this.type = "textbox"; // important to have a unique type, so that it won't get mixed up with other elements
        this.featureTypeCode = "textbox";
        L.Draw.Feature.prototype.initialize.call(this, map, options);
      }
    });
      */
  }
}

export default withLeaflet(TextBox);
