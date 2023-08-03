from cs50 import SQL
from datetime import date as dt, datetime
from flask import (
    Flask,
    jsonify,
    request,
    redirect,
    render_template,
    session,
    flash,
)
import json
from werkzeug.security import check_password_hash, generate_password_hash

from project import generate_secret_key, login_required, search_food, add_common_food, add_branded_food

# figure out how I can wrap this with a main function or have a main function for other functions
app = Flask(__name__)
# figure out what a secret key means and why I need it to be able to use the flash messages
key = generate_secret_key(32)
app.secret_key = key

db = SQL("sqlite:///database.db")

@app.route("/", methods=["GET", "POST"])
@login_required
def index():
    user_id = session["user_id"]
    rows = db.execute("SELECT * FROM account WHERE user_id = ?", user_id)
    if rows == []:
        id = None
    else:
        id = rows[0]["user_id"]


    if request.method == "POST":
        query = request.form.get("food-search")
        if query and len(query) >= 3:
            results = search_food(query)
            return jsonify(results)
        else:
            return jsonify([])
    elif request.method == "GET" and user_id == id:
        query = "SELECT * FROM food WHERE meal_type = ? AND user_id = ?"
        user_id = session["user_id"]
        
        breakfast = db.execute(query, "breakfast", user_id)
        lunch = db.execute(query, "lunch", user_id)
        dinner = db.execute(query, "dinner", user_id)
        snack = db.execute(query, "snack", user_id)
        return render_template("index.html", breakfast=breakfast, lunch=lunch, dinner=dinner, snack=snack)
    else:
        return redirect("/account")


@app.route("/add", methods=["GET", "POST"])
@login_required
def add():
    if request.method == "GET":
        query = request.args.get("add-food")
        category = request.args.get("category")
        if category == "common":
            results = add_common_food(query)
        elif category == "branded":
            results = add_branded_food(query)
        if query and category:
            results_dict = results
            results = json.dumps(results)
            return render_template(
                "add.html", results=results, results_dict=results_dict
            )
        return redirect("/")
    else:
        ...

@app.route("/account", methods=["GET", "POST"])
@login_required
def account():
    user_id = session["user_id"]
    rows = db.execute("SELECT * FROM account WHERE user_id = ?", user_id)
    if rows == []:
        id = None
    else:
        id = rows[0]["user_id"]
    
    if request.method == "GET" and user_id == id: # if user trys to access account page and they have already entered account details, take them to account-details page to view their details
       return redirect ("/account-details")
    elif request.method == "GET" and user_id != id: # if user trys to access account page and they have not already entered account details, take them to account page to enter details
        return render_template("account.html")
    elif request.method == "POST" and request.form.get('account-form') == "update-form":
        # return redirect to a filled out version of account details, with an update button that takes back to account form
        user_id = session["user_id"]
        weight_goal = request.form.get("account-weight-goal")
        goal_per_week = request.form.get("account-goal-per-week")
        calorie_budget = request.form.get("account-calorie-budget")
        protein_goal = request.form.get("account-protein-goal")
        protein_goal = f".{protein_goal}" # make string a decimal representing percent
        carb_goal = request.form.get("account-carb-goal")
        carb_goal = f".{carb_goal}" # make string a decimal representing percent
        fat_goal = request.form.get("account-fat-goal")
        fat_goal = f".{fat_goal}" # make string a decimal representing percent
        bmr = request.form.get("account-bmr")
        weight = request.form.get("account-weight")

        query = "INSERT INTO account (user_id, weight_goal, goal_per_week, calorie_budget, protein_goal, carb_goal, fat_goal, bmr, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        db.execute(query, 
            user_id, 
            weight_goal, 
            goal_per_week, 
            calorie_budget, 
            protein_goal, 
            carb_goal, 
            fat_goal, 
            bmr, 
            weight
        )
        return redirect("/account-details")


