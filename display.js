
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
    
    .on("mouseover",oversvg);

var g = svg.append("g");



    function zoomed() {
      g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
   //  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
      g.attr("transform", d3.event.transform); // updated for d3 v4
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

var paint = [];
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
            .range(["#173F5F", "#b71c1c"])

  

      var svgc = d3.select(".colormap").append("svg").attr("class","cmap")
      var linearGradient = svgc.append("linearGradient")
      .attr("id", "linear-gradient");
      linearGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#173F5F")
    .attr("stop-opacity","1"); 

linearGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#b71c1c")
    .attr("stop-opacity","1"); 

    svgc.append("rect")
    .attr("id","cmaprect")
    .attr("width", width)
    .attr("height", 20)
    .style("fill", "url(#linear-gradient)");
    
       
   // cmap = document.querySelector('.cmin');
   // cmap.innerHTML = minval.toString();
   // cmap2 = document.querySelector('.cmax');
   // cmap2.innerHTML = maxval.toString();

    data.features.map(feature => {
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


function statelevel(){

  var [...elements] = document.querySelectorAll("path")
  console.log(elements)
  elements.map((element) => {
    element.setAttribute('fill',paint(element.getAttribute('fatality')))
    element.style.fill = paint(element.getAttribute('fatality'))
  })

}



function command(){
  var element = document.querySelector("#state")
  console.log(element.getAttribute("active"))
  if (element.getAttribute("active") === "false"){
    element.setAttribute("active","true")
    element.style.backgroundColor =  "rgba(197, 189, 188, 0.76)";

      statelevel()
  }
    else{
      element.setAttribute("active","false")
      element.style.backgroundColor =  "#1E1A19";

      clearColoring()
    }


}

function clearColoring(){
  var [...elements] = document.querySelectorAll("path")
  console.log("clear")
  elements.map((element) => {
    element.setAttribute('fill','gray')
    element.style.fill = 'gray';
  })


  redraw()
}

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


