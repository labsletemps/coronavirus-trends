// The svg
var svg = d3.select("#europeMap"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var projection = d3.geoMercator()
    .center([15,48])                // GPS of location to zoom on
    .scale(700)                       // This is like the zoom
    .translate([ width/2, height/2 ])

Promise.all([d3.json("/data/europe.geojson"), d3.csv("/data/geo_tweets.csv")]).then(function(data) {
  dataGeo = data[0]
  data = data[1]

  // Create a color scale
  var allContinent = d3.map(data, function(d){return(d.tweets)}).keys()
  var color = d3.scaleOrdinal()
    .domain(allContinent)
    .range(d3.schemePaired);

  // Add a scale for bubble size
  var valueExtent = d3.extent(data, function(d) { return +d.tweets; })
  var size = d3.scaleSqrt()
    .domain(valueExtent)  // What's in the data
    .range([ 1, 10])  // Size in pixel

  // Draw the map
  svg.append("g")
      .selectAll("path")
      .data(dataGeo.features)
      .enter()
      .append("path")
        .attr("fill", "#b8b8b8")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
      .style("stroke", "none")
      .style("opacity", .3)

  // Add circles:
  svg
    .selectAll("myCircles")
    .data(data.sort(function(a,b) { return +b.tweets - +a.tweets }).filter(function(d,i){ return i<1000 }))
    .enter()
    .append("circle")
      .attr("cx", function(d){ return projection([+d.lon, +d.lat])[0] })
      .attr("cy", function(d){ return projection([+d.lon, +d.lat])[1] })
      .attr("r", function(d){ return size(+d.tweets) })
      .style("fill", function(d){ return color(d.tweets) })
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


  // --------------- //
  // ADD LEGEND //
  // --------------- //
  /*
  // Add legend: circles
  var valuesToShow = [100,4000,15000]
  var xCircle = 40
  var xLabel = 90
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("circle")
      .attr("cx", xCircle)
      .attr("cy", function(d){ return height - size(d) } )
      .attr("r", function(d){ return size(d) })
      .style("fill", "none")
      .attr("stroke", "black")

  // Add legend: segments
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("line")
      .attr('x1', function(d){ return xCircle + size(d) } )
      .attr('x2', xLabel)
      .attr('y1', function(d){ return height - size(d) } )
      .attr('y2', function(d){ return height - size(d) } )
      .attr('stroke', 'black')
      .style('stroke-dasharray', ('2,2'))

  // Add legend: labels
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("text")
      .attr('x', xLabel)
      .attr('y', function(d){ return height - size(d) } )
      .text( function(d){ return d } )
      .style("font-size", 10)
      .attr('alignment-baseline', 'middle')
  */
});
