//Set plot area

console.log("app.js loaded")

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create SVG wrapper

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXAxis = "poverty";

var chosenYAxis = "obesity";


// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
      d3.max(data, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}


// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
// function used for updating yAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}



// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, chosenXAxis, xLinearScale, chosenYAxis, yLinearScale) {

  circlesGroup.transition()
    .duration(1000)
    .attr("transform", function(d) {
      d.x = xLinearScale(d[chosenXAxis]),
      d.y = yLinearScale(d[chosenYAxis])
      return "translate(" + d.x + "," + d.y + ")";
    });
  
  console.log(chosenXAxis);
  console.log(chosenYAxis)

  return circlesGroup;
}
  

// function renderLabelsX(textLabels, newXScale, chosenXAxis) {

//   textLabels.transition()
//     .duration(1000)
//     .attr("x", d => newXScale(d[chosenXAxis]))

//   return textLabels;
// }

// function renderCirclesY(circlesGroup, chosenYAxis) {

//   circlesGroup.transition()
//     .duration(1000)
//     .attr("transform", function(d) {
//       d.x = xLinearScale(d[chosenXAxis]),
//       d.y = yLinearScale(d[chosenYAxis])
//       return "translate(" + d.x + "," + d.y + ")";
//     });

//   return circlesGroup;
// }


// function renderLabelsY(textLabels, newYScale, chosenYAxis) {

//   textLabels.transition()
//     .duration(1000)
//     .attr("y", d => newYScale(d[chosenYAxis]))

//   return textLabels;
// }


// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//   var label;

//   if (chosenXAxis === "poverty") {
//     label = "In Poverty (%)";
//   }
//   else if (chosenXAxis === "age") {
//     label = "Age (Median)";
//   }chartGroup
//   else {
//       label = "Household Income (Median)"
//   }

//   var toolTip = d3.tip()
//     .attr("class", "d3-tip")
//     .offset([0, -20])
//     .html(function(d) {
//       return (`${d.abbr}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data, this);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data, this);
//     });

//   return circlesGroup;
// }


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;
    
    // parse data
    data.forEach(function(d) {
      d.obesity = +d.obesity;
      d.smokes = +d.smokes;
      d.healthcare = +d.healthcare;
      d.poverty = +d.poverty;
      d.age = +d.age;
      d.income = +d.income;
    });

 // xLinearScale function above csv import
 var xLinearScale = xScale(data, chosenXAxis);

 // Create y scale function
 var yLinearScale = yScale(data, chosenYAxis);

 // Create initial axis functions
 var bottomAxis = d3.axisBottom(xLinearScale);
 var leftAxis = d3.axisLeft(yLinearScale);

 // append x axis
 var xAxis = chartGroup.append("g")
   .classed("x-axis", true)
   .attr("transform", `translate(0, ${height})`)
   .call(bottomAxis);

 // append y axis
 var yAxis = chartGroup.append("g")
   .classed("y-axis", true)
   .call(leftAxis);

 // append initial circles
 var circlesGroup = chartGroup.append("g")
   .attr("class", "nodes")
   .selectAll("circle")
   .data(data)
   .enter()
   .append("g")
   .attr("transform", function(d) {
     d.x = xLinearScale(d[chosenXAxis]),
     d.y = yLinearScale(d[chosenYAxis])
     return "translate(" + d.x + "," + d.y + ")";
   });

 circlesGroup.append("circle")
   .attr("r", 10)
   .attr("fill", "teal")
   .attr("opacity", ".5");
  
 circlesGroup.append("text")
   .attr("text-anchor", "middle")
   .attr("class", "state")
   .text(d => d.abbr);
  
  console.log(circlesGroup);
  console.log(chosenXAxis);
  console.log(chosenYAxis)  

 // Create group for three x-axis labels
 var labelsGroupX = chartGroup.append("g")
   .attr("transform", `translate(${width / 2}, ${height + 20})`);

 var povertyLabel = labelsGroupX.append("text")
   .attr("x", 0)
   .attr("y", 20)
   .attr("value", "poverty") // value to grab for event listener
   .classed("active", true)
   .text("In Poverty (%)");

 var ageLabel = labelsGroupX.append("text")
   .attr("x", 0)
   .attr("y", 40)
   .attr("value", "age") // value to grab for event listener
   .classed("inactive", true)
   .text("Age (Median)");

