
window.addEventListener("load",()=>{
  fetch("http://localhost:8080/evaluation/affiche")
  .then(reponse=>reponse.json())
  .then(employe=>{
    // console.log(employe)
    const select = document.querySelector("#inputGroupSelect02");
    employe.forEach((employe) => {
      const option = document.createElement("option");  
      option.innerHTML = `${employe.nom} ${employe.prenom}`;
      option.value = `${employe.nom} ${employe.prenom}`
      
      select.appendChild(option);
      
    });  
  })
  .catch(error=>console.log(error))
})


const tableBody = document.querySelector('#example tbody');

// Fonction qui crée une cellule de tableau et y insère le contenu spécifié
function createTableCell(content) {
  const cell = document.createElement('td');
  cell.textContent = content;
  return cell;
}

const select = document.querySelector("#inputGroupSelect02");
const div = document.querySelector("#participatif")
select.addEventListener("change",(e)=>{
  div.innerHTML = ` <button id="button-participation" type="button" class="btn btn-primary mx-auto" data-toggle="modal" data-target="#exampleModal" data-whatever="${e.target.value}">Attribuer une note de Participation</button>`
})

select.addEventListener('change',(e)=>{
  const fullName = e.target.value.split(" ");
  data = {nom:fullName[0],prenom:fullName[1]}
  // console.log(data)
  fetch("http://localhost:8080/evaluation/afficheParticipatif", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response=>response.json())
  .then(participatif=>{
    // console.log(participatif)
    const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    for (let i = 0; i < 12; i++) {
      const month = months[i] ; // Utilisez moment.js pour formater le mois
      const monthNotes = participatif.filter(item => item.mois === month)[0]; // Récupérez les notes participatives de ce mois
      // console.log(monthNotes)
      // Parcourir chaque semaine du mois et afficher les notes participatives correspondantes dans les cellules du tableau
      for (let j = 1; j <= 4; j++) {
        const weekCell = document.createElement('td');
        const weekNumber = j;
        const note = monthNotes.note[j-1];
        weekCell.textContent = note;
        const weekRow = tableBody.querySelector(`tr:nth-child(${j})`);
        weekRow.appendChild(weekCell);
      }
    }
    
  })
})


/**/