fetch("https://evaluation-m5m1.onrender.com/evaluation/observation")
  .then(response => response.json())
  .then(employes => {
    // console.log(employes)
    const table = document.querySelector("#example");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    // Créer un objet qui stocke l'état d'évaluation pour chaque employé
    const employeeEvaluationStatus = {};
    employes.forEach(employe => {
      employeeEvaluationStatus[employe._id] = {};
      employe.allMyObservationOnMe.forEach(evaluation => {
        employeeEvaluationStatus[employe._id][evaluation.mois] = true;
      });
    });

    // Créer les lignes du tableau pour chaque employé
    employes.forEach(employe => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <th scope="row">${employe.nom} ${employe.prenom}</th>
        <td class="${employeeEvaluationStatus[employe._id]['janvier'] ? 'evaluated' : ''}"><a type="button" class="btn1 invisible-link" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}"> clique</a></td>
        <td class="${employeeEvaluationStatus[employe._id]['février'] ? 'evaluated' : ''}"><a type="button" class="btn1 invisible-link" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">clique</a></td>
        <td class="${employeeEvaluationStatus[employe._id]['mars'] ? 'evaluated' : ''}"><a type="button" class="btn1 invisible-link" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">clique</a></td>
        <td class="${employeeEvaluationStatus[employe._id]['avril'] ? 'evaluated' : ''}"><a type="button" class="btn1 invisible-link" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">clique</a></td>
        <td class="${employeeEvaluationStatus[employe._id]['mai'] ? 'evaluated' : ''}"><a type="button" class="btn1 invisible-link" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">clique</a></td>
        <td class="${employeeEvaluationStatus[employe._id]['juin'] ? 'evaluated' : ''}"><a type="button" class="btn1 invisible-link" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">clique</a></td>
        <td class="${employeeEvaluationStatus[employe._id]['juillet'] ? 'evaluated' : ''}"><a type="button" class="btn1 invisible-link" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">clique</a></td>
        <td class="${employeeEvaluationStatus[employe._id]['août'] ? 'evaluated' : ''}"><a type="button" class="btn1 invisible-link" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">clique</a></td>
        <td class="${employeeEvaluationStatus[employe._id]['septembre'] ? 'evaluated' : ''}"><a type="button" class="btn1 invisible-link" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">clique</a></td>
        <td class="${employeeEvaluationStatus[employe._id]['octobre'] ? 'evaluated' : ''}"><a type="button" class="btn1 invisible-link" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">clique</a></td>
        <td class="${employeeEvaluationStatus[employe._id]['novembre'] ? 'evaluated' : ''}"><a type="button" class="btn1 invisible-link" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">clique</a></td>
        <td class="${employeeEvaluationStatus[employe._id]['décembre'] ? 'evaluated' : ''}"><a type="button" class="btn1 invisible-link" data-toggle="modal" data-target="#exampleModal" data-whatever="${employe.nom} ${employe.prenom}">clique</a></td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(error => console.log(error));
