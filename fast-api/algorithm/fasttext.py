import pandas as pd
from fastapi import HTTPException
import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import warnings
from db.data import getAllNormalizedMovies
warnings.filterwarnings(action="ignore")

allMovies = getAllNormalizedMovies()
movies = pd.json_normalize(allMovies)
movie = movies[['movieId', 'title', 'genres', 'keywords', 'release_date', 'runtime', 'poster']]

data = movie[['movieId', 'title', 'genres', 'keywords', 'release_date', 'runtime', 'poster']]

# # Initialize a TF-IDF vectorizer to convert text data into numerical features
vectorizer = TfidfVectorizer()
# Create a TF-IDF matrix from movie features(genres)
df_movies_tf_idf_described = vectorizer.fit_transform(data["keywords"].astype(str))
similarity = cosine_similarity(df_movies_tf_idf_described)
normalized_similarities = pickle.load(open('pickle/normalized_similarity_keywords.pkl', 'rb'))

def recommend(movieId:int):
    try:
        movie_index = data[data['movieId'] == movieId].index[0]
        distances = similarity[movie_index]
        movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:20]
        recommended_movies = [
				{
					'movieId': data.iloc[movie_index]['movieId'], 
					'title': data.iloc[movie_index]['title'], 
					'keywords': data.iloc[movie_index]['keywords'],
					'release_date': data.iloc[movie_index]['release_date'],
					'genres': data.iloc[movie_index]['genres'],
					'runtime': data.iloc[movie_index]['runtime'],
					'poster': data.iloc[movie_index]['poster'],
				}
			]
        for i in movies_list:
            recommended_movie = data.iloc[i[0]]
            recommended_movies.append({
				'movieId':recommended_movie['movieId'],
				'title': recommended_movie['title'],
				'keywords': recommended_movie['keywords'],
				'release_date': recommended_movie['release_date'],
				'genres': recommended_movie['genres'],
				'runtime': recommended_movie['runtime'],
				'poster': recommended_movie['poster'],
				'similarity_score': i[1]
			})
        recommended_movies_df = pd.DataFrame(recommended_movies)
        response = recommended_movies_df.iloc[1:].to_dict(orient='records')
        return {"success": True, "data": response, "message": "Data successfully retrieved."}
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Server Error!")

def recommend_key_word_based(movieId:int):
    try:
        movie_index = data[data['movieId'] == movieId].index[0]
        distances = normalized_similarities[movie_index]
        movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:20]  # Adjusted to recommend 12 movies
        recommended_movies = [
             {
                'movieId': data.iloc[movie_index]['movieId'], 
                'title': data.iloc[movie_index]['title'], 
                'keywords': data.iloc[movie_index]['keywords'],
                'release_date': data.iloc[movie_index]['release_date'],
                'genres': data.iloc[movie_index]['genres'],
                'runtime': data.iloc[movie_index]['runtime'],
                'poster': data.iloc[movie_index]['poster'],
            }
        ]
        for i in movies_list:
               recommended_movie = data.iloc[i[0]]
               recommended_movies.append({
                'movieId':recommended_movie['movieId'],
				'title': recommended_movie['title'],
				'keywords': recommended_movie['keywords'],
				'release_date': recommended_movie['release_date'],
                'genres': recommended_movie['genres'],
                'runtime': recommended_movie['runtime'],
                'poster': recommended_movie['poster'],
				'similarity_score': i[1]
			})
        recommended_movies_df = pd.DataFrame(recommended_movies)
        response = recommended_movies_df.iloc[1:].to_dict(orient='records')
        return {"success": True, "data": response, "message": "Data successfully retrieved."}
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Server Error!")