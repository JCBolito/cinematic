import StarRating from "../molecules/star-rating";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getGenres } from "@/services/in-app/movies";
import {
  rateGenre,
  clearGenreRating,
} from "@/services/in-app/preference-profile";

type T_PreferenceProfile = {
  variant?: "link";
  className?: string;
};

export default async function PreferenceProfile({
  variant,
  className,
}: T_PreferenceProfile) {
  const { data } = await getGenres();

  async function handleRateGenre(value: number, id: number) {
    "use server";
    return await rateGenre(value, id);
  }

  async function clearGenrePreference(id: number) {
    "use server";
    return await clearGenreRating(id);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={variant ?? "outline"}
          className={cn("m-auto w-min", className)}
        >
          Preference Profile
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[80%] w-[90%] max-w-screen-xl gap-8 
	  overflow-auto rounded-lg pt-14"
      >
        <DialogHeader>
          <DialogTitle className="text-xl leading-5">
            Preference Profile
          </DialogTitle>
          <DialogDescription>
            A preference profile is a temporary list of genre preferences that
            will be used by ABR-CBF to recommend movies to users who do not meet
            the optimal number of rated movies.
          </DialogDescription>
        </DialogHeader>
        <section className="flex flex-wrap justify-center gap-4">
          {data.map((data) => (
            <div
              key={data.genres.id}
              className="group grid content-start items-start justify-center gap-1"
            >
              <Badge>
                <span className="w-full text-center text-sm">
                  {data.genres.name}
                </span>
              </Badge>
              <StarRating
                currentRating={data.preferences?.rating}
                id={data.genres.id}
                className="grid h-12 items-start justify-items-center gap-0"
                rateHandler={handleRateGenre}
                clearRatingHandler={clearGenrePreference}
              />
            </div>
          ))}
        </section>
      </DialogContent>
    </Dialog>
  );
}
