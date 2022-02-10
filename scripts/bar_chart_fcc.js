window.addEventListener("DOMContentLoaded", () => {
    var winHeight = 0, 
		winWidth = 0, 
		timeout = false, 
		delay = 350;

    var actualData,
        dater;
    var padding = 15;
    var height = 450,
        width = 600;

function setCoreDimensions(){
		winHeight = window.innerHeight;
		winWidth = window.innerWidth;
		console.log("Window height: " + winHeight);
		console.log("Window width: " + winWidth);
}

/*This function exists for responsiveness reasons*/
window.addEventListener('resize', () => {
	/*Preventing excessive calls on resize from lagging the view on window resize due to any factor*/
		clearTimeout(timeout);
	
		timeout = setTimeout(setCoreDimensions, delay)
});

/*Changes bar graph to be vertical and have year 
 * values on Y and amount on X useful for when height 
 * is more than width like in mobile phones*/

function changeOrientation(){
	return 0;
}

/* Fetching JSON data for the graph*/
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(function(response){
        if(!response.ok){
            console.log("There was an issue with the response: " + response.status + " " + response.statusText);
        } 
        return response.json();
    })
    .then(function(d){
        dater = d;
        actualData = dater.data;
        initSvg();
    })
    .catch(function(err){
        dater = "Unfortunately there was an error";
        return dater;
    });

const initSvg = () => {
    
    console.log("Entered initSvg");

    let barWidth =  (width-padding*20)/actualData.map(d=>d[1]).length;
/*initialising SVG*/
const svg = d3.select("#visHolder")
              .append("svg")
              .attr("preserveAspectRatio", "xMinYMin meet")
              .attr("viewBox", '0 0 '+width+' '+height);

/*setting scales and axes*/
const xScale = d3.scaleTime()
    .domain(d3.extent(actualData, d => d[0])
        .map(item => new Date(item)))
    .range([padding*4, width-padding]);

const yScale = d3.scaleLinear()
    .domain(d3.extent(actualData, d=> d[1]))
    .range([ padding, height-(padding*3)]);


const yScaleAxis = d3.scaleLinear()
    .domain(d3.extent(actualData, d=> d[1]))
    .range([ height-(padding*2), padding]);

const bandwidth = d3.scaleBand()
    .domain(actualData.map(d=> d[0]))
    .range([padding*4, width-padding+1])
    .align(0.50);

svg.selectAll("rect")
    .data(actualData)
    .enter()
    .append("rect")
    .attr("x", (d) => bandwidth(d[0]))
 /*   .attr("x", (d) => xScale(new Date(d[0])))*/
    .attr("y", (d) => ((height-padding*2)-yScale(d[1])))
    .attr("width", barWidth)
/*    .attr("width", (d)=> bandwidth(d[0]))*/
    .attr("height", (d) => yScale(d[1]))
    .attr("class", "svgRect");
    
var xAxis = d3.axisBottom().scale(xScale);

    svg
    .append("g")
    .call(xAxis)
    .attr("id", "x_axis")
    .attr("transform", "translate(0,"+(height-padding*2)+")");

var yAxis = d3.axisLeft().scale(yScaleAxis);

    svg
    .append("g")
    .call(yAxis)
    .attr("id", "y_axis")
    .attr("transform", "translate("+padding*4+",0)");
    
}

});


