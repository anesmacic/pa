var width = 900;
var height = 500;

var svg = d3.select("body")
  .append("svg")
  .attr("width",width)  // apply width,height to svg
  .attr("height",height);

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

d3.json("./GeoObs.json").then(
  data =>{
    console.log(data);
  }
)
