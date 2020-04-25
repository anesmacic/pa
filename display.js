
var width = window.innerWidth,
    height = 500,
    active = d3.select(null);

var projection = d3.geoAlbersUsa()
				            .translate([width/3, height/2])    // translate to center of screen
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
      g.attr("transform", d3.event.transform); 
    }

var cont = document.getElementsByClassName('.map-container')
cont.innerHTML = 'LOADING';

var regiondetails = [];

d3.json("./regiondetails.json").then(
  data => {
    regiondetails.push(data[1])
  }
)

var drivers = [];

var fatals = [];
d3.json("./fatals.json").then(
  data => {
    fatals.push(data.FATALS)
  }
)

var drivers = [];

d3.json("./drivers.json").then(
  data => {
    drivers.push([Object.entries(data)[0][1]])
  }
)

var paint = [];
var minval = 0;
var maxval = 0;

var paintnormal = [];
var minvaldrivers = 0;
var maxvaldrivers = 0;
var globaldata = [];
// is performance better with queue and defer for jsons with async join function?

d3.json("./d3data.json").then(
  data => {
    globaldata = data;  
  }
)


d3.json("./gz_2010_us_040_00_500k.json").then(
  data =>{
    var fatalvalue = 0;
    Object.keys(globaldata.FATALS).forEach(function(key) {
      fatalvalue = globaldata.FATALS[key]
      if (minval > fatalvalue || minval === 0){
      minval = fatalvalue}
    if (maxval < fatalvalue){
      maxval = fatalvalue}
  }); 
  console.log(maxval)
  console.log(minval)
  var drivervalue = 0;
  Object.keys(drivers[0][0]).forEach(function(key) {
    drivervalue = drivers[0][0][key]
    if (minvaldrivers > drivervalue || minvaldrivers === 0){
    minvaldrivers = drivervalue}
  if (maxvaldrivers < drivervalue){
    maxvaldrivers = drivervalue}
}); 

   paint = d3.scaleLinear()
            .domain([minval,maxval])
            .range(["#173F5F", "#b71c1c"])

    var svgc = d3.select(".colormap")
                  .append("svg")
                  .attr("class","cmap")

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
    linearGradient.append("text")
    .text('20val') 
                  .attr("y","10px")
                  .attr("x","20px")
                  .attr("fill",'white')
                  .attr("font-family", "sans-serif")
                 .attr("font-size", "20px")

    svgc.append("rect")
            .attr("id","cmaprect")
            .attr("width", width)
            .attr("height", 20)
            .style("fill", "url(#linear-gradient)");
            
       console.log(globaldata)
       const ar = Object.values(globaldata.STATE);
       console.log(ar[0])
    data.features.map(feature => {
      {
          fatalval = globaldata.FATALS[ar.indexOf(parseInt(feature.properties.STATE))]
          mrt = globaldata.RESPONSE_TIME[ar.indexOf(parseInt(feature.properties.STATE))]
          rur = globaldata.RUR[ar.indexOf(parseInt(feature.properties.STATE))]
          driversval = drivers[0][0][feature.properties.NAME]
          Object.keys(regiondetails[0]).some(function(key) {
                    if (regiondetails[0][key].includes(feature.properties.NAME)){
                      region = key; return true; 
                      }
          })
          d3.select("svg")
            .append("path")
            .attr("d", path(feature))
            .attr("class", "feature")
            .attr('fatality',fatalval)
            .attr('region',region)
            .attr('fatalityn',fatalval/driversval*1000000/4)
            .attr('mrt',mrt)
            .attr('rur',rur)
            .attr('ndrivers',driversval)
            .attr('name',feature.properties.NAME)
            .style('fill',paint(fatalval))
            .on('mouseover',hovering)
            .on("zoom",zoom)
    } 
    })
    populatepaintnormalizer()
  }
)


function cursor(e){
  let mouse = document.querySelector('.country');
  mouse.style.top = e.pageY - 60 + 'px';
  mouse.style.left = e.pageX - 40 + 'px';

}

function hovering(){
      var state = document.querySelector(".country");
      p = this;
      state.style.visibility = 'visible';
      var str = 'State: '.concat(p.getAttribute("name"),'<br/>','Fatalities: ',
      p.getAttribute('fatality'),'<br/>',
      'Fatals/mil-driver: ',(parseInt(p.getAttribute('fatalityn')))
      ,'</br>','Region: ',p.getAttribute('region')
      ,'</br>','MRT: ',parseFloat(p.getAttribute('mrt')).toFixed(2)
      ,'</br>','U/R: ',parseFloat(p.getAttribute('rur')).toFixed(2)
      );
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

function populatepaintnormalizer(){

  var [...elements] = document.querySelectorAll("path")
  var minv = 0;
  var maxv = 0;
  var fv = 0;
  elements.forEach(function(element) {
    fv = element.getAttribute('fatalityn');
    if(!isNaN(fv)){
      if (minv === 0 || fv - minv < 0){
        minv = fv}
      if (maxv === 0 || maxv-fv < 0){
        maxv = fv}
    }
  })

    paintnormal = d3.scaleLinear()
                    .domain([minv,maxv])
                    .range(["#173F5F", "#b71c1c"])  
}

function getActiveAttribute(){
  return activeAttribute;
}

function getActivePlotMethod(){
  return activePlotMethod;
}

function isNormalized(){
  return isNormalizedVar();
}

function commandregion(){
  var attribute = getActiveAttribute()
  // populate region value array, check if normalized, get colorscaler and repaint : O(3P)
  var region = [];
  var [...elements] = document.querySelectorAll("path")
  
  elements.map((element) => {
    if (!region.includes(element.getAttribute('region')))
      region.push(region)
    else
      region[element.getAttribute('region')] = region[element.getAttribute('region')] + element.getAttribute(attribute)
  })



}

function normalizebymildrivers(){
  var [...elements] = document.querySelectorAll("path")
  
  elements.map((element) => {
    element.setAttribute('fill',paintnormal(element.getAttribute('fatalityn')))
    element.style.fill = paintnormal(element.getAttribute('fatalityn'))
  })

  var element = document.querySelector("#state")
  element.setAttribute("active","false")

  var element = document.querySelector("#normalize")
  element.setAttribute("active","true")
  element.style.backgroundColor = "rgba(168, 165, 165, 0.178)";
  console.log(element)

}

function statelevel(){
  var [...elements] = document.querySelectorAll("path")
  elements.map((element) => {
    element.setAttribute('fill',paint(element.getAttribute('fatality')))
    element.style.fill = paint(element.getAttribute('fatality'))
  })
}

function command(){
  var element = document.querySelector("#state")
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
}

window.addEventListener('mousemove',cursor);
svg.call(zoom);