@app.route("/account-details", methods=["GET"])
@login_required
def account_details():
    user_id = session["user_id"]
    account_details = db.execute("SELECT * FROM account WHERE user_id = ?", user_id)[0]
    return render_template("account-details.html", account_details=account_details)


@app.route("/submit", methods=["POST"])
@login_required
def submit():

    user_id = session["user_id"]
    date = dt.today().strftime("%Y-%m-%d")
    time = datetime.now().strftime("%H:%M:%S")
    meal_type = request.form.get("meal_type")
    a1 = request.form.get("a1")
    food_name = request.form.get("food_name")
    brand_name = request.form.get("brand_name")
    search_id = request.form.get("search_id")
    thumb = request.form.get("thumb")
    serving_qty = request.form.get("serving_qty")
    serving_unit = request.form.get("serving_unit")
    serving_weight_grams = request.form.get("serving_weight_grams")
    nf_calories = int(request.form.get("nf_calories"))
    nf_total_fat = request.form.get("nf_total_fat")
    nf_saturated_fat = request.form.get("nf_saturated_fat")
    nf_cholesterol = request.form.get("nf_cholesterol")
    nf_sodium = request.form.get("nf_sodium")
    nf_total_carbohydrate = request.form.get("nf_total_carbohydrate")
    nf_dietary_fiber = request.form.get("nf_dietary_fiber")
    nf_sugars = request.form.get("nf_sugars")
    nf_protein = request.form.get("nf_protein")

    db.execute(
        "INSERT INTO food (user_id, date, time, meal_type, a1, food_name, brand_name, search_id, thumb, serving_qty, serving_unit, serving_weight_grams, nf_calories, nf_total_fat, nf_saturated_fat, nf_cholesterol, nf_sodium, nf_total_carbohydrate, nf_dietary_fiber, nf_sugars, nf_protein) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        user_id,
        date,
        time,
        meal_type,
        a1,
        food_name,
        brand_name,
        search_id,
        thumb,
        serving_qty,
        serving_unit,
        serving_weight_grams,
        nf_calories,
        nf_total_fat,
        nf_saturated_fat,
        nf_cholesterol,
        nf_sodium,
        nf_total_carbohydrate,
        nf_dietary_fiber,
        nf_sugars,
        nf_protein,
    )

    return redirect("/")

@app.route("/delete", methods=["POST"])
@login_required
def delete():
    user_id = session["user_id"]
    unique_id = request.form.get("unique_id")
    db.execute("DELETE FROM food WHERE user_id = ? AND unique_id = ?", user_id, unique_id)
    return redirect("/")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            flash("Must Provide a Username", "error")
            return render_template("login.html")

        # Ensure password was submitted
        elif not request.form.get("password"):
            flash("Must Provide a Password", "error")
            return render_template("login.html")

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            flash("Invalid Username and/or Password", "error")
            return render_template("login.html")

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "GET":
        return render_template("register.html")
    else:
        username = request.form.get("username")
        usernames = [
            row["username"] for row in db.execute("SELECT username FROM users")
        ]

        if not request.form.get("username"):
            flash("Must Provide a Username", "error")
            return render_template("register.html")
        elif username in usernames:
            flash("Username Already Exists", "error")
            return render_template("register.html")
        elif not request.form.get("password"):
            flash("Must Provide a Password", "error")
            return render_template("register.html")
        elif not request.form.get("confirmation"):
            flash("Must Provide a Password Confirmation", "error")
            return render_template("register.html")
        elif request.form.get("password") != request.form.get("confirmation"):
            flash("Passwords do not match", "error")
            return render_template("register.html")
        else:
            db.execute(
                "INSERT INTO users (username, hash) VALUES (?, ?)",
                request.form.get("username"),
                generate_password_hash(request.form.get("password")),
            )
            return redirect("/")


# final return to let the app run
# if wrapped inside main function
# return app

# if __name__ == "__main__":
#     app = main()
#     app.run(use_reloader=True)
#     main()
