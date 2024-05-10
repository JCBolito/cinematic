import requests

def getAllMovies():
    res = requests.get("http://localhost:3000/api/movies?limit=4000")
    response = res.json()
    data = response.get("data")
    return data

def getAllNormalizedMovies():
    res = requests.get("http://localhost:3000/api/fasttext/movies")
    response = res.json()
    data = response.get("data")
    return data

def getAllNormalizedKeywords():
    res = requests.get("http://localhost:3000/api/fasttext/keywords")
    response = res.json()
    data = response.get("data")
    return data

def getUserMovieRatings(username: str):
    res = requests.get(f"http://localhost:3000/api/user-ratings/movies?username={username}")
    response = res.json()
    data = response.get("data")
    return data

def getUserGenreRatings(username: str):
    res = requests.get(f"http://localhost:3000/api/user-ratings/genres?username={username}")
    response = res.json()
    data = response.get("data")
    print(data)
    return data
