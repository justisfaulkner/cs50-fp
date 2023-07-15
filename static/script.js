document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const currentURL = window.location.href
    const searchInput = document.getElementById('food-search');
    const resultsList = document.getElementById('results');
    const filterButtons = document.querySelectorAll('.tabs');

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
        results.forEach(result => {
            // maybe I can make a list item that has a button inside of it, along with image kcals, etc. 
            // right now its just a button
            const button = document.createElement('button');
            const resultText = Object.values(result)[0];
            button.textContent = resultText;
            if (Object.keys(result)[0] == 'common') {
                button.setAttribute('data-type', 'common')
                button.setAttribute('value', Object.values(result)[1])                
            }
            else {
                button.setAttribute('data-type', 'branded')
                button.setAttribute('value', Object.values(result)[1]) 
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
            const type = button.getAttribute("data-type")
            if (type === 'common') {
                fetch('/add', {
                    method: 'POST',
                    body: new URLSearchParams({ 'add-food': query }),
                    headers: {'type': 'common'}
                })
                .then(response => response.json())
                .then(results => {
                    switchWindow("/add?results=" + encodeURIComponent(JSON.stringify(results)));
                });
            }
            else if (type === 'branded') {
                fetch('/add', {
                    method: 'POST',
                    body: new URLSearchParams({ 'add-food': query }),
                    headers: {'type': 'branded'}
                })
                .then(response => response.json())
                .then(results => {
                    switchWindow("/add?results=" + encodeURIComponent(JSON.stringify(results)));
                });
            }
          })
        });
    }
      
    function switchWindow(page) {
        window.location.assign(page);
    }

    if (currentURL.includes("/add?results=")) {
        const common = document.getElementById("common");
        const urlParams = new URLSearchParams(window.location.search);
        const resultsString = urlParams.get('results');
        const results = JSON.parse(resultsString);
        displayFood(results, common);
    }
    
    function displayFood(results, common) {
        Object.entries(results).forEach(([key, value]) => {
          const p = document.createElement('p');
          p.textContent = `${key}: ${value}`;
          common.appendChild(p);
        });
    }

});
