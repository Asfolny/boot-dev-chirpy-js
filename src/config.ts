export type APIConfig = {
  fileserverHits: number;
  badWords: string[];
};

export const config = {
  fileserverHits: 0,
  badWords: ["kerfuffle", "sharbert", "fornax"],
} as APIConfig;
