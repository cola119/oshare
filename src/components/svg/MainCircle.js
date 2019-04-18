import React from "react";

const MainCircle = (props) => {
  const { id, x, y, r } = props.circle;
  const { strokeWidth, opacity } = props.style;
  const event = props.event;
  const text = props.text;


  return (
    <g>
      <circle id={id} cx={x} cy={y} r={r} onClick={event.onClick} onContextMenu={event.onContextMenu} onMouseDown={event.onMouseDown}
        style={{
          fill: "#9400D3",
          stroke: "#9400D3",
          strokeWidth: strokeWidth,
          opacity: opacity,
          fillOpacity: "0.0"
        }}
      />
      <circle
        id={id} cx={x} cy={y} r={5} onClick={event.onClick} onContextMenu={event.onContextMenu} onMouseDown={event.onMouseDown}
        style={{
          fill: "#9400D3",
          stroke: "#9400D3",
          strokeWidth: "1",
          opacity: "1",
          fillOpacity: "0.5"
        }}
      />
      <text x={x + 5} y={y - 5} fontFamily="Verdana" fontSize="20">{text}</text>
    </g>
  )
}

export default MainCircle;
