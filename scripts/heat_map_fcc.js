window.addEventListener("DOMContentLoaded", () => {
    var visHolder = document.getElementById(`visHolder`);

    fetch(`https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json`)
        .then((res)=>{
            if(res.ok){
                res.json().then((data)=>{
                    initSvg(data);
                });
            } else {
                visHolder.innerText = `There seems to be an error: ${res.status} ${res.statusText}`;
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

        const svg = d3
            .select(`#visHolder`)
            .append(`svg`)
            .attr(`preserveAspectRatio`, `xMinYMin meet`)
            .attr(`viewBox`, `0 0 ${width} ${height}`);

       /* console.log(data.monthlyVariance[0].year);*/
        const xScale = d3
            .scaleBand()
            .domain(Array.from(data.monthlyVariance, d=> d.year))
                // // .map((item, i) => {
                //     if(i==0){
                        // return new Date(item, 0);
                    // } else {
                        // return new Date(item+1, 0);
                    // }
                // }))
            .range([padding*5, (width-padding)]);
/*      console.log(xScale(new Date(1867,0)));*/
        

        const yScale = d3
            .scaleBand()
            .domain(Array.from(data.monthlyVariance, d => d.month)
                .map((d,i)=> {
                        return d;
                    
                }))
            .range([padding,height-padding*4]);

        /*TODO: 
         *      5) Make colour system that is not simply hardcoded array(borrow
         *      from random quote project if needed)
         *      6) Thoroughly investigate legend and add*/

        
        const getFillColor = (variance) => {
            let maxVar = d3.max(data.monthlyVariance, d => d.variance);
            let minVar = d3.min(data.monthlyVariance, d => d.variance);

            const getColdTemp = () => {
                let hue = 213,
                    sat = 100,
                    light = 20;
                return `hsl(${hue}, ${sat}%, ${light}%)`;
            }

            const getHotTemp = () => {
                let hue = 18,
                    sat = 100,
                    light = 25;
                return `hsl(${hue}, ${sat}%, ${light}%)`;
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
            .attr(`y`, d => yScale(d.month))
            .style(`fill`, d => { 
                console.log(getFillColor(d.variance));
                return getFillColor(d.variance);
            })
            .attr(`height`, yScale.bandwidth()+(yScale.bandwidth()*0.015) )
            .attr(`width`, xScale.bandwidth()+(xScale.bandwidth()*0.18));


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
        console.log(yearTicks);


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
            // .tickArguments(["January", "February", "March", "April", "May", "June",
            //         "July", "August", "September", "October", "November", "December"]);

        svg
            .append("g")
            .call(yAxis)
            .attr("id", "y-axis")
            .attr("transform", `translate(${padding*4.5}, 0)`);

    }

});
