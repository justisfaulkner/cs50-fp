document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('food-search');
    const resultsList = document.getElementById('results');
    const filterButtons = document.querySelectorAll('.tabs');

    let timerId;

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
                    displayResults(results);
                });
            } else {
                clearResults();
            }
        }, 300);
    });

    function displayResults(results) {
        clearResults();
        results.forEach(result => {
            const li = document.createElement('li');
            const resultText = Object.values(result)[0];
            li.textContent = resultText;
            if (Object.keys(result)[0] == 'common') {
                li.setAttribute('data-type', 'common')                
            }
            else {
                li.setAttribute('data-type', 'branded')
            }
            resultsList.appendChild(li);
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
        const displayedItems = Array.from(resultsList.querySelectorAll('li'));  
        
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

});
