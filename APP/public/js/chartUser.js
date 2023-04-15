fetch("http://localhost:8080/evaluation/evaluerChart")
.then(reponse=>reponse.json())
.then(reponse=>{
    console.log(reponse)
    const totals = {};
})
.catch(error => console.log(error));