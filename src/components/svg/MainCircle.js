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
          fill: "transparent",
          stroke: "#9400D3",
          strokeWidth: strokeWidth,
          opacity: opacity,
          // fillOpacity: "0.0"
        }}
      />
      <circle
        id={id} cx={x} cy={y} r={10} onClick={event.onClick} onContextMenu={event.onContextMenu} onMouseDown={event.onMouseDown}
        style={{
          fill: "#9400D3",
          stroke: "#9400D3",
          strokeWidth: "1",
          opacity: "0.2",
          fillOpacity: "0.2"
        }}
      />
      <text x={x + Number(r)} y={y - Number(r)}
        style={{
          fill: "#9400D3",
          fontSize: "30"
        }}>{text}</text>
    </g>
  )
}

export default MainCircle;
