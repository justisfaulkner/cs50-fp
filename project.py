from flask import redirect, request, session
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
    # set app and API keys
    app_id = "2a11e686"
    api_key = "6c916bc5ed757f9ca2227a0213bb5abd"

    # set search/instant specefic headers
    headers = {
        "x-app-id": app_id,
        "x-app-key": api_key,
        # "content-type": "application/json"
    }

    # set parmeters for the query, right now query is all I have, but can filter and sort if needed I think
    params = {"query": query}

    # set the end point for search/instant
    end_pt_url = "https://trackapi.nutritionix.com/v2/search/instant"

    # check chatgpt and finance prob set lookup function for how to make the actual request
    response = requests.get(end_pt_url, params=params, headers=headers)
    data = response.json()

    # grab the relevent information
    results = []
    for hit in data:
        if hit == "common":
            for item in data["common"]:
                food_name = item["food_name"]
                # test = "common test"
                results.append({"common": food_name})
        elif hit == "branded":
            for item in data["branded"]:
                food_name = item["brand_name_item_name"]
                # test = "brand test"
                results.append({"branded": food_name})

    return results


def function_n():
    ...


if __name__ == "__main__":
    main()
