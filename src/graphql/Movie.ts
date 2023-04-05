import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { Movie, User } from "../entities";
import { Context } from "../types/Context";
import { resolve } from "path";

export const MovieType = objectType({
  name: "Movie",
  definition(t) {
    t.nonNull.int("id"),
      t.nonNull.string("movieName"),
      t.nonNull.string("description"),
      t.nonNull.string("directorName"),
      t.nonNull.string("releaseDate"),
      t.nonNull.string("createdId"),
      t.field("createdBy", {
        type: "User",
        resolve(parent, _args, _context, _info): Promise<User | null> {
          return User.findOne({ where: { id: parent.creator } });
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
        if (!movie) throw new Error("Review not found.");
        console.log('hello',movie)
        return [movie];
      },
    });
    t.nonNull.list.nonNull.field("searchMovie", {
      type: "Movie",
      args: {
        page: intArg(),
        limit: intArg(),
      },
      async resolve(_parent, args, _context, _info) {
        try {
          const page = args?.page || 1;
          const limit = args?.limit || 10;
          const offset = limit * (page - 1);
          console.log(page,limit,offset,'1111')
          const movies = await Movie.find({
            where: {
              movieName: `${args.movieName}`,
              description: `${args.description}`,
            },
            skip: offset,
            take: limit,
          });
          console.log(movies, "adasd111");
          return movies;
        } catch (error) {
          console.log(error);
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

          const { userId } = context;
          if (!userId) {
            throw new Error("Not Allowed to perform this action.");
          }
          const movie = await Movie.findOne({ where: { id } });
          if (!movie) {
            throw new Error("Movie not found.");
          }
          if (movie.creatorId !== id) {
            throw new Error("Not Allowed to perform this action.");
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
          console.log(error);
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
            throw new Error("Not Authorized to perform this action.");
          args.creatorId = userId;
          return Movie.create({
            movieName,
            description,
            directorName,
            releaseDate,
            creatorId: args.creatorId,
          }).save();
        } catch (error) {
          console.log(error);
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
          if (!userId) throw new Error("Unauthorized to perform this action.");
          const movie = await Movie.findOne({ where: { id } });
          if (!movie) throw new Error("Movie does not exist.");
          if (movie.creatorId !== userId)
            throw new Error("Unauthorized to perform this action.");
          await Movie.delete(id);
          return true;
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});
