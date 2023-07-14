from cs50 import SQL
from flask import (
    Flask,
    jsonify,
    request,
    redirect,
    render_template,
    session,
    flash,
)
from flask_session import Session
import json
import requests
from werkzeug.security import check_password_hash, generate_password_hash

from project import login_required, nutrion_ix_instant

# figure out how I can wrap this with a main function or have a main function for other functions
app = Flask(__name__)
# figure out what a secret key means and why I need it to be able to use the flash messages
app.secret_key = "testing"

# figure out what this jargon means and why I can't need a secret key instead of using this.
# why was this used in the finance prob set?
# if I don't use this bit of code -- remove import of flask_session -> Session
# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_TYPE"] = "filesystem"
# Session(app)

db = SQL("sqlite:///database.db")


@app.route("/", methods=["GET", "POST"])
@login_required
def index():
    if request.method == "POST":
        query = request.form.get("food-search")
        if query and len(query) >=3:
            results = nutrion_ix_instant(query)
            print(jsonify(results))
            return jsonify(results)
        else:
            return jsonify([])
    else:
        return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            # return apology("must provide username", 403)
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
