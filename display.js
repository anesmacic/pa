var width = window.screen.width;
var height = window.screen.height;

var svg = d3.select("body")
  .append("svg")
  .attr("width",width)  // apply width,height to svg
  .attr("height",height);

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

d3.json("./us.json").then(
  data =>{
    d3.select("svg").append("path")
      .attr("d", path(data));
    console.log(data);
  }
)

