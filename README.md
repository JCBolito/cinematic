# Cinematic

A movie recommender system that demonstrates the movie recommendations made by the Content-based Filtering algorithm and the enhanced Content-based Filtering algorithm developed by Aranzamendez, Bolito, and Rafe (2024) which utilizes Maximal Marginal Relevance, Temporary Preference Profile, and FastText under the hood.

## Requirements

1. [Node.js](https://nodejs.org/en/download)
1. Node Package Manager (Included in the installation process of Node.js)
1. [Python](https://code.visualstudio.com/docs/python/python-tutorial)

## Set-up

### `/next-app` directory

1. Go to the `/next-app` directory.
1. Run `npm install`.
1. Setup and connect your Vercel Postgres storage to the `/next-app` directory as seen in the [official documentation](https://vercel.com/docs/storage/vercel-postgres/quickstart). Once completed, this will automatically generate environment variables that you should add to your `.env.local` file.
1. Run `npm run db:push` in your terminal to initialize the database schema of your Vercel Postgres storage.
1. Go to [The Movie Database](https://www.themoviedb.org/). Create an account and acquire your API key. For more information, read their [official documentation](https://developer.themoviedb.org/docs/getting-started). Once you have acquired the API key, store it as `TMDB_TOKEN` in your `.env.local` file.
1. Once you have a `.env.local` file identical to the contents of `.env.local.example`, run `npm run dev` in the terminal to run the Next.js app locally.
1. Using an API testing platform like Postman or Insomnia, do a `POST` request to `http://localhost:3000/api/initialize-database` to fill your database with data from The Movie Database. This may take a while to finish.

#### Notes

- Going to `http://localhost:3000/movies` may throw some errors since you have yet to setup your `/fast-api` directory.
- If you only want to setup your PostgreSQL locally, you may do so by referring to [Drizzle's official documentation](https://orm.drizzle.team/docs/overview).

### `/fast-api` directory

1. Once you're done setting up the `next-app` directory (its development environment should still be running), go to the `/fast-api` directory.
1. Run `pip install -r requirements.txt` to install the necessary dependencies.
1. Run `python main.py` in the terminal to run your FastAPI code. The application should now work properly.

#### Notes

- For a faster build time, the actual code for FastText is not included. Instead, FastText was utilized to create the `normalized_similarity_keywords.pkl` file in the `/pickle` directory.

## System Walkthrough and Screenshots

1. To enable the functionality of user profiles, authentication is a must to store and generate the necessary user information. The Login Page is routed at the root of the web app as seen in the following image.
   ![Login Page](/screenshots/1.%20Login.jpeg)
1. If the user does not have an account, they may click the “Sign up” link in the Login Page and they will be redirected to the Sign-Up Page where they can create their own account once they have filled up the necessary information.
   ![Sign In Page](/screenshots/2.%20Signup.jpeg)
1. Once the user has an account, they may now input their credentials in the Login Page and once they log in successfully, they will be redirected to the Home Page where the movies will be listed. Users can browse movies through pagination or search for specific movies they wish to rate. If the user has yet to rate any movie, the original Content-based Filtering algorithm (CBF Recommendations) will not recommend any movies. To rate a movie, a user must click on the card of the movie they wish to rate.
   ![Home Page](</screenshots/3.%20Home%20(No%20Rated%20Movie%20and%20TPP).jpeg>)
1. Upon clicking the movie card of the movie, they wish to rate, they will be redirected to that movie’s page. In that movie’s page, the original and enhanced algorithm will recommend movies based on the selected movie.
   ![Movie Page](/screenshots/4.%20Movie%20Page.jpeg)
1. Once a single movie has been rated, the original algorithm will now be able to recommend movies based on the movie/s rated by the user. In contrast, the enhanced algorithm (ABR-CBF Recommendations) will only recommend movies once the user has rated at least 5 movies.
   ![Home w/ only CBF](</screenshots/5.%20Home%20(w%20Rated%20Movie%20and%20no%20TPP).jpeg>)
1. In the meantime, they will be encouraged to build their Temporary Preference Profile for the algorithm to provide recommendations while they do not have the optimal number of rated movies yet. Upon clicking the “Preference Profile” button, a modal will appear where the users are prompted to rate their preferred genres from 1 to 5 stars (1 – lowest; 5 – highest).
   ![TPP Modal](/screenshots/6.%20Preference%20Profile%20Modal.jpg)
1. Once the user has built their Preference Profile by rating their preferred genres, the enhanced algorithm will now be able to recommend movies based on their Temporary Preference Profile until such time that they have rated the optimal number of movies (in this case, 5).
   ![Home w/ CBF and TPP](</screenshots/7.%20Home%20(w%20Rated%20Movie%20and%20TPP).jpeg>)
1. Once the user has rated at least five movies, the enhanced algorithm will now recommend movies using Maximal Marginal Relevance. From the movie recommendations, they can choose how diverse they want the recommendations to be, with 0 being the most diverse, to 1 being the most relevant. They can also choose a 0.5 diversity parameter – a decent balance between diversity and relevance of movie recommendations.
   ![Home w/ CBF and ABR-CBF](</screenshots/8.%20Home%20(w%20CBF%20and%20ABR-CBF).jpeg>)
1. Users also can navigate to their Profile where they can see and search for the movies they have rated.
   ![User Profile](/screenshots/9.%20User%20Profile.jpeg)
