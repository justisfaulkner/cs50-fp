document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const currentURL = window.location.href
    const searchInput = document.getElementById('food-search');
    const searchForm = document.getElementById('search-form')
    const resultsContainer = document.getElementById('results-container');
    const filterButtons = document.querySelectorAll('#filter');
    const resultsWrapper = document.getElementById('results-wrapper')

    if (currentPath === '/index.html' || currentPath === '/') {
        // intialize document elements relating to current day div/previous day btn/next day btn/today btn
        const prevDayBtn = document.getElementById("prev-day-btn");
        const nextDayBtn = document.getElementById("next-day-btn");
        const currentDayDiv = document.getElementById("current-day");
        const currentDayBtn = document.getElementById("current-day-btn");

        // initialize the current date
        const today = new Date();
        updateCurrentDay(today);

        // format date to Day, Month Year
        function formatDate(date) {
            const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            // split the formatted date into components
            const parts = formattedDate.split(', ');
            // join the components back together without the comma
            return parts[0] + ' ' + parts[1] + ', ' + parts[2];
        }

        // format date to YYYY-MM-DD
        function formatDateValue(date) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            const [month, day, year] = formattedDate.split('/');
            return `${year}-${month}-${day}`;
        }    

        // function to display current day
        function updateCurrentDay (date) {
            currentDayDiv.textContent = formatDate(date);
            currentDayDiv.dataset.vis = formatDateValue(date);
        }

        // function to handle previous day button click
        prevDayBtn.addEventListener('click', () => {
            const currentDay = new Date(currentDayDiv.textContent);
            const previousDay = new Date(currentDay);
            previousDay.setDate(currentDay.getDate() - 1);
            updateCurrentDay(previousDay);
        });
    
        // function to handle next day button click
        nextDayBtn.addEventListener('click', () => {
            const currentDay = new Date(currentDayDiv.textContent);
            const nextDay = new Date(currentDay);
            nextDay.setDate(currentDay.getDate() + 1);
            updateCurrentDay(nextDay);
        });

        // function to handle current day button click
        currentDayBtn.addEventListener('click', () => {
            const today = new Date();
            updateCurrentDay(today)
        });

        // Function to handle changes to the data-vis attribute
        function handleCurrentDayChange(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-vis') {
            const newValue = mutation.target.getAttribute('data-vis');
            
            //function to show/hide food results based on date
            const foodItems = document.querySelectorAll('.food-item')
            let allHidden = true;
            foodItems.forEach((item) => {
                const foodItemDate = item.getAttribute('data-vis')
                const selectedDayDate = newValue
                if (foodItemDate === selectedDayDate) {
                    item.style.display = "flex"
                }
                else {
                    item.style.display = "none"
                }
            });
            }
        }
        }
    
        // Create a new MutationObserver
        const observer = new MutationObserver(handleCurrentDayChange);

        // Start observing changes to the data-vis attribute of the currentDayDiv
        observer.observe(currentDayDiv, { attributes: true });

        // when index loads "click" today button so show/hide food code is triggered
        // dom content loaded already at top enclosing everything
        const CurrentDayBtnClickEvent = new Event('click', { bubbles: true});
        currentDayBtn.dispatchEvent(CurrentDayBtnClickEvent)
    }
    
    // function to disallow submission on search instant form (it autoupdates, submission would results in plaintext JSON)
    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
    });

    // function to implement search instant and autodisplay results
    // TO DO: need to figure out how to allow this on every page

    let timerId;

    if (currentPath === '/index.html' || currentPath === '/') {
        searchInput.addEventListener('input', () => {
            clearTimeout(timerId)
            timerId = setTimeout(() => {
                const query = searchInput.value;
                if (query.length >= 3) {
                    fetch('/', {
                        method: 'POST',
                        headers: { 'request_type': 'search_instant' },
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
          buttonItemContainer.setAttribute('data-thumb', result.thumb);
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

    function hideResultsWrapper(event) {
        const targetElement = event.target;
        
        // Check if the clicked element is the container or a child element of the container
        if (!resultsWrapper.contains(targetElement) && !searchForm.contains(targetElement)) {
          resultsWrapper.style.display = 'none'; // Hide the container
        }
      }
      
      function showResultsWrapper() {
        if (resultsContainer.children.length > 0) {
            resultsWrapper.style.display = 'block'; // Show the container
        }
        
      }
      
      // Listen for click events on the window
      window.addEventListener('mousedown', hideResultsWrapper);
      
      // Listen for focus event on the search input
      searchInput.addEventListener('focus', showResultsWrapper);

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

            // for add.html to get info into database
            // setting items in local storage on index.html so I can access on add.html
            localStorage.setItem('a1', button.getAttribute("data-type"));
            localStorage.setItem('search_id', button.value);
            localStorage.setItem('thumb', button.getAttribute("data-thumb"));

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
        console.log(flaskResults)
        const jsResults = JSON.parse(flaskResults)
        console.log(jsResults)

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
        // options var holds the settings for the plugin so added sugars can be toggled
        $('#nutritionLabel').nutritionLabel(options);
    }
    
    const modalForm = document.getElementById('add-food-form')
    // prevent user from hitting enter in the form
    modalForm.addEventListener('keydown', function(event) {
        if (event.key === 'Enter'){
            event.preventDefault();
        }
    });

    // prevent user from submitting form without selecting a meal-type
    modalForm.addEventListener('submit', function(event) {
        const mealTypeButtons = document.querySelectorAll('.meal-type-btn');
        const hasActiveButton = Array.from(mealTypeButtons).some((button) => button.classList.contains('active'));
        
        if (!hasActiveButton) {
            document.getElementById('meal-alert').style.display = 'flex';
            event.preventDefault();
        }

        modalForm.addEventListener('click', function(event) {
            if (hasActiveButton) {
                document.getElementById('meal-alert').style.display = 'flex';
            }
        });

    });

    // add event listner to add-food button for modal popup and put 1 in for serving qty value so it formats correctly 
    const modalTrigger = document.getElementById('modal-trigger')
    const modalInput = document.getElementById('modal-serving-qty');

    const modalCalories = document.getElementById('nf_calories');
    const modalTotalFat = document.getElementById('nf_total_fat');
    const modalSatFat = document.getElementById('nf_saturated_fat');
    const modalCholesterol = document.getElementById('nf_cholesterol');
    const modalSodium = document.getElementById('nf_sodium');
    const modalCarbs = document.getElementById('nf_total_carbohydrate');
    const modalFiber = document.getElementById('nf_dietary_fiber');
    const modalSugars = document.getElementById('nf_sugars');
    const modalProtein = document.getElementById('nf_protein');
    
    const nfCalories = parseFloat(modalCalories.textContent, 10);
    const nfTotalFat = parseFloat(modalTotalFat.textContent, 10);
    const nfSatFat = parseFloat(modalSatFat.textContent, 10);
    const nfCholesterol = parseFloat(modalCholesterol.textContent, 10);
    const nfSodium = parseFloat(modalSodium.textContent, 10);
    const nfCarbs = parseFloat(modalCarbs.textContent, 10);
    const nfFiber = parseFloat(modalFiber.textContent, 10);
    const nfSugars = parseFloat(modalSugars.textContent, 10);
    const nfProtein = parseFloat(modalProtein.textContent, 10);

    modalTrigger.addEventListener('click', function() {
        const inputEvent = new Event('input', { bubbles: true});
        modalInput.dispatchEvent(inputEvent)
    })
    
    modalInput.addEventListener('input', updateModal);


    function updateModal() {
        const nfQty = parseFloat(modalInput.value, 10);

        if (!isNaN(nfQty)) {
            const Calories = nfCalories * nfQty;
            const TotalFat = nfTotalFat * nfQty;
            const SatFat = nfSatFat * nfQty;
            const Cholesterol = nfCholesterol * nfQty;
            const Sodium = nfSodium * nfQty;
            const Carbs = nfCarbs * nfQty;
            const Fiber = nfFiber * nfQty;
            const Sugars = nfSugars * nfQty;
            const Protein = nfProtein * nfQty;
            modalCalories.textContent = Calories.toFixed(0);
            document.getElementById('form_calories').value = Calories.toFixed(0);
            modalTotalFat.textContent = TotalFat.toFixed(1) + 'g';
            document.getElementById('form_total_fat').value = TotalFat.toFixed(1);
            modalSatFat.textContent = SatFat.toFixed(1) + 'g';
            document.getElementById('form_saturated_fat').value = SatFat.toFixed(1);
            modalCholesterol.textContent = Cholesterol.toFixed(0) + 'mg';
            document.getElementById('form_cholesterol').value = Cholesterol.toFixed(0);
            modalSodium.textContent = Sodium.toFixed(0) + 'mg';
            document.getElementById('form_sodium').value = Sodium.toFixed(0);
            modalCarbs.textContent = Carbs.toFixed(1) + 'g';
            document.getElementById('form_total_carbohydrate').value = Carbs.toFixed(1);
            modalFiber.textContent = Fiber.toFixed(1) + 'g';
            document.getElementById('form_dietary_fiber').value = Fiber.toFixed(1);
            modalSugars.textContent = Sugars.toFixed(1) + 'g';
            document.getElementById('form_sugars').value = Sugars.toFixed(1);
            modalProtein.textContent = Protein.toFixed(1) + 'g';
            document.getElementById('form_protein').value = Protein.toFixed(1);
        }
        else {
            modalCalories.textContent = "";
            modalCalories.textContent = "";
            modalTotalFat.textContent = "";
            modalSatFat.textContent = "";
            modalCholesterol.textContent = "";
            modalSodium.textContent = "";
            modalCarbs.textContent = "";
            modalFiber.textContent = "";
            modalSugars.textContent = "";
            modalProtein.textContent = "";
        }
    }

    // for add.html to get info into database
    const mealTypeButtons = document.querySelectorAll('.meal-type-btn')
    console.log(mealTypeButtons)
    mealTypeButtons.forEach((button) =>{
        button.addEventListener('click', () => {
            mealTypeButtons.forEach((btn) => {
                btn.classList.remove('active');
            })
            button.classList.add('active');
            document.getElementById('meal_type').value = button.value;
            document.getElementById('meal-alert').style.display = 'none';
        });
    });
    document.getElementById('a1').value = localStorage.getItem('a1');
    document.getElementById('search_id').value = localStorage.getItem('search_id');
    document.getElementById('thumb').value = localStorage.getItem('thumb');

});
