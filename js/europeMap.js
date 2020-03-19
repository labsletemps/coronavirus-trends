/*
 * Bubble Map
 * Author: Francois Quellec
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
  var parseDate = d3.timeFormat("%Y-%m-%d");

  var currentDate = null;
  var currentCountry = null;

  // Initialize datasets map and filter variables
  var newDataTweets = []
  var tweetsMap = d3.map();

  var newDataCorona = []
  var dataMap = d3.map();

  ///////////////////////////////////////////
  ////////////////////MAP////////////////////
  ///////////////////////////////////////////

  // Color scales
  var colorScaleCorona = d3.scaleLinear().domain([0,10])
    .range(["#b8b8b8", "red"]);

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
    .style("opacity", .6)
    .exit()
    .transition().duration(200)
    .attr("r",1)
    .remove();

  // Display Infos by country
  function displayDetail(d) {
    currentCountry = d;
    d3.select(".map-details")
    .html(function() {
      var location = d.properties.name;
      var infos = d3.map(dataMap.get(d.id)) || d3.map();
      return `<h4>${location}</h4>
        <p><span class="stats">Nombre total de tweets geolocalisés par semaine</span> ${tweetsMap.get(d.id) || 0}</p>
        <p><span class="stats">Cas confirmés par million d'habitants</span> ${Math.round(infos.get('ConfirmedRatio') * 100) / 100 || 0  }</p>
        <p><span class="stats">Cas confirmés cumulés</span> ${infos.get('Confirmed') || 0  }</p>
        <p><span class="stats">Décès</span> ${infos.get('Deaths') || 0  }</p>
        <p><span class="stats">Date</span> ${formatDateIntoDay(currentDate)}</p>
      `;})
      .style('opacity', 1);
    }

  // Update the map
  var displayMap = function(data){
    svg.selectAll("path").attr("fill", function (d) {
      var infos = d3.map(data.get(d.id));
      d.total = infos.get('ConfirmedRatio') || 0;
        return colorScaleCorona(d.total);
      })
      .attr("d", d3.geoPath()
      .projection(projection))

  }

  ///////////////////////////////////////////
  ///////////////////BUBLES//////////////////
  ///////////////////////////////////////////
  var colorScaleTweets = d3.scaleLinear().domain([0,10000])
    .range(["#b8b8b8", "blue"]);

   // Add a scale for bubble size
  var valueExtent = d3.extent(dataTweets, function(d) { return +d.count; })
  var size = d3.scaleSqrt()
    .domain(valueExtent)
    .range([ 1, 50])  // Size in pixel

  // Add/Update circles:
  var displayCircles = function(data) {
    svg.selectAll(".circles").remove();

    var circles = svg.selectAll(".circle")
          .data(data.sort(function(a,b) { return +b.count - +a.count }).filter(function(d,i){ return i<500 }));
    circles
      .enter()
        .append("g")
          .attr("class", "circles")

        .append("circle")
          .attr("class", "circles")
          .attr("cx", function(d){ return projection([+d.lon, +d.lat])[0] })
          .attr("cy", function(d){ return projection([+d.lon, +d.lat])[1] })
          //.attr("r", 1)
          //  .transition().duration(200)
          .attr("r", function(d){ return size(+d.count)})
        .style("fill", function(d){ return colorScaleTweets(d.count) })
          .attr("stroke", function(d){ if(d.count>20){return "blue"}else{return "none"}  })
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 0.7)
          .attr("fill-opacity", 0.4);
    /*circles
      .exit()
        .transition(d3.transition().duration(750))
          .attr("r", 1e-6)
        .remove();
      */
  };


  ///////////////////////////////////////////
  /////////////////SELECTOR//////////////////
  ///////////////////////////////////////////
  var dates = ['19/02/20', '26/02/20', '04/03/20', '11/03/20']

  var idBtn_1  =  'date-1';
  var idBtn_2  =  'date-2';
  var idBtn_3  =  'date-3';
  var idBtn_4  =  'date-4';

  var date1Button = d3.select("#" + idBtn_1).style('top', '20%').html(dates[0]);
  var date2Button = d3.select("#" + idBtn_2).style('top', '20%').html(dates[1]);
  var date3Button = d3.select("#" + idBtn_3).style('top', '20%').html(dates[2]);
  var date4Button = d3.select("#" + idBtn_4).style('top', '20%').html(dates[3]);

  var parser = d3.timeParse("%d/%m/%y");

  document.getElementById(idBtn_1).onclick = function() {update(parser(dates[0]))};
  document.getElementById(idBtn_2).onclick = function() {update(parser(dates[1]))};
  document.getElementById(idBtn_3).onclick = function() {update(parser(dates[2]))};
  document.getElementById(idBtn_4).onclick = function() {update(parser(dates[3]))};

  /*
    .on("click", function() {
      
  });
    date2Button
    .on("click", function() {
      update(parser(dates[1]))
  });
    date3Button
    .on("click", function() {
      update(parser(dates[2]))
  });
  date4Button
    .on("click", function() {
      update(parser(dates[3]))
  });
*/
  document.getElementById(idBtn_1).click();

  function updateDatasets(h){
      currentDate = h;
      // filter data set and draw map and bubbles
      newDataTweets = dataTweets.filter(function(d) {
        return d.date == parseDate(h)

      })

      tweetsMap = {}
      newDataTweets.forEach(function(d){
        if (d['alpha-3'] in tweetsMap){
          tweetsMap[d['alpha-3']] = parseInt(tweetsMap[d['alpha-3']]) + parseInt(d.count);
        }
        else{
          tweetsMap[d['alpha-3']] = parseInt(d.count);
        }
      });
      tweetsMap = d3.map(tweetsMap);
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
      dataMap[d['alpha-3']]['ConfirmedRatio'] = d.cases_by_million;
    });

    dataMap = d3.map(dataMap)
  }

  function update(h) {
    updateDatasets(h);
    displayMap(dataMap);
    displayCircles(newDataTweets);
    if(currentCountry != null)
      displayDetail(currentCountry)
  }


///////////////////////////////////////////
//////////////////LEGEND///////////////////
///////////////////////////////////////////

// Legend: from Bubblemap Template by Yan Holtz
// https://www.d3-graph-gallery.com/graph/bubble_legend.html
// https://www.d3-graph-gallery.com/graph/bubblemap_template.html

  var valuesToShow = [500, 7000, 20000]
  var xCircle = width - 80
  var xLabel = xCircle - 80;
  var yCircle = height - 40;
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
