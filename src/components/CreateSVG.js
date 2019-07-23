export const RegularFlagboxSVG = ownerColour => {
  return `
  <?xml version="1.0" encoding="utf-8"?>
  <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  viewBox="0 0 97.3 143" style="enable-background:new 0 0 97.3 143;" xml:space="preserve">
  <style type="text/css">
    .st0{fill:#3C3C3B;}
    .st1{stroke:#000000;stroke-miterlimit:10;}
    </style>
    <circle class="st0" cx="22.7" cy="22.6" r="7.8"/>
    <ellipse class="st0" cx="22.7" cy="131" rx="10.1" ry="6"/>
    <ellipse class="st0" cx="22.7" cy="125.9" rx="6.9" ry="4.2"/>
    <polygon class="st1" style="fill: ${ownerColour}"; points="83.8,33.2 53.8,33.2 53.8,77.2 83.8,77.2 68.8,55.2 "/>
    <polyline points="58.9,75.5 53.4,75.5 53.4,77.7 "/>
    <rect x="24.8" y="30.4" class="st1" style="fill: ${ownerColour}"; width="33.6" height="44.6"/>
    <path class="st0" d="M22.7,127.9L22.7,127.9c-1.7,0-3.1-1.4-3.1-3.1V29.5c0-1.7,1.4-3.1,3.1-3.1l0,0c1.7,0,3.1,1.4,3.1,3.1v95.3
    C25.8,126.5,24.4,127.9,22.7,127.9z"/>
    </svg>
    
    `;
};

export const CapturingFlagboxSVG = ownerColour => {
  return `
  <?xml version="1.0" encoding="utf-8"?>
  <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 97.3 143" style="enable-background:new 0 0 97.3 143;" xml:space="preserve">
  <style type="text/css">
    .st2{fill:#3C3C3B;}
    .st3{stroke:#000000;stroke-miterlimit:10;}
  </style>
  <circle class="st2" cx="22.7" cy="22.6" r="7.8"/>
  <ellipse class="st2" cx="22.7" cy="131" rx="10.1" ry="6"/>
  <ellipse class="st2" cx="22.7" cy="125.9" rx="6.9" ry="4.2"/>
  <polygon class="st3" style="fill: ${ownerColour}"; points="83.8,33.2 53.8,33.2 53.8,77.2 83.8,77.2 68.8,55.2 "/>
  <polyline points="58.9,75.5 53.4,75.5 53.4,77.7 "/>
  <rect x="24.8" y="30.4" class="st3" style="fill: ${ownerColour}"; width="33.6" height="44.6"/>
  <path class="st2" d="M22.7,127.9L22.7,127.9c-1.7,0-3.1-1.4-3.1-3.1V29.5c0-1.7,1.4-3.1,3.1-3.1l0,0c1.7,0,3.1,1.4,3.1,3.1v95.3
    C25.8,126.5,24.4,127.9,22.7,127.9z"/>
  </svg>
  
  `;
};

export const PlayerInfantrySVG = (amount, colour) => {
  return `
  <?xml version="1.0" encoding="utf-8"?>
  <svg viewBox="36.145 26.104 428.715 176.707" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com">
  <rect x="36.145" y="26.104" width="428.715" height="176.707" style="stroke-width: 8px; stroke: rgb(29, 29, 27); fill: rgb(85, 96, 35);"/>
  <rect x="49.197" y="44.177" width="262.641" height="140.562" style="fill: ${colour}; stroke-width: 8px; stroke: rgb(29, 29, 27);"/>
  <rect x="325.112" y="44.177" width="126.696" height="140.562" style="fill: ${colour}; stroke: rgb(29, 29, 27); stroke-width: 8px;"/>
  <line style="stroke-width: 8px; stroke: rgb(29, 29, 27);" x1="48.986" y1="184.845" x2="312.58" y2="43.754"/>
  <line style="stroke-width: 8px; stroke: rgb(29, 29, 27);" x1="48.775" y1="43.542" x2="311.947" y2="184.211"/>
  <rect x="330.744" y="69.099" width="115.745" height="89.555" style="fill: rgb(29, 29, 27);"/>
  <text style="fill: rgb(255, 255, 255); font-family: Oswald; font-size: 57.5px; white-space: pre;" x="332.901" y="137.523">${amount}</text>
  </svg>
  `;
};

export const PlayerReconSVG = (amount, colour) => {
  return `
  <?xml version="1.0" encoding="utf-8"?>
  <svg viewBox="36.145 26.104 428.715 176.707" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com">
  <rect x="36.145" y="26.104" width="428.715" height="176.707" style="stroke-width: 8px; stroke: rgb(29, 29, 27); fill: rgb(85, 96, 35);"/>
  <rect x="49.197" y="44.177" width="262.641" height="140.562" style="fill: ${colour}; stroke-width: 8px; stroke: rgb(29, 29, 27);"/>
  <rect x="325.112" y="44.177" width="126.696" height="140.562" style="fill: ${colour}; stroke: rgb(29, 29, 27); stroke-width: 8px;"/>
  <line style="stroke-width: 8px; stroke: rgb(29, 29, 27);" x1="48.986" y1="184.845" x2="312.58" y2="43.754"/>
  <rect x="330.744" y="69.099" width="115.745" height="89.555" style="fill: rgb(29, 29, 27);"/>
  <text style="fill: rgb(255, 255, 255); font-family: Oswald; font-size: 57.5px; white-space: pre;" x="332.901" y="137.523">${amount}</text>
</svg>
  `;
};

export const PlayerMechanizedSVG = (amount, colour) => {
  return `
  <?xml version="1.0" encoding="utf-8"?>
  <svg viewBox="36.145 26.104 428.715 176.707" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com">
  <rect x="36.145" y="26.104" width="428.715" height="176.707" style="stroke-width: 8px; stroke: rgb(29, 29, 27); fill: rgb(85, 96, 35);"/>
  <rect x="49.197" y="44.177" width="262.641" height="140.562" style="fill: ${colour}; stroke-width: 8px; stroke: rgb(29, 29, 27);"/>
  <rect x="325.112" y="44.177" width="126.696" height="140.562" style="fill: ${colour}; stroke: rgb(29, 29, 27); stroke-width: 8px;"/>
  <line style="stroke-width: 8px; stroke: rgb(29, 29, 27);" x1="48.986" y1="184.845" x2="312.58" y2="43.754"/>
  <line style="stroke-width: 8px; stroke: rgb(29, 29, 27);" x1="48.775" y1="43.542" x2="311.947" y2="184.211"/>
  <rect x="330.744" y="69.099" width="115.745" height="89.555" style="fill: rgb(29, 29, 27);"/>
  <ellipse style="fill: none; stroke: rgb(29, 29, 27); stroke-width: 8px;" cx="181.628" cy="115.989" rx="111.723" ry="43.51"/>
  <text style="fill: rgb(255, 255, 255); font-family: Oswald; font-size: 57.5px; white-space: pre;" x="332.901" y="137.523">${amount}</text>
  </svg>
  `;
};
