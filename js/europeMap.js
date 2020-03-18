/*
 * Bubble Map
 * Implementation based on official template from https://www.d3-graph-gallery.com/graph/bubblemap_template.html,  Yan Holtz
*/

// The svg
 var svg = d3.select("#map")
   // Container class to make it responsive.
   .classed("svg-container", true)
   .append("svg")
   // Responsive SVG needs these 2 attributes and no width and height attr.
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 1000 500")
   // Class to make it responsive.
   .classed("svg-content-responsive", true)
   // Fill with a rectangle for visualization.
   .append("g")
   .attr("width", 1000)
   .attr("height", 500);

width = svg.attr('width');
height = svg.attr('height');

// Map and projection/Zoom
var projection = d3.geoMercator()
    .center([10,48])
    .scale(1000)
    .translate([ width/2, height/2 ])

Promise.all([d3.json("data/world_countries.json"), d3.csv("data/geo_tweets_by_week.csv"), d3.csv("data/coronavirus_2020-03-18.csv")]).then(function(data) {
  var dataGeo = data[0];
  var dataTweets = data[1];
  var dataCorona = data[2];

  var formatDateIntoDay = d3.timeFormat("%d/%m");
  var formatDate = d3.timeFormat("%b %Y");
  var parseDate = d3.timeFormat("%Y-%m-%d");

  var startDate = new Date("2020-02-24"),
      endDate = new Date("2020-03-15");

  var currentDate = startDate;

  var currentCountry = null;

  // filter data set
  var newDataTweets = dataTweets.filter(function(d) {
    return d.date == parseDate(startDate);
  })

  var newDataCorona = dataCorona.filter(function(d) {
    return d.date == parseDate(startDate);
  })

 console.log(newDataCorona)
 var dataMap = {};
  newDataCorona.forEach(function(d){
    dataMap[d['alpha-3']] = {}
    dataMap[d['alpha-3']]['Date'] = d.date;
    dataMap[d['alpha-3']]['Confirmed'] = d.cumsum_cases;
    dataMap[d['alpha-3']]['Name'] = d.country;
    dataMap[d['alpha-3']]['Deaths'] = d.cumsum_deaths;
  });
  dataMap = d3.map(dataMap)

  // Color scales
  var colorScaleCorona = d3.scaleLinear().domain([0,500])
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
    .style("stroke", "white")
    .style("stroke-width", "2px")
    .on('mouseover', function(d) {
      d3.select(this).style('stroke', 'black');
      d3.event.preventDefault();
      displayDetail(d);
    }).on('mouseout', function(d) {
      d3.select(this).style('stroke', 'white');
    }).on("click", function(d) {
      displayDetail(d);
    })
    .style("opacity", .5)
    .exit()
    .transition().duration(200)
    .attr("r",1)
    .remove();

  function displayDetail(d) {
    currentCountry = d;
    d3.select(".map-details")
    .html(function() {
      var location = d.properties.name;
      var infos = d3.map(dataMap.get(d.id)) || d3.map();
      return `<h4>${location}</h4>
        <p><span class="stats">Cas confirmés cumulés</span> ${infos.get('Confirmed') || 0  }</p>
        <p><span class="stats">Décès</span> ${infos.get('Deaths') || 0  }</p>
        <p><span class="stats">Date</span> ${parseDate(currentDate)}</p>
      `;})
      .style('opacity', 1);
    }

  // Update the map
  var displayMap = function(data){
    svg.selectAll("path").attr("fill", function (d) {
      var infos = d3.map(data.get(d.id));
      d.total = infos.get('Confirmed') || 0;
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
    svg.selectAll(".circles").remove();

    svg.selectAll(".circles")
      .data(data.sort(function(a,b) { return +b.count - +a.count }).filter(function(d,i){ return i<1000 }))
      .enter()
        .append("g")
          .attr("class", "circles")

        .append("circle")
          .attr("class", "circles")
          .attr("cx", function(d){ return projection([+d.lon, +d.lat])[0] })
          .attr("cy", function(d){ return projection([+d.lon, +d.lat])[1] })
          .attr("r", 1)
            .transition().duration(20)
            .attr("r", function(d){ return size(+d.count)})
        .style("fill", function(d){ return colorScaleTweets(d.count) })
          .attr("stroke", function(d){ if(d.count>20){return "black"}else{return "none"}  })
          .attr("stroke-width", 1)
          .attr("fill-opacity", 0.4);
  };

  /* SLIDER */
  var moving = false;
  var currentValue = 0;
  var targetValue = 4;
  var width_slider = width - 80;

  var playButton = d3.select("#play-button").style('top', '20%');

  var x = d3.scaleTime()
      .domain([startDate, endDate])
      .range([0, targetValue])
      .clamp(true);

  var slider = d3.select("#sliderEuropeMap")
   // Container class to make it responsive.
   .classed("svg-container", true)
   .append("svg")
   // Responsive SVG needs these 2 attributes and no width and height attr.
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 "+width+" 100")
   // Class to make it responsive.
   .classed("svg-content-responsive", true)
   // Fill with a rectangle for visualization.
   .append("g")
   .attr("width", width)
   .attr("height", 150)
   .attr("class", "slider")
    .attr("transform", "translate(" + 50 + "," + 100/2 + ")");


  slider.append("line")
      .attr("class", "track")
      .attr("x1", 0)
      .attr("x2", width_slider)
      .call(d3.drag()
          .on("start.interrupt", function() { slider.interrupt(); })
          .on("start drag", function() {
            currentValue = d3.event.x;
            update(x.invert(currentValue));
          })
      )
      .attr("class", "track-inset");

  var x_l = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, width_slider])
        .clamp(true);

  slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
      .data(x_l.ticks(5))
      .enter()
      .append("text")
      .attr("x", x_l)
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
        timer = setInterval(step, 1000);
        button.text("Pause");
      }
      console.log("Slider moving: " + moving);
  });

  function step() {
    update(x.invert(currentValue));
    currentValue = currentValue + 1;//width/4;
    if (currentValue > targetValue) {
      moving = false;
      currentValue = 0;
      clearInterval(timer);
      playButton.text("Play");
    }
  }

  function updateDatasets(h){
      currentDate = h;
      // filter data set and draw map and bubbles
      newDataTweets = dataTweets.filter(function(d) {
        return d.date <= parseDate(d3.timeDay.offset(h, 7))
                && d.date >= parseDate(d3.timeDay.offset(h, -7));
      })

      newDataCorona = dataCorona.filter(function(d) {
        return d.date == parseDate(h);
      })

    dataMap = {};
    newDataCorona.forEach(function(d){
      dataMap[d['alpha-3']] = {}
      dataMap[d['alpha-3']]['Date'] = d.date;
      dataMap[d['alpha-3']]['Confirmed'] = d.cumsum_cases;
      dataMap[d['alpha-3']]['Name'] = d.country;
      dataMap[d['alpha-3']]['Deaths'] = d.cumsum_deaths;
    });

    dataMap = d3.map(dataMap)
  }

  function update(h) {
    // update position and text of label according to slider scale
    handle.attr("cx", width_slider/targetValue * x(h));
    label
      .attr("x", width_slider/targetValue * x(h))
      .text(formatDateIntoDay(h));


    if (currentCountry)
      displayDetail(currentCountry)

    updateDatasets(h);
    displayMap(dataMap);
    displayCircles(newDataTweets);
  }

  update(startDate);

  // Legend: from Bubblemap Template by Yan Holtz
  // https://www.d3-graph-gallery.com/graph/bubble_legend.html
  // https://www.d3-graph-gallery.com/graph/bubblemap_template.html

  var valuesToShow = [500, 5000, 15000]
  var xCircle = width - 80
  var xLabel = xCircle - 80;
  var yCircle = height - 10;
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("circle")
      .attr("cx", xCircle)
      .attr("cy", function(d){ return yCircle - size(d) } )
      .attr("r", function(d){ return size(d) })
      .style("fill", "none")
      .attr("stroke", "black")
  // Add legend: segments
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("line")
      .attr('x1', function(d){ return xCircle - size(d) } )
      .attr('x2', xLabel + 10)
      .attr('y1', function(d){ return yCircle - size(d) } )
      .attr('y2', function(d){ return yCircle - size(d) } )
      .attr('stroke', 'black')
      .style('stroke-dasharray', ('2,2'))
  // Add legend: labels
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("text")
      .attr('x', xLabel)
      .attr('y', function(d){ return yCircle - size(d) } )
      .text( function(d){
        return d + ' tweets'
      } )
      .style("font-size", 12)
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'end')
});
