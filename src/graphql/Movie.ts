import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { Movie, User } from "../entities";
import { Context } from "../types/Context";
import { GraphQLError } from "graphql";
import { popErr } from "../utils/errorHandler";

export const MovieType = objectType({
  name: "Movie",
  definition(t) {
    t.nonNull.int("id"),
      t.nonNull.string("movieName"),
      t.nonNull.string("description"),
      t.nonNull.string("directorName"),
      t.nonNull.string("releaseDate"),
      t.nonNull.string("creatorId"),
      t.field("createdBy", {
        type: "User",
        resolve(parent, _args, _context, _info): Promise<User | null> {
          return User.findOne({ where: { id: parent.creatorId } });
        },
      });
  },
});

export const MoviesQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("movies", {
      type: "Movie",
      resolve(_parent, _args, _context, _info): Promise<Movie[]> {
        return Movie.find();
      },
    });
    t.nonNull.list.nonNull.field("movie", {
      type: "Movie",
      args: {
        id: nonNull(intArg()),
      },
      async resolve(_parent, args, _context, _info) {
        const { id } = args;
        const movie = await Movie.findOne({ where: { id } });
        if (!movie) throw new GraphQLError("Review not found.");
        console.log("hello", movie);
        return [movie];
      },
    });
    t.nonNull.list.nonNull.field("searchMovies", {
      type: "Movie",
      args: {
        query: nonNull(stringArg()),
        limit: intArg(),
        offset: intArg(),
        sort: stringArg(),
      },
      resolve: async (_parent, args, _context, _info) => {
        const { query, limit, offset, sort } = args;
        try {
          const queryBuilder = Movie.createQueryBuilder("movie");

          queryBuilder.where("movie.movieName ILIKE :query", {
            query: `%${query}%`,
          });

          if (sort) {
            const [field, order] = sort.split("_");
            queryBuilder.orderBy(`movie.${field}`, order as "ASC" | "DESC");
          }

          if (limit) {
            queryBuilder.limit(limit);
          }

          if (offset) {
            queryBuilder.offset(offset);
          }

          const movies = await queryBuilder.getMany();
          return movies;
        } catch (error) {
          popErr(error)
        }
      },
    });
  },
});

export const CreateMovieMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateMovie", {
      type: "Movie",
      args: {
        id: nonNull(intArg()),
        movieName: nonNull(stringArg()),
        description: nonNull(stringArg()),
        directorName: nonNull(stringArg()),
        releaseDate: nonNull(stringArg()),
      },
      async resolve(_parent, args, context: Context, _info) {
        try {
          const { id, movieName, description, directorName, releaseDate } =
            args;
          console.log(id, movieName, description, directorName, releaseDate);

          const { userId } = context;
          if (!userId) {
            throw new GraphQLError("Not Allowed to perform this action.");
          }
          const movie = await Movie.findOne({ where: { id } });
          if (!movie) {
            throw new GraphQLError("Movie not found.");
          }
          if (movie.creatorId !== id) {
            throw new GraphQLError("Not Allowed to perform this action.");
          }
          const data = {
            movieName,
            description,
            directorName,
            releaseDate,
          };
          await Movie.update({ id }, data);
          return Movie.findOne({ where: { id } });
        } catch (error) {
          popErr(error);
        }
      },
    });
    t.nonNull.field("createMovie", {
      type: "Movie",
      args: {
        movieName: nonNull(stringArg()),
        description: nonNull(stringArg()),
        directorName: nonNull(stringArg()),
        releaseDate: nonNull(stringArg()),
      },
      resolve(_parent, args, context: Context, _info): Promise<Movie> {
        try {
          const { movieName, description, directorName, releaseDate } = args;
          const { userId } = context;
          if (!userId)
            throw new GraphQLError("Not Authorized to perform this action.");
          args.creatorId = userId;
          return Movie.create({
            movieName,
            description,
            directorName,
            releaseDate,
            creatorId: args.creatorId,
          }).save();
        } catch (error) {
          popErr(error);
        }
      },
    });
    t.nonNull.field("deleteMovie", {
      type: "Movie",
      args: {
        id: nonNull(intArg()),
      },
      async resolve(_parent, args, context: Context, _info) {
        try {
          const { id } = args;
          const { userId } = context;
          if (!userId)
            throw new GraphQLError("Unauthorized to perform this action.");
          const movie = await Movie.findOne({ where: { id } });
          if (!movie) throw new GraphQLError("Movie does not exist.");
          if (movie.creatorId !== userId)
            throw new GraphQLError("Unauthorized to perform this action.");
          await Movie.delete(id);
          return true;
        } catch (error) {
          popErr(error);
        }
      },
    });
  },
});
