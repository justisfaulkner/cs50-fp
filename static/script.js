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
                    const foodItemContainers = document.querySelectorAll('.food-item-container')
                    foodItemContainers.forEach((item) => {
                        const foodItemDate = item.getAttribute('data-vis')
                        const selectedDayDate = newValue
                        if (foodItemDate === selectedDayDate) {
                            item.style.display = "flex"
                        }
                        else {
                            item.style.display = "none"
                        }
                    });
        
                    updateNoFoodLoggedMessage();

                    // calculate and display calories for meal headings
                    const breakfastCals = document.getElementById("meal-heading-breakfast");
                    let bCals = 0;
                    const lunchCals = document.getElementById("meal-heading-lunch");
                    let lCals = 0;
                    const dinnerCals = document.getElementById("meal-heading-dinner");
                    let dCals = 0;
                    const snackCals = document.getElementById("meal-heading-snack");
                    let sCals = 0;
                    foodItemContainers.forEach((item) => {
                        if (item.style.display === "flex") {
                            if (item.getAttribute("data-meal") === "breakfast") {
                                bCals += parseInt(item.getAttribute("data-cals"));
                            }
                            else if (item.getAttribute("data-meal") === "lunch") {
                                lCals += parseInt(item.getAttribute("data-cals"));
                            }
                            else if (item.getAttribute("data-meal") === "dinner") {
                                dCals += parseInt(item.getAttribute("data-cals"));
                            }
                            else if (item.getAttribute("data-meal") === "snack") {
                                sCals += parseInt(item.getAttribute("data-cals"));
                            }
                        }
                    });
                    breakfastCals.textContent = "Breakfast: " + bCals + " cals";
                    lunchCals.textContent = "Lunch: " + lCals + " cals";
                    dinnerCals.textContent = "Dinner: " + dCals + " cals";
                    snackCals.textContent = "Snack: " + sCals + " cals";
                    
                    // calculate and display calories for summary section 
                    const summaryBudgetCals = document.getElementById('budget-cals');
                    const summaryFoodCals = document.getElementById('total-food-cals');
                    const summaryActiveCals = document.getElementById('total-active-cals');
                    const summaryNetCals = document.getElementById('net-cals');
                    const summaryOverUnder = document.getElementById('over-under');

                    const budgetCals = parseInt(summaryBudgetCals.textContent);
                    const foodCals = bCals + lCals + dCals + sCals;
                    const activeCals = parseInt(summaryActiveCals.textContent);
                    const netCals = foodCals + activeCals;
                    const overUnder = budgetCals - netCals;

                    summaryFoodCals.textContent = foodCals;
                    summaryNetCals.textContent = netCals;
                    summaryOverUnder.textContent = overUnder;
                    
                    // dynamically display over or under based on result
                    const overUnderHeader = document.getElementById('over-under-header')
                    if (overUnder > 0) {
                        overUnderHeader.textContent = "Under"
                        summaryOverUnder.style.backgroundColor = "#198754"
                    } else {
                        overUnderHeader.textContent = "Over"
                        summaryOverUnder.style.backgroundColor = "#dc3545"
                    }
                }
            }
        }

        // Create a new MutationObserver
        const observer = new MutationObserver(handleCurrentDayChange);

        // Start observing changes to the data-vis attribute of the currentDayDiv
        observer.observe(currentDayDiv, { attributes: true });

        //functions to see if any specified meal items are logged on selected day
        function breakfastVisible() {
            const breakfastItems = document.querySelectorAll('.food-item-container[data-meal="breakfast"]');
            for (const item of breakfastItems) {
                if (item.style.display === "flex") {
                    return true;
                }
            }
            return false;
        }

        function lunchVisible() {
            const lunchItems = document.querySelectorAll('.food-item-container[data-meal="lunch"]');
            for (const item of lunchItems) {
                if (item.style.display === "flex") {
                    return true;
                }
            }
            return false;
        }

        function dinnerVisible() {
            const dinnerItems = document.querySelectorAll('.food-item-container[data-meal="dinner"]');
            for (const item of dinnerItems) {
                if (item.style.display === "flex") {
                    return true;
                }
            }
            return false;
        }

        function snackVisible() {
            const snackItems = document.querySelectorAll('.food-item-container[data-meal="snack"]');
            for (const item of snackItems) {
                if (item.style.display === "flex") {
                    return true;
                }
            }
            return false;
        }

        function updateNoFoodLoggedMessage() {
            const noBreakfastLogged = document.getElementById("no-breakfast-logged")
            const noLunchLogged = document.getElementById("no-lunch-logged")
            const noDinnerLogged = document.getElementById("no-dinner-logged")
            const noSnackLogged = document.getElementById("no-snack-logged")
            if (breakfastVisible()) {
                noBreakfastLogged.style.display = "none";
            } else {
                noBreakfastLogged.style.display = "block";
            }
            if (lunchVisible()) {
                noLunchLogged.style.display = "none";
            } else {
                noLunchLogged.style.display = "block";
            }
            if (dinnerVisible()) {
                noDinnerLogged.style.display = "none";
            } else {
                noDinnerLogged.style.display = "block";
            }
            if (snackVisible()) {
                noSnackLogged.style.display = "none";
            } else {
                noSnackLogged.style.display = "block";
            }
        }

        // function for deleting a food item from log
        const finalDeletes = document.querySelectorAll('.btn.btn-danger.final-delete')
        finalDeletes.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                fetch('/delete', {
                    method: 'POST',
                    body: new URLSearchParams({ 'unique_id': id })
                })
                const uniqueFoodItemContainer = document.querySelector('.food-item-container[data-id="' + id + '"]');
                uniqueFoodItemContainer.setAttribute('data-vis', "deleted")
                uniqueFoodItemContainer.style.display = 'none';

                // event to click back a day and forward a day to force mutation function to fire
                const changeDay = new Event('click', { bubbles: true});
                prevDayBtn.dispatchEvent(changeDay)
                nextDayBtn.dispatchEvent(changeDay)
                
            });
        });

        // when index loads "click" today button so show/hide food code is triggered
        // dom content loaded already at top enclosing everything
        const CurrentDayBtnClickEvent = new Event('click', { bubbles: true});
        currentDayBtn.dispatchEvent(CurrentDayBtnClickEvent)
    }

    // function to disallow submission on search instant form since it autoupdates (submission would results in plaintext JSON)
    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
    });

    // add active class to log-delete-btns when clicked
    const logDeleteBtns = document.querySelectorAll(".btn.btn-danger.delete-btn")
    logDeleteBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            btn.classList.toggle("active");
        });
    });

    // remove active class from log-delete-btns when clicked away (called in window.addeventlistener(mousedown))
    function removeActiveFromLogDeleteBtns () {
        logDeleteBtns.forEach(btn => {
            btn.classList.remove("active")
        });
    }
 
    // functions to implement search instant and autodisplay results
    let timerId;
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

    // function to hide search results if clicked outside search bar or search results
    function hideResultsWrapper(event) {
        const targetElement = event.target;
        
        // Check if the clicked element is the container or a child element of the container
        if (!resultsWrapper.contains(targetElement) && !searchForm.contains(targetElement)) {
          resultsWrapper.style.display = 'none'; // Hide the container
        }
    }
      
      // function to show search results if clicked back in search bar
      function showResultsWrapper() {
        if (resultsContainer.children.length > 0) {
            resultsWrapper.style.display = 'block'; // Show the container
        }
        
    }
      
    // listen for click events on the window to hide search results
    window.addEventListener('mousedown', hideResultsWrapper);
    // listen for click events on the window to remove active from delete food from log buttons
    window.addEventListener('mousedown', removeActiveFromLogDeleteBtns);
    // listen for click into search bar to show search results again
    searchInput.addEventListener('focus', showResultsWrapper);

    // listen for clicks on filter buttons to get what category they are for filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          const category = button.dataset.type;
          filter(category);
        });
    })

    // function to filter results based on which filter button was clicked
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

    // function to establish data to pass to python to run API then switch window to display result of food selected
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
    
    // function to switch window after clicking a food
    function switchWindow(query, category) {
        const url = `/add?add-food=${query}&category=${category}`;
        window.location.assign(url);
    }

    
    if (currentURL.includes("/add?add-food=")) {
        // get results passed to add.html and parse them to be a JSON object
        const flaskResults = document.getElementById("APIresults").getAttribute("data-api-results")
        const jsResults = JSON.parse(flaskResults)

        // set the appropriate html attributes for each key so the correct results appear on add.html
        const keys = Object.keys(jsResults);
        keys.forEach(key => {
            if (key === 'photo') {
                const ids = document.querySelectorAll('#' + key);
                for (let i = 0; i < ids.length; i++) {
                    ids[i].src = jsResults[key];
                }
            } else if (key === 'alt_measures') {
                const measuresKey = jsResults[key];
                console.log(measuresKey)
                // left off here
            } else {
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
    
    
    // prevent user from hitting enter in the form
    const modalForm = document.getElementById('add-food-form')
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
    });
 
    const modalTrigger = document.getElementById('modal-trigger');
    
    const modalInput = document.getElementById('modal-serving-qty');
    const modalSelect = document.getElementById('modal-serving-unit');

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

    // listen for modal to be triggered, so artificial input can be added to serving quantity so data formats correctly
    modalTrigger.addEventListener('click', function() {
        
        const inputEvent = new Event('input', { bubbles: true});
        modalInput.dispatchEvent(inputEvent)
    })
    
    modalInput.addEventListener('input', updateModal);
    modalSelect.addEventListener('change', updateModal);


    function updateModal() {
        const nfQty = parseFloat(modalInput.value, 10);
        const selectIndex = parseInt(modalSelect.value, 10);
        let weightGrams = null;
        let servingUnit = null;
        if (!isNaN(selectIndex)) {
            weightGrams =  jsResults.alt_measures[selectIndex].serving_weight;
            servingUnit = jsResults.alt_measures[selectIndex].measure;
        } else {
            weightGrams = jsResults.serving_weight_grams;
            servingUnit = jsResults.serving_unit;
        }
        const inputMultiplier = weightGrams / jsResults.serving_weight_grams

        if (!isNaN(nfQty)) {
            const Calories = nfCalories * nfQty * inputMultiplier;
            const TotalFat = nfTotalFat * nfQty * inputMultiplier;
            const SatFat = nfSatFat * nfQty * inputMultiplier;
            const Cholesterol = nfCholesterol * nfQty * inputMultiplier;
            const Sodium = nfSodium * nfQty * inputMultiplier;
            const Carbs = nfCarbs * nfQty * inputMultiplier;
            const Fiber = nfFiber * nfQty * inputMultiplier;
            const Sugars = nfSugars * nfQty * inputMultiplier;
            const Protein = nfProtein * nfQty * inputMultiplier;
            modalCalories.textContent = Calories.toFixed(0);
            document.getElementById('form_calories').value = Calories.toFixed(0); // for db
            modalTotalFat.textContent = TotalFat.toFixed(1) + 'g';
            document.getElementById('form_total_fat').value = TotalFat.toFixed(1); // for db
            modalSatFat.textContent = SatFat.toFixed(1) + 'g';
            document.getElementById('form_saturated_fat').value = SatFat.toFixed(1); // for db
            modalCholesterol.textContent = Cholesterol.toFixed(0) + 'mg';
            document.getElementById('form_cholesterol').value = Cholesterol.toFixed(0); // for db
            modalSodium.textContent = Sodium.toFixed(0) + 'mg';
            document.getElementById('form_sodium').value = Sodium.toFixed(0); // for db
            modalCarbs.textContent = Carbs.toFixed(1) + 'g';
            document.getElementById('form_total_carbohydrate').value = Carbs.toFixed(1); // for db
            modalFiber.textContent = Fiber.toFixed(1) + 'g';
            document.getElementById('form_dietary_fiber').value = Fiber.toFixed(1); // for db
            modalSugars.textContent = Sugars.toFixed(1) + 'g';
            document.getElementById('form_sugars').value = Sugars.toFixed(1); // for db
            modalProtein.textContent = Protein.toFixed(1) + 'g';
            document.getElementById('form_protein').value = Protein.toFixed(1); // for db

            document.getElementById('form_serving_unit').value = servingUnit; // for db
            document.getElementById('form_serving_weight_grams').value = weightGrams; // for db
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
    mealTypeButtons.forEach((button) =>{
        button.addEventListener('click', () => {
            mealTypeButtons.forEach((btn) => {
                btn.classList.remove('active');
            })
            button.classList.add('active');
            document.getElementById('meal_type').value = button.value; // for db
            // used to remove the meal-alert
            document.getElementById('meal-alert').style.display = 'none';
        });
    });
    document.getElementById('a1').value = localStorage.getItem('a1'); //for db
    document.getElementById('search_id').value = localStorage.getItem('search_id'); //for db
    document.getElementById('thumb').value = localStorage.getItem('thumb'); //for db

    }

});
