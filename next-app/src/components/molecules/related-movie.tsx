import Image from "next/image";
import Link from "next/link";

export default function RelatedMovie() {
  return (
    <Link className="flex items-start gap-4" href="#">
      <Image
        alt="Movie Poster"
        className="aspect-[2/3] overflow-hidden rounded-lg border border-neutral-200 object-cover  dark:border-neutral-800"
        height={225}
        src="/placeholder.svg"
        width={150}
      />
      <div className="grid gap-1.5">
        <h3 className="text-lg font-bold">
          The Sound of the Sixties: A Musical Revolution
        </h3>
        <p className="text-sm leading-snug text-neutral-100 dark:text-neutral-800">
          Experience the magic of the 1960s with this captivating musical
          journey. From the British Invasion to the rise of Motown, this film
          celebrates the iconic sounds of the sixties.
        </p>
      </div>
    </Link>
  );
}