var incomeLabel = labelsGroupX.append("text")
   .attr("x", 0)
   .attr("y", 60)
   .attr("value", "income") // value to grab for event listener
   .classed("inactive", true)
   .text("Household Income (Median)");


// Create group for three y-axis labels
var labelsGroupY = chartGroup.append("g")
  .attr("transform", "rotate(-90)")

var obesityLabel = labelsGroupY.append("text")
  .attr("y", 60 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("value", "obesity") // value to grab for event listener
  .classed("active", true)
  .text("Obese (%)");

var smokesLabel = labelsGroupY.append("text")
  .attr("y", 20 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("value", "smokes") // value to grab for event listener
  .classed("inactive", true)
  .text("Smokes (%)");

var healthcareLabel = labelsGroupY.append("text")
   .attr("y", 40 - margin.left)
   .attr("x", 0 - (height / 2))
   .attr("value", "healthcare") // value to grab for event listener
   .classed("inactive", true)
   .text("Lacks Health Insurance (%)");

 // updateToolTip function above csv import
//  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//  var textLabels = updateToolTip(chosenXAxis, textLabels);

 // x axis labels event listener
 labelsGroupX.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== chosenXAxis) {

       // replaces chosenXAxis with value
       chosenXAxis = value;

       chosenYAxis = chosenYAxis;

       // console.log(chosenXAxis)

       // functions here found above csv import
       // updates x scale for new data
       xLinearScale = xScale(data, chosenXAxis);

       // updates x axis with transition
       xAxis = renderAxesX(xLinearScale, xAxis);

       // updates circles with new x values
       circlesGroup = renderCircles(circlesGroup, chosenXAxis, xLinearScale, chosenYAxis, yLinearScale);

      //  // updates text labels with new x values
      //  textLabels = renderLabelsX(textLabels, xLinearScale, chosenXAxis);

      //  // updates tooltips with new info
      //  circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      //  changes classes to change bold text
       if (chosenXAxis === "age") {
        ageLabel
           .classed("active", true)
           .classed("inactive", false);
        povertyLabel
           .classed("active", false)
           .classed("inactive", true);
        incomeLabel
           .classed("active", false)
           .classed("inactive", true);
       }

       else if (chosenXAxis === "income") {
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
      }

       else {
        povertyLabel
           .classed("active", true)
           .classed("inactive", false);
        incomeLabel
           .classed("active", false)
           .classed("inactive", true);
        ageLabel
           .classed("active", false)
           .classed("inactive", true);
       }
     }
    })

 // y axis labels event listener
 labelsGroupY.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== chosenYAxis) {

       // replaces chosenYAxis with value
       chosenYAxis = value;

       chosenXAxis = chosenXAxis;

       // console.log(chosenYAxis)

       // functions here found above csv import
       // updates y scale for new data
       yLinearScale = yScale(data, chosenYAxis);

       // updates x axis with transition
       yAxis = renderAxesY(yLinearScale, yAxis);

       // updates circles with new values
       circlesGroup = renderCircles(circlesGroup, chosenXAxis, xLinearScale, chosenYAxis, yLinearScale);

      //  // updates text labels with new values
      //  textLabels = renderLabelsY(textLabels, yLinearScale, chosenYAxis);

      //  // updates tooltips with new info
      //  circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

       // changes classes to change bold text
       if (chosenYAxis === "obesity") {
        obesityLabel
           .classed("active", true)
           .classed("inactive", false);
        smokesLabel
           .classed("active", false)
           .classed("inactive", true);
        healthcareLabel
           .classed("active", false)
           .classed("inactive", true);
       }

       else if (chosenYAxis === "smokes") {
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }

       else {
        healthcareLabel
           .classed("active", true)
           .classed("inactive", false);
        obesityLabel
           .classed("active", false)
           .classed("inactive", true);
        smokesLabel
           .classed("active", false)
           .classed("inactive", true);
       }
     }
   });

}).catch(function(error) {
 console.log(error);
});
