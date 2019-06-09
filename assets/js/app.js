
var divArea = d3.select(".article");

if (!divArea.empty()) {
    divArea.remove();
}

var svgArea = d3.select("#scatter").select("svg");

if (!svgArea.empty()) {
    svgArea.remove();
}

var margin = {
    top: 50,
    bottom: 100,
    right: 50,
    left: 100
};

var svgWidth = 1000;
var svgHeight = 600;

var plot_height = svgHeight - margin.top - margin.bottom;
var plot_width = svgWidth - margin.left - margin.right;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "smokes";
var chosenYAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, plot_width]);

    return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(stateData, chosenYAxis) {

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
        d3.max(stateData, d => d[chosenYAxis]) * 1.2
        ])
        .range([plot_height, 0]);

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



// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to X
// new circles
function renderCirclesX(circlesGroup, newXScale, chosenXaxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXaxis]));

    return circlesGroup;
}

// function used for updating circles group with a transition to Y
// new circles
function renderCirclesY(circlesGroup, newYScale, chosenYaxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYaxis]));

    return circlesGroup;
}

//--------------------------------------------------------------------------------
// function used for updating abbriviation group with a transition to X

function renderAbbrX(AbbrGroup, newXScale, chosenXaxis) {

    AbbrGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXaxis]));

    return AbbrGroup;
}

// function used for updating abbriviation group with a transition to Y

function renderAbbrY(AbbrGroup, newYScale, chosenYaxis) {

    AbbrGroup.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYaxis]) + 5);

    return AbbrGroup;
}

//================================================================================

// ToolTip

//================================================================================

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYaxis, circlesGroup) {

    if (chosenXAxis === "smokes") {
        var labelx = "Smokers (%): ";
    }
    else if (chosenXAxis === "obesity") {
        var labelx = "Obesity (%): ";
    }
    else if (chosenXAxis === "healthcare") {
        var labelx = "Lacks Healthcare (%): ";
    }

    if (chosenYaxis === "poverty") {
        var labely = "In Poverty (%): ";
    }
    else if (chosenYaxis === "age") {
        var labely = "Age (Median): ";
    }
    else if (chosenYaxis === "income") {
        var labely = "Household Income (Median): ";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>${labelx} ${d[chosenXAxis]}<br>${labely} ${d[chosenYAxis]}`);
        });

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}



//===============================================================================



d3.csv("assets/data/data.csv").then(function (stateData) {
    stateData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.healthcare = +data.healthcare;
    });



    var xLinearScale = xScale(stateData, chosenXAxis);
    var yLinearScale = yScale(stateData, chosenYAxis);



    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${plot_height})`)
        .call(bottomAxis);


    var yAxis = chartGroup.append("g")
        .call(leftAxis);



    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "15");

    var AbbrGroup = chartGroup.selectAll()
        .data(stateData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]) + 5)
        .attr("font-size", "14px")
        .text(d => d.abbr)


    // Create group for  3 x- axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${plot_width / 2}, ${plot_height + 20})`);


    var somokesLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "smokes") // value to grab for event listener
        .classed("active", true)
        .text("Smokers (%)");

    var obesityLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity (%)");

    var healthcareLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");








    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${-7 - margin.left}, ${(plot_height / 2)}) rotate(-90)`)
        .attr("dy", "1em")

    var powertyLabel = ylabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = ylabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = ylabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");


        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


    xlabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(stateData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);
                AbbrGroup = renderAbbrX(AbbrGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text 

                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                if (chosenXAxis == "smokes") {
                    somokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis == "obesity") {
                    somokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis == "healthcare") {
                    somokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

    ylabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // replaces chosenXAxis with value
                chosenYAxis = value;

                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yScale(stateData, chosenYAxis);

                // updates x axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);

                // updates circles with new x values
                circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);
                AbbrGroup = renderAbbrY(AbbrGroup, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text

                if (chosenYAxis == "poverty") {
                    powertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis == "age") {
                    powertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis == "income") {
                    powertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });



});

