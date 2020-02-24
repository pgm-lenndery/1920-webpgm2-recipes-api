/**
 * OEFENING 11
 */

// https://recipepuppyproxy.herokuapp.com/api/?i=onions,garlic
// https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast

const
    addIngredient = document.querySelector('[data-label="addIngredient"]'),
    resultsCount = document.querySelector('[data-label="resultsCount"]'),
    featuredIngredient = document.querySelector('[data-label="featuredIngredient"]'),
    relatedIngredients = document.querySelector('[data-label="relatedIngredients"]');
    // ingredientList = document.querySelector('[data-label="ingredientsSelected"]');

let ingredientInput, ingredientArray = [], loadedResultsArray = [], relatedIngredientsArray = [];

addIngredient.addEventListener('click', () => {
    addIngredients();
});

function printResultsFromSuggested(input) {
    ingredientInput = input;
    // addIngredients(input);
    
    loadedResultsArray = [], relatedIngredientsArray = [];
    relatedIngredients.innerHTML = '';
    
    // define var again    
    // call api
    triggerAPI(); 
    featuredIngredient.innerHTML = ingredientInput;
}

function addIngredients() {
    // reset ui
    loadedResultsArray = [], relatedIngredientsArray = [];
    relatedIngredients.innerHTML = '';
    
    // define var again
    ingredientInput = document.querySelector('[data-label="ingredientInput"]').value;
    
    // call api
    triggerAPI(); 
    featuredIngredient.innerHTML = ingredientInput;
    // ingredientArray.push(ingredientInput.toLowerCase()); // add ingredient from input to array
    // generateList(0); // add ingredient to html as <li>
}

let fetchDataFromURl = (url, format) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = format;
    xhr.open('GET', url);
    xhr.send();
    xhr.onerror = () => {console.warn(`Jammer mut`)}
    xhr.onprogress = (event) => {console.warn(`Geduld mut`)}
    xhr.onload = () => {
        console.warn('Ajjuu chaud mut');
        let status = xhr.status;
        console.warn(status);
        if (status == 200) {
            result = xhr.response;
            generateResults(result)
        } else {
            console.warn(`Dedju mut`);
        }
    }
}

function triggerAPI() {    
    document.querySelector('[data-label="results"]').innerHTML = '';
    fetchDataFromURl(`https://recipepuppyproxy.herokuapp.com/api/?i=${ingredientInput}`, 'json');
    console.log(`https://recipepuppyproxy.herokuapp.com/api/?i=${ingredientInput}`)
    
    fetchDataFromURl(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientInput}`, 'json');
    console.log(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientInput}`)
}

function generateResults(result) {
    let maxTitleLength = 25;
    if (result.meals) {
        result.meals.forEach((i) => {
            loadedResultsArray.push({
                title: i.strMeal,
                thumb: i.strMealThumb,
                ingredients: null,
                href: `https://www.themealdb.com/meal/${i.idMeal}`,
                source: 'themealdb'
            });
            
        })
    } else {
        result.results.forEach((i) => {
            loadedResultsArray.push({
                title: i.title,
                thumb: i.thumbnail,
                ingredients: i.ingredients,
                href: i.href,
                source: 'recipepuppy'
            });
            i.ingredients.split(',').map(x => {
                x = x.trim();
                relatedIngredientsArray.push(x);
            })
        })
        relatedIngredientsArray = relatedIngredientsArray.filter(function (i, index) {
            return relatedIngredientsArray.indexOf(i) === index;
        });
        
    }
    
    loadedResultsArray.sort(function(a, b){return a-b});
    loadedResultsArray.forEach(i => {
        let a = document.createElement('a');
        a.href = i.href;
        a.target = '_blank'
        a.classList.add('result', 'flex-grid-item')
        a.innerHTML = `
        <div class="result-thumb">
            <img class="result-thumb-img" src="${i.thumb}">
        </div>
        <div class="result-body">
            <h3 class="result-href">${i.title.length > maxTitleLength ? i.title.substring(0,maxTitleLength) + '...' : i.title}</h3>
            <p class="result-ingredients-list">${i.ingredients !== null ? i.ingredients : '...'}</p>
        </div>
        `
        document.querySelector('[data-label="results"]').appendChild(a);
    })
    resultsCount.innerHTML = loadedResultsArray.length;
    
    if (loadedResultsArray.length >= 1) {
        relatedIngredientsArray.map(i => {
            let li = document.createElement('li');
            li.innerHTML = i;
            li.addEventListener('click', () => {
                printResultsFromSuggested(i);
            });
            relatedIngredients.appendChild(li);
        })
    } else {
        relatedIngredients.innerHTML = 'no related ingredients to show';
    }
}