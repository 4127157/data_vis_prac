window.addEventListener("DOMContentLoaded", () => {
    
    var visHolder = document.getElementById('visHolder');

    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
        .then((response)=>{
            if(response.ok){
                response.json().then((data)=>{
                   initSvg(data); 
                });
            } else {
                console.log("There was a problem with the response: " 
                    + response.status 
                    + " " 
                    + response.statusText);
                visHolder.innerText = "Sorry there seems to be an error: "
                                    + response.status
                                    + " "
                                    + response.statusText;
            }
        })
        .catch((err)=>{
                console.log("There was a problem with the response: " + err);
                visHolder.innerText = "Sorry there seems to be an error: " 
                                    + err;
        });

    const initSvg = (data) => {

        const tooltip = d3
            .select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);

        var height = 450,
            width = 600, 
            padding = (height/3)*0.1;

        const xScale = d3
            .scaleTime()
            .domain(d3.extent(data, d => d.Year)
                    .map(item => new Date(item)))
            .range([padding*4, width-padding*2]);

        const yScale = d3
            .scaleTime()
            .domain(d3.extent(data, d => new Date(1970,0,1,0, d.Time.split(":")[0], d.Time.split(":")[1])))
            .range([padding, height-padding*2]);


        const svg = d3
            .select('#visHolder')
            .append('svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr("viewBox", `0 0 ${width} ${height}`);

        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 5)
            .attr("cx", d => xScale(d.Year))
            .attr("cy", (d) => {
                    return yScale(new Date(1970,0,1,0, d.Time.split(":")[0], d.Time.split(":")[1]));
            })
            .style("opacity", 0.7)
            .on("mouseover", (e,d)=>{
                e.target.style.opacity = 0.9;
                const[x,y] = d3.pointer(e, svg);
                tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltip
                    .html(`
                        ${d.Name} : ${d.Nationality}<br/>
                        Year : ${d.Year}<br/>
                        Time : ${d.Time}<br/>
                        ${d.Doping}
                        `)
                    .style("left", (x)+20+"px")
                    .style("top", (y)+20+"px");
            })
            .on("mouseout", (e,d)=>{
                svg.selectAll(".dot")
                    .style("opacity", 0.7);
                tooltip
                    .transition()
                    .duration(400)
                    .style("opacity", 0);
            });
            
    }
})
