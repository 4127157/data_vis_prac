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

        let height = 900,
            width = 2100, 
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
            .range([0, width]);
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
            .range([0,height])
            .nice();

        console.log(d3.extent(data.monthlyVariance, d => d.month));
        console.log(yScale(2));

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
            .attr(`height`, yScale(2))
            .attr(`width`, (width/(d3.max(data.monthlyVariance,d => d.year)
                                 -d3.min(data.monthlyVariance, d=> d.year))
                            ));


    }

});
