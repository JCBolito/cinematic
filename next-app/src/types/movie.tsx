export type T_Movie = {
  id: number;
  title: string;
  genres: T_MovieGenre[];
  release_date: string;
  poster: string;
  overview?: string;
  runtime?: number;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
};

export type T_MovieGenre = {
  id: number;
  name: string;
};
