"use server";

// THIS ACTION GETS USED BY: find movies action, AND seed movies action

// define types for the return value of this action; to prevent annoying typescript complaints in search-forecast-form.tsx
// type export -- must import with exact name
// TODO: don't do this; just grab the schema's type that already exists
export type TmdbMovieDataType = {
  title: string;
  vote_average: number;
  release_date: string;
};

// i find this pattern of types very cool... much better than what i had before, e.g. `error: string | null`
export type TmdbActionSuccessType = {
  error: null;
  data: TmdbMovieDataType[];
};

export type TmdbActionErrorType = {
  error: string;
  data: null;
};

// the ~pipe here ("|") is typescript union type? not a normal OR operator
export type TmdbActionResultType = TmdbActionSuccessType | TmdbActionErrorType;

export async function CallTmdbApiAction(
  title: string,
): Promise<TmdbActionResultType> {
  try {
    // make API request
    // https://developer.themoviedb.org/reference/search-movie
    const titleForUrl = encodeURIComponent(title); // this changes spaces to %20 etc
    const url = `https://api.themoviedb.org/3/search/movie?query=${titleForUrl}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    const json = await response.json();
    // this action will return 10 movie search results
    const results: TmdbMovieDataType[] = json["results"].slice(0, 10);
    // console.log(Object.keys(json));
    // console.log(json);
    // console.log(result["title"]);

    if (!results) {
      throw new Error();
    }

    console.log(`>> Found ${results.length} movies`);
    return { error: null, data: results };
  } catch (err) {
    console.log(`>> Error calling TMDb API: ${err}`);
    return { error: "...", data: null };
  }
}
