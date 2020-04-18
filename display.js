var width = 500;
var height = 500;

var svg = d3.select(".map-container")
  .append("svg")
  .attr("width",width)  // apply width,height to svg
  .attr("height",height);

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

d3.json("./gz_2010_us_040_00_500k.json").then(
  data =>{
    data.features.map(feature => {
      if (feature.properties.STATE !== "15" && feature.properties.STATE !== "02"){
    d3.select("svg").append("path")
      .attr("d", path(feature));}
      console.log(feature);
    })
    console.log(d3.geoBounds(data))
    console.log(d3.geoCentroid(data))
    console.log(projection.scale())
    console.log(projection.center())
    projection.fitExtent([[20, 20], [940, 480]], data);

  }
)




