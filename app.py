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
from flask_session import Session # delete Session if not used
import json
import requests # delete if not used
from werkzeug.security import check_password_hash, generate_password_hash

from project import login_required, search_food, add_common_food, add_branded_food
from secret import generate_secret_key

# figure out how I can wrap this with a main function or have a main function for other functions
app = Flask(__name__)
# figure out what a secret key means and why I need it to be able to use the flash messages
key = generate_secret_key(32)
app.secret_key = key

# figure out what this jargon means and why I need a secret key instead of using this.
# why was this used in the finance prob set?
# if I don't use this bit of code -- remove import of flask_session -> Session
# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_TYPE"] = "filesystem"
# Session(app)

db = SQL("sqlite:///database.db")


@app.route("/", methods=["GET", "POST"])
@login_required
def index():
    # going to need to figure out how to get this on multiple pages and multiple areas on the page
        # maybe I put it in project.py and make a function called app_seach or something 
        # then just call app_search
    # can probably simplify this with GET and window.location.assign in JS like I did with def(add)
    if request.method == "POST": # and request.headers.get('request_type') == "search_instant":
        # not working right now -- showing as 'None' but weirdly showing before POST request in terminal
        # actual POST request in network tab show's request_type = search_instant
        # print(f"request_type: ", request.headers.get('Request_type'))
        query = request.form.get("food-search")
        if query and len(query) >= 3:
            results = search_food(query)
            return jsonify(results)
        else:
            return jsonify([])
    else:
        return render_template("index.html")


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
            return render_template("add.html", results=results, results_dict=results_dict)
        return redirect("/")
    else:
        ...
# def log() to actually log the food to meal from modal and save it to database and display it.
# saving to DB and displaying might be two dif functs. log() in add route and display() in index route

@app.route("/submit", methods=["POST"])
@login_required
def submit():
    user_id = session["user_id"]
    print(f"user_id: ", user_id)
    date = dt.today().strftime('%Y-%m-%d')
    print(f"date: ", date)
    time = datetime.now().strftime('%H:%M:%S')
    print(f"time: ", time)
    meal_type = request.form.get("meal_type")
    print(f"meal_type: ", meal_type)
    a1 = request.form.get("a1")
    print(f"a1: ", a1)
    food_name = request.form.get("food_name")
    print(f"food_name: ", food_name)
    brand_name = request.form.get("brand_name")
    print(f"brand_name: ", brand_name)
    search_id = request.form.get("search_id")
    print(f"search_id: ", search_id)
    thumb = request.form.get("thumb")
    print(f"thumb: ", thumb)
    serving_qty = request.form.get("serving_qty")
    print(f"serving_qty: ", serving_qty)
    serving_weight_grams = request.form.get("serving_weight_grams")
    print(f"serving_weight_grams: ", serving_weight_grams)
    nf_calories = request.form.get("nf_calories")
    print(f"nf_calories: ", nf_calories)
    nf_total_fat = request.form.get("nf_total_fat")
    print(f"nf_total_fat: ", nf_total_fat)
    nf_saturated_fat = request.form.get("nf_saturated_fat")
    print(f"nf_saturated_fat: ", nf_saturated_fat)
    nf_cholesterol = request.form.get("nf_cholesterol")
    print(f"nf_cholesterol: ", nf_cholesterol)
    nf_sodium = request.form.get("nf_sodium")
    print(f"nf_sodium: ", nf_sodium)
    nf_total_carbohydrate = request.form.get("nf_total_carbohydrate")
    print(f"nf_total_carbohydrate: ", nf_total_carbohydrate)
    nf_dietary_fiber = request.form.get("nf_dietary_fiber")
    print(f"nf_dietary_fiber: ", nf_dietary_fiber)
    nf_sugars = request.form.get("nf_sugars")
    print(f"nf_sugars: ", nf_sugars)
    nf_protein = request.form.get("nf_protein")
    print(f"nf_protein: ", nf_protein)

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
            flash("Username already Exists", "error")
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
