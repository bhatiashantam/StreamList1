declare namespace NodeJS {
  interface ProcessEnv {
    /** TMDB v3 API key (from `.env`, inlined at build time by `react-native-dotenv`). */
    TMDB_API_KEY?: string;
  }
}
