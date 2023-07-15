import requests

query = "2 slices of pizza"

# set app and API keys
app_id = "2a11e686"
api_key = "6c916bc5ed757f9ca2227a0213bb5abd"

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
    if key != "photo" else hit["photo"]["highres"]
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
        "photo",
    ]
}

print(results)
