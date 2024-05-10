import MovieCarousel from "./movie-carousel";
import {
  getCbfRecom,
  getEnhancedCbfRecom,
  getTemporaryRecom,
  getSpecificCbfRecom,
  getSpecificEcbfRecom,
} from "@/services/fast-api";

export default async function MovieRecommendations({
  algo,
  diversity,
  movieRatings,
  genreRatings,
  movieId,
}: {
  algo: "cbf" | "abrcbf";
  diversity?: number;
  movieRatings?: number;
  genreRatings?: number;
  movieId?: string;
}) {
  if (algo != "abrcbf") {
    if (movieId) {
      const data = await getSpecificCbfRecom(movieId);
      return <MovieCarousel data={data.data} />;
    }
    const data = await getCbfRecom();
    return <MovieCarousel data={data.data} />;
  } else {
    if (movieId) {
      const data = await getSpecificEcbfRecom(movieId);
      return <MovieCarousel data={data.data} />;
    }
    if (movieRatings != undefined && movieRatings < 5 && genreRatings) {
      const data = await getTemporaryRecom();
      return <MovieCarousel data={data.data} />;
    }
    const dataList = [
      await getEnhancedCbfRecom(0),
      await getEnhancedCbfRecom(0.5),
      await getEnhancedCbfRecom(1),
    ];
    if (diversity == 0) return <MovieCarousel data={dataList[0].data} />;
    else if (diversity == 1) return <MovieCarousel data={dataList[2].data} />;
    else return <MovieCarousel data={dataList[1].data} />;
  }
}
