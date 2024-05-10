import { relations } from "drizzle-orm";
import {
  timestamp,
  smallint,
  serial,
  real,
  integer,
  pgTable,
  varchar,
  date,
  text,
} from "drizzle-orm/pg-core";

export const genres = pgTable("genres", {
  id: integer("id").primaryKey().notNull(),
  name: varchar("genre").notNull(),
});

export const movies = pgTable("movies", {
  movieId: integer("movieId").primaryKey().notNull(),
  title: varchar("title").notNull(),
  genres: varchar("genres")
    .references(() => genres.name)
    .array()
    .notNull(),
  keywords: varchar("keywords").array(),
  release_date: date("release_date", { mode: "string" }).notNull(),
  overview: text("overview").notNull(),
  runtime: integer("runtime").notNull(),
  poster: varchar("poster").notNull(),
  video: varchar("video"),
  popularity: real("popularity").notNull(),
  vote_average: real("vote_average").notNull(),
  vote_count: integer("vote_count").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),
});

export const ratings = pgTable("ratings", {
  id: varchar("id").primaryKey().notNull(),
  movieId: integer("movieId")
    .references(() => movies.movieId)
    .notNull(),
  username: varchar("username")
    .references(() => users.username)
    .notNull()
    .notNull(),
  rating: smallint("rating").notNull(),
  ratedAt: timestamp("ratedAt").defaultNow(),
});

export const preferences = pgTable("preferences", {
  id: varchar("id").primaryKey().notNull(),
  genreId: integer("genreId")
    .references(() => genres.id)
    .notNull(),
  username: varchar("username")
    .references(() => users.username)
    .notNull()
    .notNull(),
  rating: smallint("rating").notNull(),
});

export const usersMovieRatings = relations(users, ({ many }) => ({
  ratings: many(ratings),
}));

export const movieRatings = relations(movies, ({ many }) => ({
  ratings: many(ratings),
}));

export const userPreferences = relations(users, ({ many }) => ({
  preference: many(preferences),
}));

export const genrePreferences = relations(genres, ({ many }) => ({
  preference: many(preferences),
}));
