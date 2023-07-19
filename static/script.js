document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const currentURL = window.location.href
    const searchInput = document.getElementById('food-search');
    const resultsContainer = document.getElementById('results-container');
    const filterButtons = document.querySelectorAll('#filter');
    const resultsWrapper = document.getElementById('results-wrapper')

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
        resultsWrapper.style.display = 'block';
        results.forEach(result => {
          const buttonItemContainer = document.createElement('button');
          buttonItemContainer.setAttribute('class', 'item-container');
          buttonItemContainer.setAttribute('data-type', result.a1);
          buttonItemContainer.setAttribute('value', result.search_id);
          resultsContainer.appendChild(buttonItemContainer);
      
          const divItemThumbnail = document.createElement('div');
          divItemThumbnail.setAttribute('class', 'item-thumbnail');
          buttonItemContainer.appendChild(divItemThumbnail);
      
          const img = document.createElement('img');
          img.setAttribute('class', 'item-image');
          img.setAttribute('src', result.thumb);
          divItemThumbnail.appendChild(img);
      
          const itemContent = document.createElement('div');
          itemContent.setAttribute('class', 'item-content');
          buttonItemContainer.appendChild(itemContent);
      
          const itemLeftContent = document.createElement('div');
          itemLeftContent.setAttribute('class', 'item-left-content');
          itemContent.appendChild(itemLeftContent);
      
          const itemFoodName = document.createElement('div');
          itemFoodName.setAttribute('class', 'item-food-name');
          itemFoodName.textContent = result.food_name
          itemLeftContent.appendChild(itemFoodName);
      
          const itemBrandName = document.createElement('div');
          itemBrandName.setAttribute('class', 'item-brand-name');
          itemBrandName.textContent = result.brand_name
          itemLeftContent.appendChild(itemBrandName);

          const itemRightContent = document.createElement('div');
          itemRightContent.setAttribute('class', 'item-right-content');
          itemContent.appendChild(itemRightContent);

          const itemCalories = document.createElement('div');
          itemCalories.setAttribute('class', 'item-calories');
          itemCalories.textContent = result.calories
          itemRightContent.appendChild(itemCalories);

          const itemCals = document.createElement('div');
          itemCals.setAttribute('class', 'item-cals');
          itemCals.textContent = "cals"
          itemRightContent.appendChild(itemCals);
        });
      }
      
    
    function clearResults() {
        resultsContainer.innerHTML = '';
        resultsWrapper.style.display = 'none';
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          const category = button.dataset.type;
          filter(category);
        });
    })

    function filter(category) {     
        const displayedItems = Array.from(resultsContainer.querySelectorAll('button'));  
        
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
        const nutrientButtons = Array.from(resultsContainer.querySelectorAll('button'));
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
