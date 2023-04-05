export type SortMovieArgs = {
  field: string;
  order: "ASC" | "DESC";
};

export type FilterMovieArgs = {
  directorName: string;
  createdBy: number;
  releaseDateAfter: string;
  releaseDateBefore: string;
};
