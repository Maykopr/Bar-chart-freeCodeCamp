
const margin = { top: 40, left: 40, right: 40, bottom: 40 };
const outWidth = 900;
const outHeight = 600;
const inWidth = outWidth - margin.left - margin.right;
const inHeight = outHeight - margin.top - margin.bottom;


// definição e tratamento dos dados
d3.json(
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then((data) => {
    const years = data.data.map((item) => item[0].substring(0, 4));
    const yearsDate = data.data.map(item => new Date(item[0]));
    const GDP = data.data.map((item) => item[1]);

    //defininção do container
    const container = d3
        .select("#canvas")
        .append("svg")
        .attr("width", outWidth)
        .attr("height", outHeight);


    container
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -300)
        .attr('y', 80)
        .text('Gross Domestic Product');


    // definição dos eixos e escalas
    const yLinearScale = d3
        .scaleLinear()
        .domain([0, d3.max(GDP)])
        .range([0, inHeight]);

    const scaledGDP = GDP.map((item) => yLinearScale(item));

    const xScale = d3
        .scaleTime()
        .domain([
            d3.min(yearsDate),
            d3.max(yearsDate)
        ])
        .range([0, inWidth]);

    const xAxis = d3.axisBottom(xScale);

    const yAxisScale = d3
        .scaleLinear()
        .domain([0, d3.max(GDP)])
        .rangeRound([inHeight, 0]);

    const yAxis = d3.axisLeft(yAxisScale);


    const tooltip = d3
        .select("#canvas")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

    const overlay = d3
        .select("#canvas")
        .append("div")
        .attr("class", "overlay")
        .style("opacity", 0);

    // montando o chart
    container
        .append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", `translate(${margin.left}, ${outHeight - margin.bottom})`);

    container
        .append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const svg = d3
        .select("svg")
        .append('g')
        .attr("class", "bars")
        .selectAll("rect")
        .data(scaledGDP)
        .enter()
        .append("rect")

    //update
    const barWidth = xScale(new Date(d3.max(years))) / years.length
    svg
        .attr("width", barWidth)
        .attr("height", (d) => d)
        .attr("x", (d, i) => xScale(yearsDate[i]))
        .attr("y", (d) => outHeight - margin.bottom - d)
        .attr("class", "bar")
        .attr("data-date", (d, i) => data.data[i][0])
        .attr("data-gdp", (d, i) => data.data[i][1])
        .attr("index", (d, i) => i)
        .attr("transform", `translate(${margin.left}, 0)`)
        .on("mouseover", function (event, d) {
            const i = this.getAttribute("index");

            overlay
                .transition()
                .duration(0)
                .style("opacity", 0.9)
                .style("height", d + "px")
                .style("width", barWidth + "px")
                .style("left", xScale(yearsDate[i]) + "px")
                .style("top", outHeight - margin.bottom - d + "px")
                .style("transform", `translateX(${margin.left}px)`);
            tooltip.transition().duration(0).style('opacity', 0.9);
            tooltip
                .text(
                    `${years[i]}
                    $${GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")}
                    Billion
                    `
                )
                .attr("data-date", data.data[i][0])
                .style("left", barWidth * i + "px")
                .style("top", outHeight / 2 + "px")
                .style("transform", `translateX(80px)`)
                .style("opacity", "0.9");
        })
        .on("mouseout", function () {
            tooltip.transition().duration(500).style('opacity', 0);
            overlay.transition().duration(500).style('opacity', 0);
        });
});
