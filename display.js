
var width = 500,
    height = 500,
    active = d3.select(null);
/*
var projection = d3.geoMercator()
    .scale(300)
    .translate([1060, 530 ]);
*/
    var projection = d3.geoAlbersUsa()
				   .translate([width, height/2])    // translate to center of screen
				   .scale([1000]);  
  
var path = d3.geoPath().projection(projection);

var svg = d3.select(".map-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset)
    .on("mouseover",oversvg);

var g = svg.append("g");

function clicked(d) {
      if (active.node() === this) return reset();
      active.classed("active", false);
      active = d3.select(this).classed("active", true);
      
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

var drivers = [];

var fatals = [];
d3.json("./fatals.json").then(
  data => {
    fatals.push(data.FATALS)
  }
)

// is performance better with queue and defer for jsons with async join function?

d3.json("./gz_2010_us_040_00_500k.json").then(

  

  data =>{

    var minval = 0;
    var maxval = 0;
    var fatalvalue = 0;
    Object.keys(fatals[0]).forEach(function(key) {
      fatalvalue = fatals[0][key]
      if (minval > fatalvalue || minval === 0){
      minval = fatalvalue}
    if (maxval < fatalvalue){
      maxval = fatalvalue}
  }); 


    paint = d3.scaleLinear()
            .domain([minval,maxval])
            .range(["yellow", "red"])

    data.features.map(feature => {
    //  if (feature.properties.STATE !== "15" && feature.properties.STATE !== "02")
      {
      fatalval = fatals[0][feature.properties.NAME]
        
    d3.select("svg").append("path")
      .attr("d", path(feature))
      .attr("class", "feature")
      .attr('fatality',fatalval)
      .attr('name',feature.properties.NAME)
      .style('fill',paint(fatalval))
      .on('mouseover',hovering)
      .on("zoom",zoom)

   /*   .on('click',function(){
        var d = (this);
        d.style.fill = 'red';
        var box = d.getBBox()
        console.log(feature)
      
        
        scale = Math.max(8, Math.min(8, 0.9 / Math.max(box.width / width, box.height / height))),
        translate = [width / 2 - scale * box.x, height / 2 - scale * box.y];
  
    svg.transition()
        .duration(10)
        .call(zoom );
      })
*/
    } 
    })
   

  }
)


function cursor(e){
  let mouse = document.querySelector('.country');
  mouse.style.top = e.pageY - 30 + 'px';
  mouse.style.left = e.pageX - 10 + 'px';

}

function hovering(){
  var state = document.querySelector(".country");
  p = this;
  state.style.visibility = 'visible';
  var str = 'State: '.concat(p.getAttribute("name"),'<br/>','Fatalities: ',p.getAttribute('fatality'));
  state.innerHTML = str;
}

function oversvg(){
  var state = document.querySelector(".country");
  state.innerHTML = '';
  state.style.visibility = 'hidden';
}
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

var zoom = d3.zoom()
      .on('zoom', function() {
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


window.addEventListener('mousemove',cursor);


window.addEventListener("resize", redraw);


svg.call(zoom);


