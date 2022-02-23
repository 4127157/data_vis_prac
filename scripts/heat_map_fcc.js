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
            .scaleTime()
            .domain(d3.extent(data.monthlyVariance, d=> d.year)
                .map((item, i) => {
                    if(i==0){
                        return new Date(item, 0);
                    } else {
                        return new Date(item+1, 0);
                    }
                }))
            .range([padding*4, width-padding]);
/*      console.log(xScale(new Date(1867,0)));*/
        

        const yScale = d3
            .scaleLinear()
            .domain(d3.extent(data.monthlyVariance, d => d.month)
                .map((d,i)=> {
                    if(i==0){
                        return d;
                    } else {
                        return d+1;
                    }
                }))
            .range([padding,height-padding*4]);

        /*TODO: 
         *      3) Add padding 
         *      4) Create axes before legend and colourisation(important)
         *      5) Thoroughly investigate legend and add
         *      6) Make colour system that is not simply hardcoded array(borrow
         *      from random quote project if needed)*/

        svg
            .selectAll(".cell")
            .data(data.monthlyVariance)
            .enter()
            .append("rect")
            .attr(`class`, `.cell`)
            .attr(`x`, d => xScale(new Date(d.year,0)))
            .attr(`y`, d => yScale(d.month))
            .style(`fill`, (d) => {
                if(d.year%2 == 0){
                    return "black";
                } else {
                    return "yellow";
                }
            })
            .attr(`height`, (height-padding*4)/12)
            .attr(`width`, ((width-padding*5)/(d3.max(data.monthlyVariance,d => d.year)
                                 -d3.min(data.monthlyVariance, d=> d.year))
            ));


        var tempArr = [];
        console.log(Array.from(data.monthlyVariance, d => {
                        return d.year;
                    })
                    .filter(d => {
                        if(d%10 ==0 
                            || d == d3.min(data.monthlyVariance, d => d.year) 
                            || d == d3.max(data.monthlyVariance, d => d.year)){
                            if(tempArr.indexOf(d) == -1)
                            {
                                tempArr.push(d);
                                return true;   
                            }
                        }
                    }));
        console.log(tempArr);


        var xAxis = d3
            .axisBottom()
            .scale(xScale)
            .tickArguments([d3.timeYear.every(13)]);



        svg
            .append("g")
            .call(xAxis)
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height-padding*3.5})`);
        

        var yAxis = d3
            .axisLeft()
            .scale(yScale);

        svg
            .append("g")
            .call(yAxis)
            .attr("id", "y-axis")
            .attr("transform", `translate(${padding*3.5}, 0)`);
    }

});
