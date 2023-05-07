fetch("https://evaluation-m5m1.onrender.com/user/listEmployeAdmin")
  .then(response => response.json())
  .then(employes => {
    // console.log(employes)
    const table = document.querySelector("#example");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

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
