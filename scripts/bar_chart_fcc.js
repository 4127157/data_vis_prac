window.addEventListener("DOMContentLoaded", () => {
    var winHeight = 0, 
		winWidth = 0, 
		timeout = false, 
		delay = 350;

    var actualData,
        dater;
    var padding = 10;
    var height = 300,
        width = 400;

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
    let scaledGDP = [];
    let GDP = actualData.map(d=> d[1]);
    let maxGDP = d3.max(GDP);

    let linearScale = d3.scaleLinear()
                        .domain([0, maxGDP])
                        .range([padding, height-padding]);
    
    scaledGDP =GDP.map(d => linearScale(d));
    console.log(scaledGDP);


    let barWidth = width / GDP.length;

    console.log("this is barWidth " +  barWidth + " And below is scaledGDP!");
    console.log(scaledGDP);
/*initialising SVG*/
const svg = d3.select("#visHolder")
              .append("svg")
              .attr("viewBox", '0 0 '+height+' '+width);

/*setting scales and axes*/
const xScale = d3.scaleTime()
    .domain(d3.extent(actualData, d => d[0]))
    .range([padding, width - padding]);

const yScale = d3.scaleLinear()
    .domain(d3.extent(actualData, d=> d[1]))
    .range([height - padding,  padding]);


svg.selectAll("rect")
    .data(scaledGDP)
    .enter()
    .append("rect")
    .attr("x", (d,i) => i)
    .attr("y", (d) =>height- d )
    .attr("width", barWidth)
    .attr("height", (d) => d)
    .attr("class", "svgRect");
    
}

});


