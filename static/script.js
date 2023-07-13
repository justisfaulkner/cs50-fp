document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('food-search');
    const resultsList = document.getElementById('results');

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
        // console.log('Displaying results:', results);
        clearResults();
        results.forEach(result => {
            const li = document.createElement('li');
            li.textContent = result;
            resultsList.appendChild(li);
        });
    }
    
    function clearResults() {
        resultsList.innerHTML = '';
    }
});
