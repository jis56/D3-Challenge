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

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d=>newYScale(d[chosenYAxis]));
  return circlesGroup;
}
function renderTexts(txtGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  txtGroup.transition()
    .duration(1000)
    .attr("x", d=>newXScale(d[chosenXAxis]))
    .attr("y", d=>newYScale(d[chosenYAxis]))
  return txtGroup;
}

// function used for updating tooltip for circles group
function updateToolTip(chosenXaxis, chosenYaxis, circlesGroup){
  let xLabel = ""
  let yLabel = ""
  if (chosenXaxis === "poverty"){
    xLabel = "Poverty: ";
  }
  else if (chosenXaxis === "age"){
    xLabel = "Age: ";
  }
  else{
    xLabel = "Income: $";
  }
  if (chosenYaxis === "healthcare"){
    yLabel = "Healthcare: "
  }
  else if (chosenYaxis === "smokes"){
    yLabel = "Smokes: "
  }
  else{
    yLabel = "Obesity: "
  }
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d){
        if (chosenYaxis === "smokes" || chosenYaxis === "obesity") {
        if (chosenXaxis === "poverty"){
            return(`${d.state},${d.abbr}<br>${xLabel}${d[chosenXaxis]}%<br>${yLabel}${d[chosenYaxis]}%`)
        }
        return(`${d.state},${d.abbr}<br>${xLabel}${d[chosenXaxis]}<br>${yLabel}${d[chosenYaxis]}%`)
        }
        else if (chosenXaxis === "poverty"){
        return(`${d.state},${d.abbr}<br>${xLabel}${d[chosenXaxis]}%<br>${yLabel}${d[chosenYaxis]}`)
        }
        else{
        return(`${d.state},${d.abbr}<br>${xLabel}${d[chosenXaxis]}<br>${yLabel}${d[chosenYaxis]}`)
        }  
    })
  
  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", function(data){
    toolTip.show(data, this);
    d3.select(this).style("stroke", "black");
    
  })
  circlesGroup.on("mouseout", function(data, index){
    toolTip.hide(data, this)
    d3.select(this).style("stroke", "white");
  })
  return circlesGroup;
}

