


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
    bottom: 50,
    right: 50,
    left: 50
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


d3.csv("assets/data/data.csv").then(function (stateData) {
    stateData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
    });

    var xScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d.smokes) - 2, d3.max(stateData, d => d.smokes) + 2])
        .range([0, plot_width]);
    var yScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d.poverty) - 2, d3.max(stateData, d => d.poverty) + 2])
        .range([plot_height, 0]);

    var xAxis = d3.axisBottom(xScale).ticks(20);
    var yAxis = d3.axisLeft(yScale).ticks(20);

    chartGroup.append("g").call(yAxis);
    chartGroup.append("g").attr("transform", `translate(0, ${plot_height})`).call(xAxis)

    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xScale(d.smokes))
        .attr("cy", -100)
        .transition()
        .duration(1500)
        .attr("cy", d => yScale(d.poverty))
        .attr("r", "15");

    var tickGroup = chartGroup.selectAll()
        .data(stateData)
        .enter()
        .append("text")
        .attr("x", d => (xScale(d.smokes)) - 10)
        .attr("y", -100)
        .attr("font-size", "14px")
        .text(d => d.abbr)
        .transition()
        .duration(1500)
        .attr("y", d => (yScale(d.poverty)) + 6);

    svg.append("text")
        .attr("transform", `translate(${svgWidth / 2}, ${svgHeight})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "26px")
        .attr("fill", "black")
        .text("Smokes (%)");

    svg.append("text")        
        .attr("transform",  "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", "26px")
        .attr("fill", "black")
        .attr("y", 20)
        .attr("x", - (svgHeight / 2) )
        .text("Poverty (%)");
})

