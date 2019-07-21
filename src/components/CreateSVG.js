export const CreateFlagboxSvg = (ownerColour, status) => {
  let svg_regular = `<?xml version="1.0" encoding="iso-8859-1"?>
  <!-- Generator: Adobe Illustrator 19.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
  <g>
    <rect x="22.5" y="27.5" style="fill:#F5C276;" width="4" height="11"/>
    <path style="fill:#C29653;" d="M26,28v10h-3V28H26 M27,27h-5v12h5V27L27,27z"/>
  </g>
  <g>
    <path style="fill:#8BB7F0;" d="M6.5,27.5V14c0-3.584,2.916-6.5,6.5-6.5h19c3.584,0,6.5,2.916,6.5,6.5v13.5H6.5z"/>
    <path style="fill:${ownerColour};" d="M32,8c3.308,0,6,2.692,6,6v13H7V14c0-3.308,2.692-6,6-6H32 M32,7H13c-3.85,0-7,3.15-7,7v14h33V14
      C39,10.15,35.85,7,32,7L32,7z"/>
  </g>
  <g>
    <path style="fill:#8BB7F0;" d="M6.5,27.5V13.853C6.5,10.409,9.477,7.5,13,7.5c3.584,0,6.5,2.916,6.5,6.5v13.5H6.5z"/>
    <g>
      <path style="fill:${ownerColour};" d="M13,8c3.308,0,6,2.692,6,6v13H7V13.853C7,10.68,9.748,8,13,8 M13,7c-3.85,0-7,3.15-7,6.853V28h14
        V14C20,10.15,16.85,7,13,7L13,7z"/>
    </g>
  </g>
  <g>
    <rect x="24.5" y="1.5" style="fill:#F78F8F;" width="5" height="3"/>
    <path style="fill:${ownerColour};" d="M29,2v2h-4V2H29 M30,1h-6v4h6V1L30,1z"/>
  </g>
  <g>
    <polygon style="fill:${ownerColour};" points="25,1 24,1 24,12 25,12 25,1 	"/>
  </g>
  <g>
    <circle style="fill:#F78F8F;" cx="24.5" cy="12.5" r="1"/>
    <path style="fill:${ownerColour};" d="M24.5,12c0.276,0,0.5,0.224,0.5,0.5S24.776,13,24.5,13S24,12.776,24,12.5S24.224,12,24.5,12
       M24.5,11c-0.828,0-1.5,0.672-1.5,1.5s0.672,1.5,1.5,1.5s1.5-0.672,1.5-1.5S25.328,11,24.5,11L24.5,11z"/>
  </g>
  <g>
    <rect x="9" y="15" style="fill:#8BB7F0;" width="8" height="1"/>
    <polygon style="fill:#4E7AB5;" points="17,15 9,15 9,16 17,16 17,15 	"/>
  </g>
  </svg>
  `;
  let svg_capture = `<?xml version="1.0" encoding="iso-8859-1"?>
  <!-- Generator: Adobe Illustrator 19.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
  <g>
    <rect x="22.5" y="27.5" style="fill:#F5C276;" width="4" height="11"/>
    <path style="fill:#C29653;" d="M26,28v10h-3V28H26 M27,27h-5v12h5V27L27,27z"/>
  </g>
  <g>
    <path style="fill:#8BB7F0;" d="M6.5,27.5V14c0-3.584,2.916-6.5,6.5-6.5h19c3.584,0,6.5,2.916,6.5,6.5v13.5H6.5z"/>
    <path style="fill:${ownerColour};" d="M32,8c3.308,0,6,2.692,6,6v13H7V14c0-3.308,2.692-6,6-6H32 M32,7H13c-3.85,0-7,3.15-7,7v13H1v1h38
      V14C39,10.15,35.85,7,32,7L32,7z"/>
  </g>
  <g>
    <path style="fill:#7496C4;" d="M6.5,27.5V13.853C6.5,10.409,9.477,7.5,13,7.5c3.584,0,6.5,2.916,6.5,6.5v13.5H6.5z"/>
    <g>
      <path style="fill:${ownerColour};" d="M13,8c3.308,0,6,2.692,6,6v13H7V13.853C7,10.68,9.748,8,13,8 M13,7c-3.85,0-7,3.15-7,6.853V28h14
        V14C20,10.15,16.85,7,13,7L13,7z"/>
    </g>
  </g>
  <g>
    <rect x="24.5" y="1.5" style="fill:#F78F8F;" width="5" height="3"/>
    <path style="fill:${ownerColour};" d="M29,2v2h-4V2H29 M30,1h-6v4h6V1L30,1z"/>
  </g>
  <g>
    <polygon style="fill:${ownerColour};" points="25,1 24,1 24,12 25,12 25,1 	"/>
  </g>
  <g>
    <circle style="fill:#F78F8F;" cx="24.5" cy="12.5" r="1"/>
    <path style="fill:${ownerColour};" d="M24.5,12c0.276,0,0.5,0.224,0.5,0.5S24.776,13,24.5,13S24,12.776,24,12.5S24.224,12,24.5,12
       M24.5,11c-0.828,0-1.5,0.672-1.5,1.5c0,0.828,0.672,1.5,1.5,1.5s1.5-0.672,1.5-1.5C26,11.672,25.328,11,24.5,11L24.5,11z"/>
  </g>
  <path style="fill:#4E7AB5;" d="M13,8c-3.252,0-6,2.68-6,5.853L19,27V14C19,10.692,16.308,8,13,8z"/>
  <g>
    <rect x="12" y="15" style="fill:#FFEEA3;" width="7" height="12"/>
  </g>
  <path style="fill:#BA9B48;" d="M19,20.953l-7-4.159v1.163l6.527,3.878c0.151,0.09,0.312,0.146,0.473,0.203V20.953z"/>
  </svg>
  `;
  return status === 2 ? svg_capture : svg_regular;
};
