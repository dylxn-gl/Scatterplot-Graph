// API
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

// Fetching de los datos
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    json = data;
    const dataset = json;

    //Creacion del svg
    const width = 1100;
    const height = 500;
    const padding = 60;

    const svg = d3
      .select(".visHolder")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    //Creacion de las Axes
    data.forEach(function (d) {
      d.Place = +d.Place;
      var parsedTime = d.Time.split(":");
      d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });

    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, function (d) {
          return d.Year - 1;
        }),
        d3.max(data, function (d) {
          return d.Year + 1;
        }),
      ])
      .range([padding, width - padding]);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    const Yscale = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return d.Time;
        })
      )
      .range([padding, height - padding]);
    const yAxis = d3.axisLeft(Yscale).tickFormat(d3.timeFormat("%M:%S"));

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("class", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    //Creacion del ToolTip
    const ToolTip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("background-color", "rgba(0,0,0,0.8)")
      .style("padding", "10px")
      .style("color", "#ffffff")
      .style("border-radius", "15px")
      .style("opacity", 0);

    //Creacion de los circulos
    const color = d3.scaleOrdinal(d3.schemeDark2);

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 6)
      .attr("cx", function (d) {
        return xScale(d.Year);
      })
      .attr("cy", function (d) {
        return Yscale(d.Time);
      })
      .attr("data-xvalue", function (d) {
        return d.Year;
      })
      .attr("data-yvalue", function (d) {
        return d.Time.toISOString();
      })
      .style("fill", function (d) {
        return color(d.Doping !== "");
      })
      .on("mouseover", function (event, d) {
        ToolTip.style("opacity", 0.9);
        ToolTip.attr("data-year", d.Year);
        ToolTip.html(
          d.Name +
            ": " +
            d.Nationality +
            "<br/>" +
            "Year: " +
            d.Year +
            ", Time: " +
            d3.timeFormat(d.Time) +
            (d.Doping ? "<br/><br/>" + d.Doping : "")
        )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + 10 + "px");
        console.log("movement");
      })
      .on("mouseout", function () {
        ToolTip.style("opacity", 0);
      });

    //Creacion de la legend
    const legendContainer = svg.append("g").attr("id", "legend");

    const legend = legendContainer
      .selectAll("#legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend-label")
      .attr("transform", function (d, i) {
        return "translate(0," + (height / 2 - i * 20) + ")";
      });

    legend
      .append("circle")
      .attr("cx", width - 10)
      .attr("cy", height * 0.02)
      .attr("r", 10)
      .style("fill", "transparent");

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("fill", "transparent")
      .text(function (d) {
        if (d) {
          return "Riders with doping allegations";
        } else {
          return "No doping allegations";
        }
      });
  });
