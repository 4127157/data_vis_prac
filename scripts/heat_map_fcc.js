window.addEventListener("DOMContentLoaded", () => {
    var visHolder = document.getElementById(`visHolder`);

    fetch(`https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json`)
        .then((res)=>{
            if(res.ok){
                res.json().then((data)=>{
                    initSvg(data);
                });
            } else {
                visHolder.innerText 
                    = `There seems to be an error: ${res.status} ${res.statusText}`;
            }
        })
        .catch ((err)=>{
                visHolder.innerText = `There seems to be an error: ${err}`;
        });

    const initSvg = (data) => {
        
        let height = 900*0.6,
            width = 1600*0.6, 
            padding = (height/3)*0.1,
            rectHeight = padding,
            rectWidth = padding/2;

        const tooltip = d3
            .select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);

        const svg = d3
            .select(`#visHolder`)
            .append(`svg`)
            .attr(`preserveAspectRatio`, `xMinYMin meet`)
            .attr(`viewBox`, `0 0 ${width} ${height}`);

        const xScale = d3
            .scaleBand()
            .domain(Array.from(data.monthlyVariance, d=> d.year))
            .range([padding*5, (width-padding)]);

        const yScale = d3
            .scaleBand()
            .domain(Array.from(data.monthlyVariance, d => d.month)
                .map((d,i)=> {
                        return d-1;
                    
                }))
            .range([padding,height-padding*4]);

        /*TODO: 
         *      6) Thoroughly investigate legend and add
            *   7) Add tooltip*/

        const getFillColor = (variance) => {
            let maxVar = d3.max(data.monthlyVariance, d => d.variance);
            let minVar = d3.min(data.monthlyVariance, d => d.variance);

            const getColdTemp = () => {
                let hue = 213,
                    sat = 100,
                    light = 90,
                    procVar = Math.abs(variance),
                    procMin = Math.abs(minVar),
                    maxLight = 20;
                
                light = light + ((procVar/procMin)*(maxLight - light));
                return `hsl(${hue}, ${sat}%, ${Math.round(light)}%)`;
            }

            const getHotTemp = () => {
                let hue = 18,
                    sat = 100,
                    light = 92,
                    procVar = Math.abs(variance),
                    procMin = Math.abs(maxVar),
                    maxLight = 25;
                
                light += ((procVar/procMin)*(maxLight - light));
                return `hsl(${hue}, ${sat}%, ${Math.round(light)}%)`;
            }

            if(variance < 0) {
                return getColdTemp();
            } else if (variance > 0) {
                return getHotTemp();
            } else {
                return 'yellow';
            }

        }

        svg
            .selectAll(".cell")
            .data(data.monthlyVariance)
            .enter()
            .append("rect")
            .attr(`class`, `cell`)
            .attr(`x`, d => xScale(d.year))
            .attr(`y`, d => yScale(d.month-1))
            .style(`fill`, d => getFillColor(d.variance))
            .attr(`height`, yScale.bandwidth()+(yScale.bandwidth()*0.015))
            .attr(`width`, xScale.bandwidth()+(xScale.bandwidth()*0.18))
            .attr('data-month', d=> d.month-1)
            .attr('data-year', d => d.year)
            .attr('data-temp', d => {
                    return data.baseTemperature+(d.variance);
            })
            .on("mouseover", (e, d)=> {
                const[x,y] = d3.pointer(e,svg);
                
                let date = new Date(0);
                date.setUTCMonth(d.month);
                let format = d3.timeFormat(`%B`);

                tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 0.9);

                tooltip
                    .html(`
                        ${d.year} - ${format(date)}<br/>
                        ${Math.round((data.baseTemperature+(d.variance)+Number.EPSILON)*100)/100}<br/>
                        ${d.variance}`)
                    .attr("data-year", `${d.year}`);
                    
                tooltip
                    .style("left", `${(x)+5}px`)
                    .style("top", `${(y)-75}px`);

                e.target.setAttribute("width", xScale.bandwidth());
                e.target.style.stroke = "black";
                e.target.style.stroke_width = xScale.bandwidth()*0.04;
            })
            .on("mouseout", (e, d) => {
                e.target.style.stroke = '';
                e.target.style.stroke_width = '';
                e.target.setAttribute("width", xScale.bandwidth()+(xScale.bandwidth()*0.18));

                tooltip
                    .transition()
                    .duration(400)
                    .style("opacity", 0);
            });


        var yearTicks = []; 
        yearTicks = Array.from(data.monthlyVariance, d => {
                        return d.year;
                    })
                    .filter(d => {
                        if(d%12 ==0 
                            || d == d3.min(data.monthlyVariance, d => d.year) 
                            || d == d3.max(data.monthlyVariance, d => d.year)){
                            if(yearTicks.indexOf(d) == -1)
                            {
                                yearTicks.push(d);
                                return true;   
                            }
                        }
                    });

        var xAxis = d3
            .axisBottom()
            .scale(xScale)
            .tickValues(yearTicks);

        svg
            .append("g")
            .call(xAxis)
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height-padding*3.5})`);
        
        var yAxis = d3
            .axisLeft()
            .scale(yScale)
            .tickValues(yScale.domain())
            .tickFormat((month)=>{
                        let date = new Date(0);
                        date.setUTCMonth(month);
                        let format = d3.timeFormat(`%B`);
                        return format(date);
                    });

        svg
            .append("g")
            .call(yAxis)
            .attr("id", "y-axis")
            .attr("transform", `translate(${padding*4.5}, 0)`);


        document.getElementById('fromYr').innerText = data.monthlyVariance[0].year;  
        document.getElementById('toYr').innerText = data.monthlyVariance[data.monthlyVariance.length-1].year;
        document.getElementById('baseTemp').innerText = data.baseTemperature;
                    



    }
});
