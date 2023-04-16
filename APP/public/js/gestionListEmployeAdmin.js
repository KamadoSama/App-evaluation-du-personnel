fetch("http://localhost:8080/user/listEmployeAdmin")
  .then(response => response.json())
  .then(employes => {
    console.log(employes)
    const table = document.querySelector("#example");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    // Créer un objet qui stocke l'état d'évaluation pour chaque employé
    const employeeEvaluationStatus = {};
    /*employes.forEach(employe => {
      employeeEvaluationStatus[employe._id] = {};
      employe.allEvaluationOnMe.forEach(evaluation => {
        employeeEvaluationStatus[employe._id][evaluation.mois] = true;
      });
    });*/
    // Créer les lignes du tableau pour chaque employé
    const moisArray =  ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"]
    employes.forEach(employe => {
      const row = document.createElement("tr");
  
      row.innerHTML = `
    <th scope="row">${employe.nom} ${employe.prenom}</th>
    
    ${moisArray.map(mois => {
      const moyenne = employe.moyennesParMois.find(item => item.mois === mois);
      return `<td>${moyenne ? moyenne.moyenne : ''}</td>`;
    }).join('')}
    <td>${employe.moyenneAnnuelle}</td>
  `;
      tbody.appendChild(row);
    });
  })
  .catch(error => console.log(error));
