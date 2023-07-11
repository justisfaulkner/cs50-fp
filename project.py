from flask import redirect, session
from functools import wraps
import json
import requests

def main():
    ...


def login_required(f):
    
    # Decorate routes to require login.

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)

    return decorated_function


def nutrion_ix_instant(query):
    query = query
    
    app_id = "2a11e686"
    api_key = "6c916bc5ed757f9ca2227a0213bb5abd"

    headers = {
        "x-app-id": app_id,
        "x-app-key": api_key,
        "content-type": "application/json"
    }

    params = {
        "query": query
    }

    end_pt_url = "https://trackapi.nutritionix.com/v2/search/instant"



def function_n():
    ...


if __name__ == "__main__":
    main()