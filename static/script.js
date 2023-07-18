document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const currentURL = window.location.href
    const searchInput = document.getElementById('food-search');
    const resultsList = document.getElementById('results');
    const filterButtons = document.querySelectorAll('#filter');

    let timerId;

    if (currentPath === '/index.html' || currentPath === '/') {
        searchInput.addEventListener('input', () => {
            clearTimeout(timerId)
            timerId = setTimeout(() => {
                const query = searchInput.value;
                if (query.length >= 3) {
                    fetch('/', {
                        method: 'POST',
                        body: new URLSearchParams({ 'food-search': query })
                    })
                    .then(response => response.json())
                    .then(results => {
                        displaySearch(results);
                        addFood();
                    });
                } else {
                    clearResults();
                }
            }, 300);
        });
    }

    function displaySearch(results) {
        clearResults();
        console.log(results)
        results.forEach(result => {
            // maybe I can make a list item or some other element that has a button inside of it, along with image kcals, etc. 
            // right now its just a button
            const button = document.createElement('button')
            if (Object.values(result)[0] == 'common') {
                const resultText = Object.values(result)[1]; // index needs to be food_name
                button.textContent = resultText;
                button.setAttribute('data-type', 'common')
                button.setAttribute('value', Object.values(result)[2]) // index needs to be search_id             
            }
            else if (Object.values(result)[0] == 'branded') {
                const resultText = Object.values(result)[3]; // index needs to be food_name
                button.textContent = resultText;                
                button.setAttribute('data-type', 'branded')
                button.setAttribute('value', Object.values(result)[4]) // index needs to be search_id 
            }
            resultsList.appendChild(button);
        });
    }
    
    function clearResults() {
        resultsList.innerHTML = '';
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          const category = button.dataset.type;
          filter(category);
        });
    })

    function filter(category) {     
        const displayedItems = Array.from(resultsList.querySelectorAll('button'));  
        
        displayedItems.forEach(item => {
            if (category === 'all') {
              item.style.display = 'block';
            } else if (item.dataset.type === category) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
    }

    function addFood() {
        const nutrientButtons = Array.from(resultsList.querySelectorAll('button'));
        nutrientButtons.forEach(button => {
          button.addEventListener('click', () => {
            const query = button.value;
            const category = button.getAttribute("data-type")
            switchWindow(query, category)
          })
        });
        
    }
      
    function switchWindow(query, category) {
        const url = `/add?add-food=${query}&category=${category}`;
        window.location.assign(url);
    }

    if (currentURL.includes("/add?add-food=")) {
        const flaskResults = document.getElementById("APIresults").getAttribute("data-api-results")
        const jsResults = JSON.parse(flaskResults)

        const keys = Object.keys(jsResults);
        keys.forEach(key => {
            if (key === 'photo') {
                const ids = document.querySelectorAll('#' + key);
                for (let i = 0; i < ids.length; i++) {
                    ids[i].src = jsResults[key];
                }
            }    
            else if (key === 'alt_measures') {
                const measuresKey = jsResults[key];
                console.log(measuresKey)
                // left off here
            }
            else {
                const ids = document.querySelectorAll('#' + key);
                for (let i = 0; i < ids.length; i++) {
                    ids[i].textContent = jsResults[key];
                }
            }
        });

        var options = {
            showServingUnitQuantity : true,
            showServingWeightGrams : true,
            showAmountPerServing : false,
            showCalorieDiet : false,
            showIngredients : false,
            showItemName : false,
            itemName : jsResults.food_name,

            decimalPlacesForNutrition : 1,
            allowFDARounding : true,
        
            showPolyFat : false,
            showMonoFat : false,
            showTransFat : false,
            showVitaminD : false,
            showPotassium_2018 : false,
            showCalcium : false,
            showIron : false,
            showFatCalories : false,
            showCaffeine : false,

            valueServingUnitQuantity : jsResults.serving_qty,
            valueServingSizeUnit : jsResults.serving_unit,
            valueServingWeightGrams : jsResults.serving_weight_grams,
        
            valueCalories : jsResults.nf_calories,
            valueTotalFat : jsResults.nf_total_fat,
            valueSatFat : jsResults.nf_saturated_fat,
            valueCholesterol : jsResults.nf_cholesterol,
            valueSodium : jsResults.nf_sodium,
            valueTotalCarb : jsResults.nf_total_carbohydrate,
            valueFibers : jsResults.nf_dietary_fiber,
            valueSugars : jsResults.nf_sugars,
            valueProteins : jsResults.nf_protein,
            valueVitaminD : "no functionality",
            valuePotassium_2018 : "no functionality",
            valueCalcium : "no functionality",
            valueIron : "no functionality",
            showLegacyVersion : false
        }

        // if added sugars is not included, set the added sugar option to true
        // else (it is included) show the value of added sugars
        if (typeof jsResults.nf_added_sugars === 'undefined') {
            options.naAddedSugars = true;
        } else {
            options.valueAddedSugars = jsResults.nf_added_sugars;
        }
        
        // jquery plugin to create an FDA-like nutrition label. 
        // options var holds the sesttings for the plugin so added sugars can be toggled
        $('#nutritionLabel').nutritionLabel(options);
        $('#nutritionLabel2').nutritionLabel(options);        
    }
    
});
