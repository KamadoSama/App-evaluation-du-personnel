
      const form = document.querySelector("#form-evaluation");

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const jsonObject = {};

        for (const [key, value] of formData.entries()) {
          jsonObject[key] = value;
        }
        for (const key in jsonObject) {
          
        }
        console.log(jsonObject);
        /*fetch("http://localhost:3000/mon-api-get", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          if (response.ok) {
            // affichage d'un message de réussite
            alert("Produit enregistré !");
            // window.location.href = "../index.html";
          } else {
            // affichage d'un message d'erreur
            alert("Erreur lors de l'enregistrement du produit");
          }
        });*/
      });
    