var width = 900;
var height = 500;

var svg = d3.select("body")
  .append("svg")
  .attr("width",width)  // apply width,height to svg
  .attr("height",height);

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

d3.json("./GeoObs.geojson", function(err, geojson) { 

      projection.fitSize([width,height],geojson); // adjust the projection to the features
      svg.append("path").attr("d", path(geojson)); // draw the features

})