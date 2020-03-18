function media_graph(country) {
  // localisation
  var locale = {
    "dateTime": "%A %e %B %Y",
    "date": "%d/%m/%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    "shortDays": ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
    "months": ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    "shortMonths": ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]
  }
  //d3.timeFormatDefaultLocale(locale);

  // set the dimensions and margins of the graph
  var margin = { top: 40, bottom: 10, left: 40, right: 40 };

  var width = parseInt(d3.select("#chartMedia").style("width")) - margin.left - margin.right;

  //var width = 800 - margin.left - margin.right;
  var height = 300 - margin.top - margin.bottom;
 
  // parse the date / time
  var parseTime = d3.timeParse("%Y-%m-%d");
  
  // set the ranges
  var x = d3.scaleTime()
    .range([margin.left, width-margin.right]);

  var yr = d3.scaleLinear().range([height, 0]);
  //var yl = d3.scaleLog().range([height, 0]);
  var yl = d3.scaleLog().clamp(true).range([height, 0]).nice();
  
  var line_Infections = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return yl(d.Infections); });
  var line_Medias = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return yr(d.Medias); });

  var svg = d3
    .select("#chartMedia")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "chartTopSVG");

  // Get the data
  d3.csv("data/MediasVsGTrendsVsTweetsVsCorona_filt.csv").then(function(data) {
       
    // format the data
    data.forEach(function(d) {
        d.date = parseTime(d.date);
         if (country=="CH") {
            d.Infections  = +d.Infections_CH;
            d.Medias = +d.Medias_CH;
        } else if (country=="DE") {
            d.Infections  = +d.Infections_DE;
            d.Medias = +d.Medias_DE; 
        } else if (country=="FR") {
            d.Infections  = +d.Infections_FR;
            d.Medias = +d.Medias_FR; 
        } else if (country=="IT"){
            d.Infections  = +d.Infections_IT;
            d.Medias = +d.Medias_IT; 
        }
    });
  
    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    //x.domain([new Date(2020,0,23),d3.max(data, function(d) {
  	//  return d.date; })])

    yl.domain([0.1, d3.max(data, function(d) { 
  	  return Math.max(d.Infections); })]);
    yr.domain([0, d3.max(data, function(d) {
  	  return Math.max(d.Medias); })]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#3498db")
        .style("stroke-dasharray", ("3, 3"))
        .style("stroke-width", "2px")
        .attr("d", line_Infections);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#fff") 
        .style("stroke-width", "5px")
        .attr("d", line_Medias);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#3498db") 
        .attr("d", line_Medias);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
  
    // Add the Y Axis
    svg.append("g")
        .attr('transform', 'translate(' + (margin.left) + ',0)')
        .call(d3.axisLeft(yl).tickValues([1,10,100,1000,10000]).tickArguments([6,".0s"]));
    svg.append("g")
        .attr("transform", "translate( " + (width-margin.right) + ", 0 )")
        .call(d3.axisRight(yr));

    const annotations = [
      {
        note: {
          label: "Here is the annotation label",
        },
        color: ["#e83e8c"],
        x: 40,
        y: 230,
        dy: -150,
        dx: 0
      }
    ]
    
    // Add annotation to the chart
    //const makeAnnotations = d3.annotation()
    //  .annotations(annotations)
    //d3.select("#chartTopSVG")
    //  .append("g")
    //  .call(makeAnnotations)

    // Handmade legend
    var legend_pos_y = 280; 
    svg.append("line").attr("x1",20).attr("y1",legend_pos_y).attr("x2",30).attr("y2",legend_pos_y).style("stroke", "#3498db").style("stroke-width", "5px")
    svg.append("line").attr("x1",150).attr("x2",165).attr("y1",legend_pos_y).attr("y2",legend_pos_y).style("stroke", "#3498db").style("stroke-width", "2px").style("stroke-dasharray", ("3, 3"))
    svg.append("text").attr("x", 40).attr("y", legend_pos_y).text("Media articles").style("font-size", "13px").attr("alignment-baseline","middle")
    svg.append("text").attr("x",170).attr("y", legend_pos_y).text("Infections").style("font-size", "13px").attr("alignment-baseline","middle")

  });
  
}

