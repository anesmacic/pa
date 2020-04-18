var width = window.screen.width;
var height = window.screen.height;

var svg = d3.select("body")
  .append("svg")
  .attr("width",width)  // apply width,height to svg
  .attr("height",height);

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

d3.json("./gz_2010_us_040_00_500k.json").then(
  data =>{
    data.features.map(feature => {
    d3.select("svg").append("path")
      .attr("d", path(feature));
      console.log(feature);
    })

  }
)

