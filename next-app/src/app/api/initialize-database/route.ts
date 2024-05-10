import {
  loadMovies,
  loadGenres,
  updateVideo,
  updateKeywords,
} from "@/database/init-data";
import { genres as genreSchema } from "@/database/schema";
import csv from "csvtojson";
import { InferSelectModel } from "drizzle-orm";

export async function POST() {
  try {
    await initializeGenres();
    // await initializeMovies();
    return Response.json({
      success: true,
    });
  } catch (e) {
    return Response.json({
      success: false,
    });
  }
}

async function getMovieImage<T>(id: string) {
  const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  };
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return data.poster_path as Promise<string>;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getVideo<T>(id: string) {
  const url = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZDNiNmY2MzY1YmVhOWJiYWRlMTQ3Nzc3OGI3ODUzMSIsInN1YiI6IjY1ZmQ3MzFlNzcwNzAwMDE2MzA4OGRlYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XaFMqASQIraaTHCoj8sBmm7duAuXh6qgfHqiCy7zlzA",
    },
  };
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return data.results[0].key as Promise<string>;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function initializeGenres() {
  const url = `https://api.themoviedb.org/3/genre/movie/list?language=en`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  };
  try {
    const res = await fetch(url, options);
    const { genres }: { genres: InferSelectModel<typeof genreSchema>[] } =
      await res.json();
    console.log(genres);
    genres.map(async (genre) => {
      await loadGenres(genre);
      console.log(`${genre.name} was added to the genres table.`);
    });
  } catch (e) {
    console.error(e);
  }
}

// MODIFY ACCORDINGLY TO AVOID RE-FETCHING
async function initializeMovies() {
  const moviesPath = "src/data/movies.csv";
  const movies = await csv().fromFile(moviesPath);
  for (let movie of movies) {
    // let fetchedImage = movie.image ?? (await getMovieImage<string>(movie.id));
    // let fetchedVideo = await getVideo(movie.id);
    let currentGenre = JSON.parse(movie.genres).map(
      (genre: { id: number; name: string }) => genre.name,
    );
    let currentKeywords: string[] = JSON.parse(movie.keywords).map(
      (keywords: { id: number; name: string }) => keywords.name,
    );
    const currentMovie = {
      movieId: +movie.id,
      title: movie.title,
      genres: currentGenre,
      release_date: movie.release_date,
      poster: "",
      overview: movie.overview,
      keywords: currentKeywords ?? "",
      runtime: +movie.runtime,
      popularity: +movie.popularity,
      vote_average: +movie.vote_average,
      vote_count: +movie.vote_count,
      video: "",
    };
    // if (fetchedImage) {
    //   currentMovie.poster = `https://image.tmdb.org/t/p/w300_and_h450_bestv2${fetchedImage}`;
    // }
    // if (fetchedVideo) {
    //   currentMovie.video = `https://www.youtube.com/watch?v=${fetchedVideo}`;
    // }
    await loadMovies(currentMovie);
    console.log(`${movie.title} was added to the movies table.`);
    // await updateVideo(currentMovie);
    // await updateKeywords(currentMovie.movieId, currentMovie.keywords);
    // console.log(`${movie.title}'s keywords was added to the table.`);
  }
}
