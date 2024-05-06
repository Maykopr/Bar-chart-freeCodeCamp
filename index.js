// definição e tratamento dos dados
d3.json(
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then((data) => {
    const years = data.data.map((item) => item[0].substring(0, 4));
    const GDP = data.data.map((item) => item[1]);

    const width = 700;
    const height = 500;
    const padding = 40;
    const margin = { top: 30, left: 30, right: 30, bottom: 30 };

    //defininção do container
    const container = d3
        .select("#canvas")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // definição dos eixos e escalas
    const linearScale = d3
        .scaleLinear()
        .domain([0, d3.max(GDP)])
        .range([0, height]);
    const xScale = d3
        .scaleTime()
        .domain([
            new Date(d3.min(years)),
            new Date((parseInt(d3.max(years)) + 20).toString())
        ])
        .range([0, width]);

    const xAxis = d3.axisBottom(xScale);
    const yAxisScale = d3
        .scaleLinear()
        .domain([0, d3.max(GDP)])
        .range([height, 0]);
    const yAxis = d3.axisLeft(yAxisScale);

    const scaledGDP = GDP.map((item) => linearScale(item));

    const tooltip = d3
        .select(".visHolder")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

    const overlay = d3
        .select(".visHolder")
        .append("div")
        .attr("class", "overlay")
        .style("opacity", 0);

    // montando o chart
    container
        .append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`);

    container
        .append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`);

    const svg = d3
        .select("svg")
        .selectAll("rect")
        .data(scaledGDP)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 2)
        .attr("y", (d) => height - d)
        .attr("width", width / 275)
        .attr("height", (d) => d)
        .attr("class", "bar")
        .attr("data-date", (d, i) => data.data[i][0])
        .attr("data-gdp", (d, i) => data.data[i][1])
        .attr("index", (d, i) => i)
        .attr("transform", "translate(60, 0)")
        .on("mouseover", (event, d) => {
            const i = this.getAttribute("index");
            // edita dinamincamente a aparencia do card de info
            overlay
                .transition()
                .duration(0)
                .style("height", d + "px")
                .style("width", width / 270 + "px")
                .style("opacity", 0.9)
                .style("left", (i * width) / 270 + 0 + "px")
                .style("top", height - d + "px")
                .style("transform", "translateX(60px)");
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
                .html(
                    years[i] +
                    "<br>" +
                    "$" +
                    GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
                    " Billion"
                )
                .attr("data-date", data.data[i][0])
                .style("left", (i * width) / 270 + 30 + "px")
                .style("top", height - 100 + "px")
                .style("transform", "translateX(60px)");
        })
        .on("mouseout", () => {
            // desaparece o card
            tooltip.transition().duration(200).style("opacity", 0);
            overlay.transition().duration(200).style("opacity", 0);
        });
});
