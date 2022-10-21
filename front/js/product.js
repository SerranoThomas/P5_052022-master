//On définit la chaine de requête où l'URLSearchParams va récupérer ses données
const queryString = window.location.search;
//Dans l'URL, on récupère l'ID du produit qui a été selectionné sur la page d'accueil
const productID = new URLSearchParams(queryString).get("id");
console.log(productID);

//On récupère le produit qui a été selectionné
fetch(`http://localhost:3000/api/products/${productID}`)
.then(response => response.json())
.then(selectedProduct => {
        console.log(selectedProduct);

        document.title = selectedProduct.name;

        //On crée une variable image
        const img = document.createElement('img');
        //On y insère les attributs nécessaires
        img.setAttribute("src", selectedProduct.imageUrl);
        img.setAttribute("alt", selectedProduct.altTxt);
        //On ajoute la balise image dans la div prévue à cet effet (bien préciser l'index de la variable emplacementImg car c'est une classe et non un ID)
        let emplacementImg = document.getElementsByClassName("item__img");
        let i = 0;
        emplacementImg[i].appendChild(img);

        //On associe les éléments existants avec les données voulues
        document.getElementById("title").innerText = selectedProduct.name;
        document.getElementById("price").innerText = selectedProduct.price;
        document.getElementById("description").innerText = selectedProduct.description;

        //On créé une <option> pour chaque élément de du array colors
        selectedProduct.colors.forEach(color => {
            let option = document.createElement('option');
            option.setAttribute("value", `${color}`);
            option.innerHTML = color;
            document.getElementById("colors").appendChild(option);
        });
    
    

    //On récupère les données à ajouter dans le panier
    //On sélectionne le bouton "Ajouter au panier"
    const addToCartButton = document.getElementById("addToCart");

    //On écoute l'évènement "clique sur ajouter au panier", qui envoie le choix des users
    addToCartButton.addEventListener("click",(Event) =>{
        Event.preventDefault();
        // on définit les variables qu'on va mettre dans notre panier
        const colorChoice = document.getElementById("colors").value;
        const quantity = document.getElementById("quantity");
        let quantityChoice = Number(quantity.value);

        // Si pas de quantité ni de couleur choisi on affiche un message d'erreur
        if (quantityChoice == undefined || quantityChoice == null || quantityChoice < 1 || quantityChoice > 100 || colorChoice ==="" || colorChoice ==null || colorChoice == undefined){
            alert("Veuillez selectionner une couleur et une quantité valides (entre 1 et 100) pour ce produit");

        //Sinon, on ajoute le produit et ses caractéristiques au panier
        }else{
            //on définit les caractéristiques produit
            const productOption = {
            idProduct: selectedProduct._id,
            colorProduct: colorChoice,
            quantityProduct: quantityChoice,
            nameProduct: selectedProduct.name
            }
            console.log(productOption);

            //Fonction ajouter dans le LS un produit sélectionné par l'utilisatueur, avec ses options (id, couleur, quantité)
            const addProductToLocalStorage = () =>{
                //On créée la variable "found" qui détermine si un objet est déjà présent dans le LS, basé sur son ID et sa couleur
                let found = basket.find(element => {return ((element.idProduct === productOption.idProduct) && (element.colorProduct === productOption.colorProduct))});
                console.log(found);
                    if (found){
                        //Si le produit est déjà présent : on ajoute la quantité sélectionné à celle du panier
                        const total = found.quantityProduct + productOption.quantityProduct;
                        //Si le total dépasse les 100 unités, on affiche un message d'alerte 
                        if(total > 100){
                            alert("La quantité totale d'un produit ne peut pas dépasser 100 unités");
                        }
                        //Sinon, on définit la nouvelle quantité comme celle du panier
                        else{
                        found.quantityProduct = total;
                        //On prévient l'utilisateur que la quantité est bien modifiée
                        alert(`La quantité du produit ${selectedProduct.name} de couleur ${colorChoice} a bien été mise à jour.`);
                        console.log(found.quantityProduct);
                        }

                    } else{
                        //Si le produit n'est pas présent, on ajoute les caractéristiques choisies au LS, et on prévient l'utilisateur
                        basket.push(productOption);
                        alert(`Vous avez bien ajouté ${quantityChoice} ${selectedProduct.name} à votre panier.`)
                    }
                //On stocke ces informations dans le LS, en reprenant les informations panier qu'on met sous format JSON
                localStorage.setItem("panier",JSON.stringify(basket));
            }

            // On déclare la variable "basket" qui correspond au panier, en récupérant les informations JSON de l'item panier
            let basket = JSON.parse(localStorage.getItem("panier"));

            //Si le LS contient déjà des informations, on ajoute un objet à l'array basket
            if(basket){
                addProductToLocalStorage();
                console.log(basket);
            //Sinon, on créée l'array basket et on y ajoute le produit et ses options au LS
            }else{
                basket = [];
                addProductToLocalStorage();
                console.log(basket);
                alert("Vous venez d'ajouter votre premier produit au panier")
            }
           
        }
    })
})
    //On prévoit un message d'erreur en cas de problème
.catch(error => {
    alert("Nous ne trouvons pas l'id du produit sélectionné, veuillez nous excuser");
    console.log(error)
})