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
    key: hit[key] if key != "photo" else hit["photo"]["highres"]
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


# backup of add():
# @app.route("/add", methods=["GET", "POST"])
# @login_required
# def add():
#     if request.method == "POST":
#         # retrieve the query to be passed to the API function
#         query = request.form.get("add-food")
#         # retrieve the type (common/branded) to determine running add_common_food or add_branded_food function
#         category = request.headers.get("category")
#         if category == "common":
#             # if query is not empty
#             if query:
#                 # pass the query to the API function and save results in memory to results var
#                 results = add_common_food(query)
#                 # return a flask.Response object that is of type JSON
#                 return jsonify(results)
#             else:
#                 return jsonify([])
#         elif category == "branded":
#             if query:
#                 results = add_branded_food(query)
#                 return jsonify(results)
#             else:
#                 return jsonify([])
#         else:
#             return render_template("add.html", results={"food_name": "test1"})
#     elif request.method == "GET":
#         query = request.args.get("add-food")
#         category = request.args.get("category")
#         print(f"QUERY: {query}    CATEGORY: {category}")
#         if query:
#             if category == "common":
#                 results = add_common_food(query)
#             elif category == "branded":
#                 results = add_branded_food(query)
#         print(f"RESULTS: {results}")
#         return render_template("add.html", results=results)
