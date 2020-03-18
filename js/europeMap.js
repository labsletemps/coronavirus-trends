// The svg
var svg = d3.select("#europeMap"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection/Zoom
var projection = d3.geoMercator()
    .center([15,48])                
    .scale(700)                       
    .translate([ width/2, height/2 ])


Promise.all([d3.json("/data/world_countries.json"), d3.csv("/data/geo_tweets.csv"), d3.csv("/data/coronavirus.csv")]).then(function(data) {

  var dataGeo = data[0];
  var dataTweets = data[1];
  var dataCorona = data[2];

  // Color scales
  var colorScaleCorona = d3.scaleLinear().domain([0,1000])
    .range(["#b8b8b8", "red"]);
  var colorScaleTweets = d3.scaleLinear().domain([0,10000])
    .range(["#b8b8b8", "blue"]);

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(dataGeo.features)
    .enter()
    .append("path")
    .attr("fill", function (d) {
    return colorScaleCorona(0);
    })
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
    .exit()
    .transition().duration(200)
    .attr("r",1)
    .remove();

  // Update the map
  var displayMap = function(data, test){
    svg.selectAll("path").attr("fill", function (d) {
      d.total = data.get(d.properties.name) || 0;
        return colorScaleCorona(d.total);
      })
      .attr("d", d3.geoPath()
      .projection(projection))
  }
  
   // Add a scale for bubble size
  var valueExtent = d3.extent(dataTweets, function(d) { return +d.count; })
  var size = d3.scaleSqrt()
    .domain(valueExtent)  
    .range([ 1, 50])  // Size in pixel

  // Add circles:
  var displayCircles = function(data) {
    svg.selectAll(".tweets")
      .data(data.sort(function(a,b) { return +b.count - +a.count }).filter(function(d,i){ return i<1000 }))
      .enter().append("circle")
        .attr("cx", function(d){ return projection([+d.lon, +d.lat])[0] })
        .attr("cy", function(d){ return projection([+d.lon, +d.lat])[1] })
        .attr("r", 1)
          .transition().duration(400)
          .attr("r", function(d){ return size(+d.count)})
        .style("fill", function(d){ return colorScaleTweets(d.count) })
        .attr("stroke", function(d){ if(d.count>20){return "black"}else{return "none"}  })
        .attr("stroke-width", 1)
        .attr("fill-opacity", .4);      
  };

  /* SLIDER */

  var formatDateIntoDay = d3.timeFormat("%d/%m");
  var formatDate = d3.timeFormat("%b %Y");
  var parseDate = d3.timeFormat("%Y-%m-%d");

  var startDate = new Date("2020-02-22"),
      endDate = new Date("2020-03-10");

  var moving = false;
  var currentValue = 0;
  var targetValue = width - 80;

  var playButton = d3.select("#play-button");

  var x = d3.scaleTime()
      .domain([startDate, endDate])
      .range([0, targetValue])
      .clamp(true);
 
  var slider = d3.select("#sliderEuropeMap")
      .append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + 50 + "," + 50 + ")");

  slider.append("line")
      .attr("class", "track")
      .attr("x1", x.range()[0])
      .attr("x2", x.range()[1])
      .call(d3.drag()
          .on("start.interrupt", function() { slider.interrupt(); })
          .on("start drag", function() {
            currentValue = d3.event.x;
            update(x.invert(currentValue)); 
          })
      )
      .attr("class", "track-inset");
      
  slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
      .data(x.ticks(4))
      .enter()
      .append("text")
      .attr("x", x)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .text(function(d) { return formatDate(d); });

  var handle = slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9);

  var label = slider.append("text")  
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .text(formatDateIntoDay(startDate))
      .attr("transform", "translate(0," + (-25) + ")")

  
  playButton
    .on("click", function() {
      var button = d3.select(this);
      if (button.text() == "Pause") {
        moving = false;
        clearInterval(timer);
        button.text("Play");
      } else {
        moving = true;
        timer = setInterval(step, 10);
        button.text("Pause");
      }
      console.log("Slider moving: " + moving);
  });
    
  function step() {
    update(x.invert(currentValue));
    currentValue = currentValue + (targetValue/151);
    if (currentValue > targetValue) {
      moving = false;
      currentValue = 0;
      clearInterval(timer);
      playButton.text("Play");
    }
  }

  function update(h) {
    // update position and text of label according to slider scale
    handle.attr("cx", x(h));
    label
      .attr("x", x(h))
      .text(formatDateIntoDay(h));

     // filter data set and draw map and bubbles
      var newDataTweets = dataTweets.filter(function(d) {
        return d.date == parseDate(h);
      })

      var newDataCorona = dataCorona.filter(function(d) {
        return d.date == parseDate(h);
      })
     var dataMap = {};
      newDataCorona.forEach(function(d){
        dataMap[d.country] = d.Confirmed;
      });

    displayMap(d3.map(dataMap));
    displayCircles(newDataTweets);
  }

  update(startDate);
});
