// On sélectionne l'emplacement dans lequel on va afficher nos produits. Ici dans la section avec l'id "items".
const Items = document.querySelector('#items');

//On récupère toutes les données de l'API 
fetch("http://localhost:3000/api/products")
  .then(response => response.json())
  .then(products => {
    console.log(products)

    //On met ces données dans une constante Product
    for (const Product of products){
    console.log(Product);
    
    // On cré les éléments html de la page index.html et on y insère les données récupérées de l'API, pour enfin les placer dans la balise voulue
    let newLink = document.createElement('a');
    newLink.setAttribute("href", `./product.html?id=${Product._id}`);
    Items.appendChild(newLink);

    let newArticle = document.createElement('article');
    newLink.appendChild(newArticle);

    let newImg = document.createElement('img');
    newImg.setAttribute("src", Product.imageUrl);
    newImg.setAttribute("alt", Product.altTxt);
    newArticle.appendChild(newImg);

    let newH3 = document.createElement('h3');
    newH3.setAttribute("class","productName");
    newH3.innerText = Product.name;
    newArticle.appendChild(newH3);

    let newP = document.createElement('p');
    newP.setAttribute("class", "productDescription");
    newP.innerText = Product.description;
    newArticle.appendChild(newP);
   }})

   //On prévoit un message d'erreur en cas de problème
   .catch(rejected => {
    alert("Une erreur est survenue, nous ne parvenons pas à charger notre catalogue. Veuillez nous excuser pour ce contretemps");
    console.log (rejected);
   })