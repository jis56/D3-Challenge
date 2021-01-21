var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

// Calculate chart width and height
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Initial params
var chosenXaxis = "poverty";
var chosenYaxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(csvData, chosenXAxis) {
    // create scales
    let xLinearScale = d3.scaleLinear()
      .domain([d3.min(csvData, d => d[chosenXAxis]) * 0.9,
        d3.max(csvData, d => d[chosenXAxis]) * 1.1
      ])
      .range([0, width]);
  
    return xLinearScale;
  }
  
// function used for updating y-scale var upon click on axis label
function yScale(csvData, chosenYAxis) {
    // create scales
    let yLinearScale = d3.scaleLinear()
      .domain([d3.min(csvData, d => d[chosenYAxis]) - 1,
        d3.max(csvData, d => d[chosenYAxis]) + 1
      ])
      .range([height, 0]);
  
    return yLinearScale;
  }

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  // function used for updating yAxis const upon click on axis label
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

