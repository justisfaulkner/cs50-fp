    # JTRACK Calorie & Food Tracker: CS50 Final Project
    #### Video Demo:  https://youtu.be/TSBw4eTes5A
    #### Description:
    
    I built a web application using Python and the Flask framework for the backend and HTML, CSS and JavaScript for the functionality and display on the frontend. 

    The project is called Jtrack, it is a food and calorie tracker.

    Upon visiting the website for the first time, you will be prompted to login or register for an account. Once logged in you will be taken to an account details page where you are prompted to enter your account details to set up your daily calorie budget and weight loss or gain goals. The web app will automatically calculate your daily calorie budget based off your goals and BMR (or resting energy). Upon saving this information, it is stored in a databse using the SQL module from the CS50 library and SQLite3.

    From there you will be taken to the homepage where you can see your daily calorie and food tracker up to date with your personalized calorie budget and goals. This will update dynamically when you log foods to keep you aware of how many calories you have left to eat or if you're over budget.

    Adding food is as easy as searching for the food in the search bar on the navigation bar. The foods autopopulate in a container below the search bar showing you the name of the food, a photo of it and calories (for branded foods). The is accomplished through an API call to a nutrition database called Nutrion IX hitting the search/instant endpoint to grab the food results.

    Once you click on a food, you can see the nutritional information of it and have the option to change servings, choose which meal you had it for and add it to your log. This saves the food and nutrition information to a database for future use and display.

    Files:

    app.py holds the flask functionality and routes
    project.py holds the helper functions and API calls
    database.db is the database with users, food and account tables
    test_project.py holds the test functions that pass all checks
    requirements.txt holds the pip installable libraries
    static/ directory holds the JS and CSS
    templtes/ directory holds the HTML pages

