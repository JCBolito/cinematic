from fastapi import FastAPI
import pandas as pd
import uvicorn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from db.data import getUserMovieRatings, getAllMovies
from algorithm.cbf import getCbfRecommendations
from algorithm.ecbf import mmr_content_recommender, feature_weighted_recommendation
from algorithm.fasttext import recommend_key_word_based, recommend
app = FastAPI()

allMovies = getAllMovies()
movies_df = pd.json_normalize(allMovies)
vectorizer = TfidfVectorizer()
df_movies_tf_idf_described = vectorizer.fit_transform(movies_df["genres"].astype(str))
m2m = cosine_similarity(df_movies_tf_idf_described)
df_tfidf_m2m = pd.DataFrame(cosine_similarity(df_movies_tf_idf_described))
index_to_movie_id = movies_df["movieId"]
df_tfidf_m2m.columns = [str(index_to_movie_id[int(col)]) for col in df_tfidf_m2m.columns]
df_tfidf_m2m.index = [index_to_movie_id[idx] for idx in df_tfidf_m2m.index]  # type: ignore


@app.get("/movies")
async def getMovies():
    return {"success": True, "data": getAllMovies(), "message": "Data successfully retrieved."}

@app.get("/user-ratings/{username}")
async def getUsernameRatings(username:str):
    return {"success": True, "data": getUserMovieRatings(username), "message": "Data successfully retrieved."}

@app.get("/cbf/{username}")
async def cbf(username:str):
    return await getCbfRecommendations(username)

@app.get("/cbf-similar/{movieId}")
def cbfBasedOnMovieRecom(movieId:int):
    convertedMovieId = int(movieId)
    return recommend(convertedMovieId)

@app.get("/ecbf/{username}/{diversity}")
def ecbf(username, diversity):
    return mmr_content_recommender(username, diversity)
    
@app.get("/ecbf-tpp/{username}")
def ecbfTpp(username):
    return feature_weighted_recommendation(username)

@app.get("/ecbf-fasttext/{movieId}")
def ecbfFastText(movieId:int):
    convertedMovieId = int(movieId)
    return recommend_key_word_based(convertedMovieId)

if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)