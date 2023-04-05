export type SortReviewArgs = {
  field: string;
  order: "ASC" | "DESC";
};

export type FilterReviewArgs = {
  movieId: number;
  userId: number;
  ratingGreaterThan: number;
  ratingLessThan: number;
};
