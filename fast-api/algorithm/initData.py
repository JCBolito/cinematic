import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from db.data import getAllMovies

def initData():
	allMovies = getAllMovies()
	movies_df = pd.json_normalize(allMovies)
	vectorizer = TfidfVectorizer()
	df_movies_tf_idf_described = vectorizer.fit_transform(movies_df["genres"].astype(str))
	m2m = cosine_similarity(df_movies_tf_idf_described)
	df_tfidf_m2m = pd.DataFrame(m2m)
	index_to_movie_id = movies_df["movieId"]
	df_tfidf_m2m.columns = [str(index_to_movie_id[int(col)]) for col in df_tfidf_m2m.columns]
	df_tfidf_m2m.index = [index_to_movie_id[idx] for idx in df_tfidf_m2m.index]  # type: ignore
	return movies_df, df_movies_tf_idf_described, m2m, vectorizer