declare namespace NodeJS {
  interface ProcessEnv {
    /** TMDB v3 API key (from `.env`, inlined at build time by `react-native-dotenv`). */
    TMDB_API_KEY?: string;
    /** Optional alias for `TMDB_API_KEY` if your `.env` uses this name instead. */
    API_KEY?: string;
  }
}
