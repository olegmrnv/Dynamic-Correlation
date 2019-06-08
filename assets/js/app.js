function makeResponsive() {


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

    var svgWidth = window.innerWidth - 300;
    var svgHeight = window.innerHeight - 140;

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
            .domain([d3.min(stateData, d => d.smokes)-1, d3.max(stateData, d => d.smokes)+1])
            .range([0, plot_width]);
        var yScale = d3.scaleLinear()
            .domain([d3.min(stateData, d => d.poverty)-1, d3.max(stateData, d => d.poverty)+1])
            .range([plot_height, 0]);

        var xAxis = d3.axisBottom(xScale).ticks(20);
        var yAxis = d3.axisLeft(yScale).ticks(20);

        chartGroup.append("g").call(yAxis);
        chartGroup.append("g").attr("transform", `translate(0, ${plot_height})`).call(xAxis)

        var circlesGroup = chartGroup.selectAll("circle")
            .data(stateData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.smokes))
            .attr("cy", d => yScale(d.poverty))
            .attr("r", "10")
            .attr("fill", "AliceBlue")
            .attr("stroke-width", "1")
            .attr("stroke", "black")
            .append("text")
            .attr("text", d=>d.abbr);


    })







}
makeResponsive();




d3.select(window).on("resize", makeResponsive);
