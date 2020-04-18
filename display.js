
var width = 500,
    height = 500,
    active = d3.select(null);

var projection = d3.geoMercator()
    .scale(300)
    .translate([1060, 530 ]);
  
var path = d3.geoPath().projection(projection);

var svg = d3.select(".map-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var g = svg.append("g");
  
    function clicked(d) {
      if (active.node() === this) return reset();
      active.classed("active", false);
      active = d3.select(this).classed("active", true);
      console.log(d);
      console.log(path.bounds(d))
      var bounds = path.bounds(d),
          dx = bounds[1][0] - bounds[0][0],
          dy = bounds[1][1] - bounds[0][1],
          x = (bounds[0][0] + bounds[1][0]) / 2,
          y = (bounds[0][1] + bounds[1][1]) / 2,
          scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
          translate = [width / 2 - scale * x, height / 2 - scale * y];
    
      svg.transition()
          .duration(750)
          // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
          .call(zoom ); // updated for d3 v4
    }

    function zoomed() {
      g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
   //  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
      g.attr("transform", d3.event.transform); // updated for d3 v4
    }

    function reset() {
      active.classed("active", false);
      active = d3.select(null);
    
      svg.transition()
          .duration(750)
          // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
          .call( zoom ); // updated for d3 v4
    }
    
var cont = document.getElementsByClassName('.map-container')
cont.innerHTML = 'LOADING';

d3.json("./gz_2010_us_040_00_500k.json").then(
  data =>{
    data.features.map(feature => {
    //  if (feature.properties.STATE !== "15" && feature.properties.STATE !== "02")
      {
    d3.select("svg").append("path")
      .attr("d", path(feature))
      .attr("class", "feature")
      .on("zoom",zoom)
      .on('click',function(){
        var d = (this);
        console.log(d.getBBox())
        d.style.fill = 'red';
        console.log(path.bounds(d))
        var box = d.getBBox()
      
        
        scale = Math.max(8, Math.min(8, 0.9 / Math.max(box.width / width, box.height / height))),
        translate = [width / 2 - scale * box.x, height / 2 - scale * box.y];
  
    svg.transition()
        .duration(10)
        .call(zoom );
      })
    }
    })
   

  }
).then(cont.innerHTML = '').then(console.log("LOADED"))


function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

var zoom = d3.zoom()
      .on('zoom', function() {
        console.log(svg.selectAll('path'))
          svg.selectAll('path')
           .attr('transform', d3.event.transform);

});

function redraw(){

  // Extract the width and height that was computed by CSS.
  var width = 500;

  // Use the extracted size to set the size of an SVG element.
  svg
    .attr("width", width)
    .attr("height", height);

  // Draw an X to show that the size is correct.
  
   
}




window.addEventListener("resize", redraw);


svg.call(zoom);

/*
var svg = d3.select(".map-container")
  .append("svg")
  .attr("width",width)  // apply width,height to svg
  .attr("height",height);

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);


*/


