// The svg
var svg = d3.select("#europeMap"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var projection = d3.geoMercator()
    .center([15,48])                // GPS of location to zoom on
    .scale(700)                       // This is like the zoom
    .translate([ width/2, height/2 ])

// Data and color scale
var colorScale = d3.scaleLinear().domain([0,20000])
  .range(["#b8b8b8", "red"]);

Promise.all([d3.json("/data/world_countries.json"), d3.csv("/data/geo_tweets.csv")]).then(function(data) {
  var dataGeo = data[0];
  var dataTweets = data[1];
  var dataMap = {};
  dataTweets.forEach(function(d){
    dataMap[d.iso_code] = d.tweets;
  });
  var dataMap = d3.map(dataMap)

  // Add a scale for bubble size
  var valueExtent = d3.extent(dataTweets, function(d) { return +d.tweets; })
  var size = d3.scaleSqrt()
    .domain(valueExtent)  // What's in the data
    .range([ 1, 10])  // Size in pixel

  // Draw the map
  svg.append("g")
      .selectAll("path")
      .data(dataGeo.features)
      .enter()
      .append("path")
        .attr("fill", function (d) {
        d.total = dataMap.get(d.id) || 0;
        return colorScale(d.total);
        })//, "#b8b8b8")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
      .style("stroke", "None")
        .on('mouseover', function(d) {
          d3.select(this).style('stroke', 'black');
        }).on('mouseout', function(d) {
          d3.select(this).style('stroke', 'None');
        })
      .style("opacity", .3)

  // Add circles:
  svg
    .selectAll("myCircles")
    .data(dataTweets.sort(function(a,b) { return +b.tweets - +a.tweets }).filter(function(d,i){ return i<1000 }))
    .enter()
    .append("circle")
      .attr("cx", function(d){ return projection([+d.lon, +d.lat])[0] })
      .attr("cy", function(d){ return projection([+d.lon, +d.lat])[1] })
      .attr("r", function(d){ return size(+d.tweets) })
      .style("fill", function(d){ return colorScale(d.tweets) })
      .attr("stroke", function(d){ if(d.tweets>20000){return "black"}else{return "none"}  })
      .attr("stroke-width", 1)
      .attr("fill-opacity", .4)



  // Add title and explanation
  svg
    .append("text")
      .attr("text-anchor", "end")
      .style("fill", "black")
      .attr("x", width - 10)
      .attr("y", height - 30)
      .attr("width", 90)
      //.html("WHERE SURFERS LIVE")
      .style("font-size", 14)

});
