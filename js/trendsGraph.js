function trend_graph(country="CH") {
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
  d3.timeFormatDefaultLocale(locale);

  // set the dimensions and margins of the graph
  var get_width = parseInt(d3.select("#trendsChart").style("width"));
  if (get_width>450) {
      var margin = { top: 5, bottom: 40, left: 20, right: 20};
  } else {
      var margin = { top: 5, bottom: 40, left: 0, right: 0};
  }

  var width = get_width - margin.left - margin.right;

  //var width = 800 - margin.left - margin.right;
  var height = 240 - margin.top - margin.bottom;

  // parse the date / time
  var parseTime = d3.timeParse("%Y-%m-%d");

  // set the ranges
  var x = d3.scaleTime()
    .range([margin.left, width-margin.right]);

  var yr = d3.scaleLinear().range([height, 0]);
  var yl = d3.scaleLinear().range([height, 0]);
  var line_Tweets = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return yr(d.Tweets); });

  var line_GTrend = d3.line() //.curve(d3.curveStepAfter)
      .x(function(d) { return x(d.date); })
      .y(function(d) { return yl(d.GTrend); });

  var svg = d3
    .select("#trendsChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "trendsChartSVG")
  .append('g')
    .attr("transform", "translate(" + 0 + "," + margin.top + ")");

  // Get the data
  // TODO: charger 1x les données + fonction update
  d3.csv("data/MediasVsGTrendsVsTweetsVsCorona_filt.csv").then(function(data) {

    // format the data
    data.forEach(function(d) {
        d.date = parseTime(d.date);

        if (country=="CH") {
            d.Infections  = +d.Infections_CH;
            d.Tweets = +d.Tweets_CH;
            d.Medias = +d.Medias_CH;
            d.GTrend = +d.GTrend_CH;
        } else if (country=="DE") {
            d.Infections  = +d.Infections_DE;
            d.Tweets = +d.Tweets_DE;
            d.Medias = +d.Medias_DE;
            d.GTrend = +d.GTrend_DE;
        } else if (country=="FR") {
            d.Infections  = +d.Infections_FR;
            d.Tweets = +d.Tweets_FR;
            d.Medias = +d.Medias_FR;
            d.GTrend = +d.GTrend_FR;
        } else if (country=="IT"){
            d.Infections  = +d.Infections_IT;
            d.Tweets = +d.Tweets_IT;
            d.Medias = +d.Medias_IT;
            d.GTrend = +d.GTrend_IT;
        }
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    //x.domain([,d3.max(data, function(d) {
  	//  return d.date; })])

    yl.domain([0, d3.max(data, function(d) {
  	  return d.GTrend; })]);
    yr.domain([0, d3.max(data, function(d) {
  	  return Math.max(d.Tweets,d.Medias); })]);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis

    if (get_width>480) {
      svg.append("g")
          .attr('transform', 'translate(' + (margin.left) + ',0)')
          .call(d3.axisLeft(yl));
      svg.append("g")
          .attr("transform", "translate( " + (width-margin.right) + ", 0 )")
          .call(d3.axisRight(yr));
    } else {
       svg.append("g")
          .attr('transform', 'translate(' + (margin.left+20) + ',0)')
          .call(d3.axisLeft(yl));
      svg.append("g")
          .attr("transform", "translate( " + (width-margin.right-35) + ", 0 )")
          .call(d3.axisRight(yr));
    }

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#fff")
        .style("stroke-width", "5px")
        .attr("d", line_Tweets);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#3498db")
        .attr("d", line_Tweets);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#fff")
        .style("stroke-width", "5px")
        .attr("d", line_GTrend);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#e74c3c")
        .attr("d", line_GTrend);


    if (country=="CH") {
        var date_first_case = x(new Date(2020,1,25));
        // var label_first_case = "1er cas";
        var label_first_case = "1er cas en Suisse"; // si tu permets! et j'aurais tendance à ajouter l'Italie pour rendre le graphique plus lisible
        var dx_dir = -1;
    } else if (country=="DE") {
        var date_first_case = x(new Date(2020,0,27));
        var label_first_case = "1er cas";
        var dx_dir = 0;
    } else if (country=="FR") {
        var date_first_case = x(new Date(2020,0,24));
        var label_first_case = "1er cas";
        var dx_dir = 0;
    } else if (country=="IT"){
        var date_first_case  = x(new Date(2020,0,31));
        var label_first_case = "1er cas";
        var dx_dir = -1;
        const annotations_lombardie = [
          {
            note: {
              label: "16 cas, Lombardie",
            },
            color: ["#e83e8c"],
            x: x(new Date(2020,1,21)),
            y: height,
            dy: -120,
            dx: -1
          }
        ]

        // Add annotation to the chart
        const makeAnnotations = d3.annotation()
          .annotations(annotations_lombardie)
        d3.select("#trendsChartSVG")
          .append("g")
          .call(makeAnnotations)
    }

    const annotations = [
      {
        note: {
          label: label_first_case,
        },
        color: ["#e83e8c"],
        x: date_first_case,
        y: height,
        dy: -140,
        dx: dx_dir
      }
    ]

    // Add annotation to the chart
    const makeAnnotations = d3.annotation()
      .annotations(annotations)
    d3.select("#trendsChartSVG")
      .append("g")
      .call(makeAnnotations)

    // Handmade legend
    var legend_pos_y = 223;
    svg.append("line").attr("x1",20).attr("y1",legend_pos_y).attr("x2",30).attr("y2",legend_pos_y).style("stroke", "#3498db").style("stroke-width", "5px")
    svg.append("line").attr("x1",100).attr("x2",110).attr("y1",legend_pos_y).attr("y2",legend_pos_y).style("stroke", "#e74c3c").style("stroke-width", "5px")
    svg.append("text").attr("x", 40).attr("y", legend_pos_y).text("Tweets").style("font-size", "13px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 120).attr("y", legend_pos_y).text("Google Trends").style("font-size", "13px").attr("alignment-baseline","middle")

  });

}
