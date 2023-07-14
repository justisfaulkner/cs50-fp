import requests

query = "coffee"

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
print(data)

# grab the relevent information
results = []
for hit in data["common"]:
    food_name = hit["food_name"]
    results.append(food_name)
