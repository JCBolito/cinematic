from fastapi import HTTPException
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from db.data import getUserMovieRatings, getUserGenreRatings
from .initData import initData
from sklearn.metrics.pairwise import linear_kernel

movies_df, df_movies_tf_idf_described, m2m, vectorizer = initData()
def mmr_content_recommender(username, diversity):
    try:
        λ = float(diversity)
    except ValueError:
        λ = 0.5

    try:
        userRatings = getUserMovieRatings(username)

        # User Ratings Dataframe
        df_user_ratings = pd.json_normalize(userRatings)
        df_user_data_with_tags = movies_df.reset_index().merge(
            df_user_ratings, on='movieId')
        df_user_data_with_tags['weight'] = df_user_data_with_tags['rating']/5.
        df_user_data_with_tags_sorted = df_user_data_with_tags.sort_values(
            by='rating', ascending=False)
        # Calculate User Profile
        user_profile = np.dot(
            df_movies_tf_idf_described[df_user_data_with_tags_sorted.index.values].toarray().T,  # type: ignore
            df_user_data_with_tags_sorted['weight'].values)  # type: ignore

        # Calculate Cosine Similarity between user profile and TF-IDF of all the movies
        C = cosine_similarity(np.atleast_2d(user_profile),
                              df_movies_tf_idf_described) # type: ignore
        # Sort similarity scores in descending order
        R = np.argsort(C)[:, ::-1]

        # Initialize a list to store the recommended movie indices and similarity scores
        user_rated_id = df_user_ratings["movieId"].tolist()
        recommended_indices = []
        recommended_similarities = []

        # Add the most similar movie (highest similarity) to the recommendation list
        recommended_indices.append(R[0][0])
        recommended_similarities.append(C[0][R[0][0]])

        # Calculate MMR scores for the rest of the movies and add the most diverse one to the recommendation list
        # Exclude the first index (already recommended)
        remaining_indices = R[0][1:]
        for i in range(1, 15):  # Recommend 15 movies (excluding the input movie)
            mmr_scores = [calculate_mmr_score(
                idx, recommended_indices, λ, m2m) for idx in remaining_indices[:1500]]
            max_mmr_index = remaining_indices[np.argmax(mmr_scores)]
            # Append the selected index to the recommended list
            recommended_indices.append(max_mmr_index)
            recommended_similarities.append(C[0][max_mmr_index])

            # Remove the selected index from the remaining indices
            remaining_indices = np.delete(
                remaining_indices, np.where(remaining_indices == max_mmr_index))

            # Get similarity scores for the recommended items
        curr_mmr_movie_ids = movies_df['movieId'].iloc[recommended_indices].values # type: ignore
        recommended_indices = [idx for idx in curr_mmr_movie_ids if idx not in user_rated_id]
        recommended_indices = [movies_df.index[movies_df['movieId']==idx][0] for idx in recommended_indices]
        recommended_movies = movies_df.loc[recommended_indices]
        recommended_movies['similarity_score'] = C[0, recommended_indices]
        # Convert the DataFrame to a list of dictionaries
        response = recommended_movies.iloc[1:].to_dict(orient='records')
        return {"success": True, "data": response, "message": "Data successfully retrieved."}
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Server Error!")


def calculate_mmr_score(item, R, λ, similarity_matrix):
    relevance_score = compute_relevance_score(item)
    max_similarity_score = max([similarity_matrix[item][r]
                               for r in R], default=0)
    mmr_score = λ * relevance_score - (1 - λ) * max_similarity_score
    return mmr_score


def compute_relevance_score(item):
    tfidf_score = df_movies_tf_idf_described[item].toarray().sum()  # type: ignore
    return tfidf_score

def feature_weighted_recommendation(username:str):
    # def feature_weighted_recommendation(user_profile):
    user_profile = getUserGenreRatings(username)
    try:
        test_df_movies = df_movies_tf_idf_described.toarray()  # type: ignore
        # Apply personalized feature weighting
        for genre, weight in user_profile.items():
            feature_index = vectorizer.vocabulary_.get(genre.lower(), -1)
            if feature_index != -1:
                test_df_movies[:, feature_index] *= weight  # type: ignore

        # Calculate average weighted genre preferences for the user
        average_weighted_genre_preferences = np.mean(test_df_movies, axis=0).reshape(1, -1)  # type: ignore

        # Cosine of User Profile and TF-IDF Matrix
        cosine_similarities = linear_kernel(average_weighted_genre_preferences, test_df_movies).flatten()
        related_items_indices = cosine_similarities.argsort()[::-1]
        top_n = 15
        recommended_movies = movies_df.loc[related_items_indices[:top_n], ['title', 'genres']]
        recommended_movies['similarity_score'] = cosine_similarities[related_items_indices[:top_n]]

        # Initialize matched recommendations list
        matched_recommendations = []

        # Initialize list to store similarity scores of matched recommendations
        similarity_scores = []

        # Count number of movies per genre based on user profile weights
        num_recommendations_per_genre = {genre: int(weight) for genre, weight in user_profile.items()}
    #     print(num_recommendations_per_genre)

        # Count total number of recommendations to make
        total_recommendations = max(15, sum(num_recommendations_per_genre.values()))
        # print(total_recommendations)
        # Count number of movies recommended per genre
        num_movies_recommended = {genre: 0 for genre in user_profile}
        # print(num_recommendations_per_genre)
        if total_recommendations > 20:
            item_per_genre_limit = 2
        elif total_recommendations>15 and total_recommendations <=20:
            item_per_genre_limit=3
        else: 
            item_per_genre_limit = 4

        # Iterate through the recommended movies
        for idx in related_items_indices:
            movie = movies_df.iloc[idx]
            # Check if any genre of the recommended movie matches the user's profile
            for genre in movie['genres']:
                if genre in user_profile:
                    # Check if the maximum number of recommended movies per genre is reached
                    if num_movies_recommended[genre] < num_recommendations_per_genre[genre] and num_movies_recommended[genre] < item_per_genre_limit:
                        # Add the recommended movie to the list of matched recommendations
                        matched_recommendations.append(movie)
                        # Store the similarity score of the matched recommendation
                        similarity_scores.append(cosine_similarities[idx])
                        # Increment the count of recommended movies for this genre
                        num_movies_recommended[genre] += 1
                        break  # Stop checking other genres once a match is found
            # Check if we have reached the total number of recommendations
            if len(matched_recommendations) >= total_recommendations:
                break

        # Normalize the similarity scores such that the perfect score is 1
        max_score = max(similarity_scores)
        normalized_similarity_scores = [score / max_score for score in similarity_scores]

        # Convert the list of matched recommendations and normalized similarity scores to a DataFrame
        recommended_movies_df2 = pd.DataFrame(matched_recommendations)
        recommended_movies_df2['similarity_score'] = normalized_similarity_scores

        response = recommended_movies_df2.to_dict('records')
        return {"success": True, "data": response, "message": "Data successfully retrieved."}
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Server Error!")