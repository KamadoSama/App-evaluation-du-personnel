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
  fetch("https://evaluation-du-personnel.onrender.com/evaluation/affiche")
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
       
            <td><a type="button" class="btn1" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">${employe.nom}</a></td>
            <td> <a type="button" class="btn1" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">${employe.prenom}</a></td>
            <td>   <a type="button" class="btn1" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">${evaluation.mois}</a></td>
            <td>   <a type="button" class="btn1" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">${evaluation.ponctualite}</a></td>
            <td>   <a type="button" class="btn1" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">${evaluation.sociabilite}</a></td>
            <td>   <a type="button" class="btn1" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">${evaluation.respectFichePoste}</a></td>
            <td>   <a type="button" class="btn1" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">${evaluation.participatif}</a></td>
            <td>   <a type="button" class="btn1" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">${evaluation.totalMois}</a></td>
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
  