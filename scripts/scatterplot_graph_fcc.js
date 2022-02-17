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
        console.log(data);

        var height = 450,
            width = 600, 
            padding = (height/3)*0.1;

        const xScale = d3
            .scaleTime()
            .domain(d3.extent(data, d => d.Year)
                    .map(item => new Date(item)))
            .range([0, width]);

        const yScale = d3
            .scaleTime()
            .domain(d3.extent(data, d => new Date(1970,0,1,0, d.Time.split(":")[0], d.Time.split(":")[1])))
            .range([0, height]);

        console.log(d3.extent(data, d => new Date(1970,0,1,0, d.Time.split(":")[0], d.Time.split(":")[1])));

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
                    console.log(yScale(new Date(1970,0,1,0, d.Time.split(":")[0], d.Time.split(":")[1])));
                    return yScale(new Date(1970,0,1,0, d.Time.split(":")[0], d.Time.split(":")[1]));
            });
            
    }
})
