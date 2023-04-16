
fetch("https://evaluation-du-personnel.onrender.com/evaluation/evaluerChart")
.then(reponse=>reponse.json())
.then(reponse=>{
    
    const evaluations = reponse
    const evaluationsByMonth = {};
    evaluations.forEach(evaluation => {
    const month = evaluation.mois;
    const total = evaluation.totalMois
    if (evaluationsByMonth[month]) {
        evaluationsByMonth[month].total += total;
        evaluationsByMonth[month].count += 1;
    } else {
        evaluationsByMonth[month] = { total: total, count: 1 };
    }
    });
    const averageByMonth = Object.keys(evaluationsByMonth).map(month => {
    return {
        x: month,
        y: Math.round(evaluationsByMonth[month].total / evaluationsByMonth[month].count)
    };
    });
    let categories = []
    const Mois = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"]
    for (let i = 0; i < Mois.length; i++) {
        let comparaisonInitialLenght = categories.length
        for (let j = 0; j <averageByMonth.length ; j++) {
            if(Mois[i]===averageByMonth[j].x){
                categories.push(averageByMonth[j].y)
            }
        }
        if(categories.length == 0){
            categories.push(0)
        }
        if(categories.length==comparaisonInitialLenght){
            categories.splice(i,0,0)
        }

        
    }

    console.log(averageByMonth)
    console.log(categories)
    const options = {
        chart:
         {toolbar: {
            show: true,
            tools: {
                download: true,
                selection: true,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: false 
            }
        },
          height: 350,
          width:500,
          type: "line",
          stacked: false
        },
        dataLabels: {
          enabled: false
        },
        colors: ['#475BE8', '#CFC8FF', '#66C7F4'],
        series: [
          
          {
            name: 'Moyenne du mois',
            type:'column',
            data: categories,
          },
          
        ],
        stroke: {
          width: [4, 4, 4]
        },
        plotOptions: {
          bar: {
            columnWidth: "20%"
          }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        title: {
            text: 'Moyenne mensuelle des évaluations obtenues',
            align: 'center',
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
            },
          },
        yaxis: [
          {
            seriesName: 'Moyenne du mois',
            axisTicks: {
              show: true
            },
            axisBorder: {
              show: true,
            },
            title: {
              text: 'Moyenne générale par mois',
            }
          },
          {
            seriesName: 'Mois dernier',
            show: false
          }, 
        ],
        fill: {
          opacity: 1,
        },
        
        tooltip: {
          y: {
            formatter(val) {
              return `${val} `;
            },
          },
        },
        legend: {
          horizontalAlign: "left",
          offsetX: 40
        }
      };
      
      const chart = new ApexCharts(document.querySelector("#chart"), options);
      
      chart.render();
})
.catch(error => console.log(error));

