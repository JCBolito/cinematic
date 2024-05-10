from fastapi import HTTPException
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from db.data import getUserMovieRatings
from .initData import initData

movies_df, df_movies_tf_idf_described, m2m, vectorizer = initData()
async def getCbfRecommendations(username: str):
    try:
        userRatings = getUserMovieRatings(username)
        if (len(userRatings) < 1):
            return HTTPException(status_code=400, detail="Rated movies must be greater than 0.")

        # User Ratings Dataframe
        df_user_ratings = pd.json_normalize(userRatings)
        df_user_data_with_tags = movies_df.reset_index().merge(
            df_user_ratings, on='movieId')
        df_user_data_with_tags['weight'] = df_user_data_with_tags['rating']/5.
        df_user_data_with_tags_sorted = df_user_data_with_tags.sort_values(
            by='rating', ascending=False)
        df_user_data_with_tags_sorted[['title', 'genres', 'weight']]
        # Calculate User Profile
        user_profile = np.dot(df_movies_tf_idf_described[df_user_data_with_tags_sorted.index.values].toarray(  # type: ignore
        ).T, df_user_data_with_tags_sorted['weight'].values)  # type: ignore

        # Calculate Cosine Similarity
        C = cosine_similarity(np.atleast_2d(user_profile),
                              df_movies_tf_idf_described) # type: ignore

        # Sort Similarities and Get Recommendations
        R = np.argsort(C)[:, ::-1]

        # Get similarity scores for the recommended items
        recommendations = [
            i for i in R[0] if i not in df_user_data_with_tags_sorted.index.values][:15]
        recommended_movies = movies_df.loc[recommendations]
        # Adding similarity scores to the DataFrame
        recommended_movies['similarity_score'] = C[0, recommendations]
        response = recommended_movies.to_dict('records')
        return {"success": True, "data": response, "message": "Data successfully retrieved."}

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Server Error!")