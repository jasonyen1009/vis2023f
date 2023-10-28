// Set dimensions and margins for the chart
const margin = { top: 70, right: 60, bottom: 50, left: 80 };
const width = 1600 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

// Set up the x and y scales
const x = d3.scaleTime()
  .range([0, width]);

const y = d3.scaleLinear()
  .range([height, 0]);

// Create the SVG element and append it to the chart container
const svg = d3.select("#chart-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// create tooltip div

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");

// Create a second tooltip div for raw date

const tooltipRawDate = d3.select("body")
  .append("div")
  .attr("class", "tooltip");

// Create our gradient  

const gradient = svg.append("defs")
  .append("linearGradient")
  .attr("id", "gradient")
  .attr("x1", "0%")
  .attr("x2", "0%")
  .attr("y1", "0%")
  .attr("y2", "100%")
  .attr("spreadMethod", "pad");

gradient.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#85bb65")
  .attr("stop-opacity", 1);

gradient.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#85bb65")
  .attr("stop-opacity", 0);

// Load and process the data
d3.csv("../data.csv").then(data => {
  // Parse the Date and convert the Close to a number
  const parseDate = d3.timeParse("%Y-%m-%d");
  data.forEach(d => {
    d.Date = +d["序號"];
    d["作業一"] = +d["作業一"];
    d["作業二"] = +d["作業二"];
    d["作業三"] = +d["作業三"];
    d["作業四"] = +d["作業四"];
    d["作業五"] = +d["作業五"];
    d["作業六"] = +d["作業六"];
    d["作業七"] = +d["作業七"];
    d["作業八"] = +d["作業八"];
    d["作業九"] = +d["作業九"];
    d["作業十"] = +d["作業十"];
    d.Close = +d["作業一"] +d["作業二"] +d["作業三"] +d["作業四"] + d["作業五"] + d["作業六"] +d["作業七"] +d["作業八"] +d["作業九"] +d["作業十"];
    d.Name = d["學號"]; // 解析姓名数据
   
  });

  // Set the domains for the x and y scales
  x.domain(d3.extent(data, d => d.Date));
  y.domain([0, d3.max(data, d => d.Close)]);


  // 添加 x 軸
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
    .tickFormat(d3.format(".0f"))); // 設定 x 軸刻度標籤格式為整數

  svg.selectAll(".tick text")
    .attr("fill", "#777");

  // Add the y-axis
  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${width},0)`)
    .style("font-size", "14px")
    .call(d3.axisRight(y)
      .ticks(10)
      .tickFormat(d => {
        if (isNaN(d)) return "";
        return `${d.toFixed(2)}`;
      }))

  // Set up the line generator
  const line = d3.line()
    .x(d => x(d.Date))
    .y(d => y(d.Close));

  // Create an area generator
  const area = d3.area()
    .x(d => x(d.Date))
    .y0(height)
    .y1(d => y(d.Close));

  // Add the area path
  svg.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area)
    .style("fill", "url(#gradient)")
    .style("opacity", .5);

  // Add the line path
  const path = svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "#85bb65")
    .attr("stroke-width", 1)
    .attr("d", line);

  // Add a circle element

  const circle = svg.append("circle")
  .attr("r", 0)
  .attr("fill", "red")
  .style("stroke", "white")
  .attr("opacity", 0.7)
  .style("pointer-events", "none");

  // Add red lines extending from the circle to the date and value

  const tooltipLineX = svg.append("line")
  .attr("class", "tooltip-line")
  .attr("id", "tooltip-line-x")
  .attr("stroke", "red")
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", "2,2");

const tooltipLineY = svg.append("line")
  .attr("class", "tooltip-line")
  .attr("id", "tooltip-line-y")
  .attr("stroke", "red")
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", "2,2");

  // create a listening rectangle

  const listeningRect = svg.append("rect")
  .attr("width", width)
  .attr("height", height);


  // create the mouse move function

  listeningRect.on("mousemove", function (event) {
    const [xCoord] = d3.pointer(event, this);
    const bisectDate = d3.bisector(d => d.Date).left;
    const x0 = x.invert(xCoord);
    const i = bisectDate(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    const d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
    const xPos = x(d.Date);
    const yPos = y(d.Close);

  // UpDate the circle position

  circle.attr("cx", xPos).attr("cy", yPos);


  // Add transition for the circle radius

  circle.transition()
  .duration(50)
  .attr("r", 5);

  // Update the position of the red lines

  tooltipLineX.style("display", "block").attr("x1", xPos).attr("x2", xPos).attr("y1", 0).attr("y2", height);
  tooltipLineY.style("display", "block").attr("y1", yPos).attr("y2", yPos).attr("x1", 0).attr("x2", width);


  // add in our tooltip

  tooltip
  .style("display", "block")
  .style("left", `${width + 90}px`)
  .style("top", `${yPos + 68}px`)
  .html(`作業總成績：${d.Close !== undefined ? d.Close.toFixed(0) : 'N/A'}`);

  
  tooltipRawDate
  .style("display", "block")
  .style("left", `${xPos + 60}px`)
  .style("top", `${height + 53}px`)
  // .html(`${d.Date !== undefined ? d.Date : 'N/A'}`);
  .html(`<b>學號 : </b> ${d.Name || 'N/A'}<br><b>序號 : </b> ${d.Date !== undefined ? d.Date : 'N/A'}`);


});

  // listening rectangle mouse leave function
  listeningRect.on("mouseleave", function () {
    circle.transition().duration(50).attr("r", 0);
    tooltip.style("display", "none");
    tooltipRawDate.style("display", "none");
    tooltipLineX.attr("x1", 0).attr("x2", 0);
    tooltipLineY.attr("y1", 0).attr("y2", 0);
    tooltipLineX.style("display", "none");
    tooltipLineY.style("display", "none");
  });

  // Add the chart title

  svg.append("text")
  .attr("class", "chart-title")
  .attr("x", margin.left - 115)
  .attr("y", margin.top - 100)
  .style("font-size", "20px")
  .style("font-weight", "bold")
  .style("font-family", "sans-serif")
  .text("Line Chart 成績表");


});

// src: https://github.com/datavizdad/d3areachartseries/tree/main