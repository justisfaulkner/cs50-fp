from flask import redirect, request, session
from functools import wraps
import json
import requests

# set app and API keys
app_id = "2a11e686"
api_key = "6c916bc5ed757f9ca2227a0213bb5abd"


def main():
    print(
        "I am submitting this project for CS50x & CS50P using Flask within Python3"
        "to create a Web App that helps users track their calories"
    )


def login_required(f):
    # Decorate routes to require login.

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)

    return decorated_function


def search_food(query):
    # set /search/instant endpoint specefic headers
    headers = {
        "x-app-id": app_id,
        "x-app-key": api_key,
        # "x-user-jwt": "include if you want to have 'self' foods in the search/instant list of dicts"
        # "content-type": "application/json"
    }

    # set parmeters for the query, right now query is all I have, but can filter and sort if needed I think
    params = {"query": query}

    # set the end point for search/instant
    end_pt_url = "https://trackapi.nutritionix.com/v2/search/instant"

    # make the API call
    response = requests.get(end_pt_url, params=params, headers=headers)
    # save the json response in memory to data variable
    data = response.json()

    # grab the relevent information
    results = []
    for hit in data:
        if hit == "common":
            for item in data["common"]:
                food_name = item["food_name"]
                nutrients = item["food_name"]  # /natural/nutrients endpoint
                results.append({"common": food_name, "nutrients": nutrients})
        elif hit == "branded":
            for item in data["branded"]:
                food_name = item["brand_name_item_name"]
                nutrients = item["nix_item_id"]  # /search/item endpoint
                results.append({"branded": food_name, "nutrients": nutrients})
        elif hit == "self":
            ...
            # can add self here down the line if I include the relevant header for the user

    return results


def add_common_food(query):
    # set /natural/nutrients endpoint specefic headers
    headers = {
        "x-app-id": app_id,
        "x-app-key": api_key,
    }

    # set parmeters for the query, right now query is all I have, but can filter and sort if needed I think
    body = {
        "query": query,
        # "timezone": "timezone variable -- need to create this var from users timezone"    
    }

    # set the end point for search/instant
    end_pt_url = "https://trackapi.nutritionix.com/v2/natural/nutrients"

    response = requests.post(end_pt_url, data=body, headers=headers)
    data = response.json()

    results = {
    key: hit[key]
    if key != "photo" else hit["photo"]["thumb"]
    for hit in data["foods"]
    for key in [
        "food_name",
        "serving_qty",
        "serving_unit",
        "serving_weight_grams",
        "nf_calories",
        "nf_total_fat",
        "nf_saturated_fat",
        "nf_sodium",
        "nf_total_carbohydrate",
        "nf_dietary_fiber",
        "nf_sugars",
        "nf_protein",
        "photo"
    ]
    }

    return results

def add_branded_food(query):
     # set /search/item endpoint specefic headers
    headers = {
    "x-app-id": app_id,
    "x-app-key": api_key,
    }

    # set parmeters for the query, right now query is all I have, but can filter and sort if needed I think
    params = {"nix_item_id": query}

    # set the end point for search/instant
    end_pt_url = "https://trackapi.nutritionix.com/v2/search/item"    

    response = requests.get(end_pt_url, params=params, headers=headers)
    data = response.json()

    results = {
    key: hit[key]
    if key != "photo" else hit["photo"]["thumb"]
    for hit in data["foods"]
    for key in [
        "food_name",
        "serving_qty",
        "serving_unit",
        "serving_weight_grams",
        "nf_calories",
        "nf_total_fat",
        "nf_saturated_fat",
        "nf_sodium",
        "nf_total_carbohydrate",
        "nf_dietary_fiber",
        "nf_sugars",
        "nf_protein",
        "photo"
    ]
    }
    return results


if __name__ == "__main__":
    main()
