const select = document.querySelector("#inputGroupSelect01");
const table = document.querySelector("#example");
const mois = document.querySelectorAll(".mois");
console.log(mois)
/*select.addEventListener("change", (e) => {
  const selectedMonth = e.target.value;
  console.log(selectedMonth)
  
  
  for (let i = 0; i < mois.length; i++) {
    const row = mois[i];
    const month = row.innerText;
    console.log(month)
    if (month !== selectedMonth) {
      row.parentNode.parentNode.style.display = "none";
    } else {
      row.parentNode.parentNode.style.display ="";
    }
  }
});
*/
select.addEventListener("change",(e)=>{
  const selectedMonth = e.target.value;
  fetch("https://evaluation-m5m1.onrender.com/evaluation/affiche")
  .then(reponse=>reponse.json())
  .then(employe=>{
    console.log(employe)
    const table = document.querySelector("#example");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    employe.forEach((employe) => {
      employe.allEvaluationOnMe.forEach((evaluation)=>{
        
        if(selectedMonth===evaluation.mois){
          const row = document.createElement("tr");  
          row.innerHTML = `
       
            <td>${employe.nom}</td>
            <td> ${employe.prenom}</td>
            <td>   ${evaluation.mois}</td>
            <td>   ${evaluation.ponctualite}</td>
            <td>   ${evaluation.sociabilite}</td>
            <td>   ${evaluation.respectFichePoste}</td>
            <td>   ${evaluation.participatif}</td>
            <td>   ${evaluation.totalMois}</td>
            `;
          tbody.appendChild(row);
          
        }else{
          // while (tbody.firstChild) {
          //   tbody.removeChild(tbody.firstChild);
          // }
        }
      })  
      
    });
    
  })
  .catch(error=>console.log(error))
})
  