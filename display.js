var width = 900;
var height = 500;

var svg = d3.select("body")
  .append("svg")
  .attr("width",width)  // apply width,height to svg
  .attr("height",height);

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

d3.json("./GeoObs.geojson", function(error, geojson) {
  if (error) {
        return console.warn(error);
    }
      projection.fitSize([width,height],geojson); // adjust the projection to the features
      svg.append("path").attr("d", path(geojson)); // draw the features
      
    d3.select("body").append("svg")
})

console.log(path);
console.log(svg);

console.log('hey')
