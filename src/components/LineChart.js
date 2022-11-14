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
    //X scales
    const xDomain = dataGraph.cumul ? dataGraph.cumul.map((d) => d.date) : [];
    const xScale = d3
      .scalePoint()
      .domain(xDomain)
      .range([0 + padding, width - padding]);

    //Y scales
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
      .curve(d3.curveLinear);

    // Setup functions to draw X and Y Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Draw x and y Axes
    d3.select(xAxisRef.current).transition(t).call(xAxis);
    d3.select(yAxisRef.current).transition(t).call(yAxis);

    // Draw line
    if (dataGraph.cumul) {
      d3.select(svgRef.current)
        .select("path")
        .attr("opacity", "1")
        .attr("d", (value) => line(dataGraph.cumul))
        .attr("fill", "none")
        .attr("stroke", "black");

      d3.select(svgRef.current).selectAll(".points").remove();
      // Add points
      d3.select(svgRef.current)
        .append("g")
        .attr('class', 'points')
        .selectAll("dot")
        .data(dataGraph.cumul)
        .enter()
        .append("circle")
        .attr("class", "myCircle")
        .attr("cx", function (d) {
          return xScale(d.date);
        })
        .attr("cy", function (d) {
          return yScale(d.value);
        })
        .attr("r", 4)
        .attr("fill", "#69b3a2")
        //add tooltip on mouse over
        .on("mouseover", (event, d) => {
          const x =
            event.target === event.target.parentElement.firstChild
              ? d3.pointer(event)[0] + 2
              : d3.pointer(event)[0] - 30;
          d3.select(event.target.parentElement)
            .append("text")
            .attr("class", `tooltip`)
            .attr("font-size", "10px")
            .attr("x", x)
            .attr("y", d3.pointer(event)[1] - 7)
            .attr("text-anchor", "start")
            .text(`Ventes: ${d.value}`);
        })
        .on("mouseleave", () => d3.select(".tooltip").remove());
    } else {
      d3.select(".line").attr("opacity", "0");
      d3.selectAll(".points").remove();
    }
  }, [dataGraph]);

  return (
    <svg id="chart" ref={svgRef} viewBox={`0 0 ${width} ${height}`}>
      <path class="line" d="" fill="none" stroke="black" strokeWidth="1" />
      <g ref={xAxisRef} transform={`translate(0,${height - padding})`} />
      <g ref={yAxisRef} transform={`translate(${padding},0)`} />
    </svg>
  );
};

export default Chart;
