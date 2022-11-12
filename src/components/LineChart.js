import { useEffect, useContext, useRef } from "react";
import * as d3 from "d3";
import { GraphContext } from "../GraphContext";

const Chart = () => {
  //  Setup Initial data and settings
  const width = 500;
  const height = 300;
  const padding = 40;

  const svgRef = useRef();
  const xAxisRef = useRef();
  const yAxisRef = useRef();

  const dataGraph = useContext(GraphContext).dataGraph;

  useEffect(() => {
    const t = d3.transition().duration(1000);
    // Setup functions for Scales
    //xscales
    const xDomain = dataGraph.cumul ? dataGraph.cumul.map((d) => d.date) : [];
    const xScale = d3
      .scalePoint()
      .domain(xDomain)
      .range([0 + padding, width - padding]);

    //Yscales
    const yDomain = dataGraph.cumul
      ? [
          d3.min(dataGraph.cumul, function (d) {
            return d.value;
          }),
          d3.max(dataGraph.cumul, function (d) {
            return d.value;
          }),
        ]
      : [];
    const yScale = d3
      .scaleLinear()
      .domain(yDomain)
      .range([height - padding, 0 + padding]);

    // Setup functions to draw Lines 
    const line = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Draw line
    if (dataGraph.cumul) {
      d3.select(svgRef.current)
        .select("path")
        .attr("d", (value) => line(dataGraph.cumul))
        .attr("fill", "none")
        .attr("stroke", "black");
    }

    // Setup functions to draw X and Y Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Draw x and y Axes
    d3.select(xAxisRef.current).transition(t).call(xAxis);
    d3.select(yAxisRef.current).transition(t).call(yAxis);
  }, [dataGraph]);

  return (
    <svg id="chart" ref={svgRef} viewBox={`0 0 ${width} ${height}`}>
      <path d="" fill="none" stroke="black" strokeWidth="1" />
      <g ref={xAxisRef} transform={`translate(0,${height - padding})`} />
      <g ref={yAxisRef} transform={`translate(${padding},0)`} />
    </svg>
  );
};

export default Chart;
