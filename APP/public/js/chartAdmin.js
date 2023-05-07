
fetch("https://evaluation-m5m1.onrender.com/evaluation/evaluerChart")
.then(reponse=>reponse.json())
.then(data => {
  // Tableau avec tous les mois de l'année
const moisDeLAnnee = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

const donneesCharte = moisDeLAnnee.map((mois) => {
  const moyenne = data.find((moyenneParMois) => moyenneParMois._id === mois);
  return {
    x: mois,
    y: moyenne ? Math.round(moyenne.moyenne) : 0
  }
});
console.log(donneesCharte)
// Création de la charte avec ApexCharts
const chart = new ApexCharts(document.querySelector("#chart"), {
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
          width:"90%",
          type: "bar",
          stacked: false
        },
        dataLabels: {
          enabled: false
        },
  series: [
    {
      name: "Moyenne",
      data: donneesCharte
    }
  ],
  xaxis: {
    categories: moisDeLAnnee
  },
  plotOptions: {
    bar: {
      columnWidth: "40%"
    }
  },
  title: {
    text: 'Moyenne générale mensuelle de toutes les évaluations',
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
});

// Affichage de la charte
chart.render();

  
})
.catch(error => console.log(error));

