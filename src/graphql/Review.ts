import {
  extendType,
  floatArg,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { Movie, Review, User } from "../entities";
import { Context } from "../types/Context";
import { popErr } from "../utils/errorHandler";
import { GraphQLError } from "graphql";

export const ReviewType = objectType({
  name: "Review",
  definition(t) {
    t.nonNull.int("id"), t.nonNull.int("movieId");
    t.nonNull.int("userId");
    t.float("rating");
    t.string("comment");
    t.field("user",{
      type:"User",
      resolve(parent, _args, _context, _info): Promise<User | null> {
        return User.findOne({ where: { id: parent.userId } });
      },
    })
    t.field("movie",{
      type:"Movie",
      resolve(parent,_args,_context,_info) : Promise<Movie> | null {
        return Movie.findOne({ where : { id: parent.movieId}})
      }
    })
  },
});

export const ReviewQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("reviews", {
      type: "Review",
      args: {
        page: intArg(),
        limit: intArg(),
        filter: stringArg(),
        sort: stringArg(),
      },
      resolve(_parent, args, _context, _info): Promise<Review[]> {
        return Review.find();
      },
    });
    t.field("reviewById", {
      type: "Review",
      args: {
        id: nonNull(intArg()),
      },
      async resolve(_parent, args, _context, _info) {
        try {
          const { id } = args;
          const review = await Review.findOne({ where: { id } });
          if (!review) {
            throw new GraphQLError(`Review not found`);
          }
          return review;
        } catch (error) {
          popErr(error);
        }
      },
    });
    t.nonNull.list.nonNull.field("reviewsByMovie", {
      type: "Review",
      args: {
        movieId: nonNull(intArg()),
      },
      resolve(_parent, args, _context, _info): Promise<Review[]> {
        const { movieId } = args;
        return Review.find({ where: { movieId } });
      },
    });
    t.nonNull.list.nonNull.field("reviewsByMoviePaginated", {
      type: "Review",
      args: {
        movieId: nonNull(intArg()),
        page: nonNull(intArg()),
        limit: nonNull(intArg()),
      },
      async resolve(_parent, args, _context, _info) {
        try {
          const { movieId, page, limit } = args;
          const offset = (page - 1) * limit ;
          const reviews = await Review.find({
            where: { movieId },
            skip: offset,
            take: limit,
          });
          return reviews;
        } catch (error) {
          popErr(error);
        }
      },
    });
  },
});

export const ReviewMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createReview", {
      type: "Review",
      args: {
        movieId: nonNull(intArg()),
        rating: nonNull(floatArg()),
        comment: nonNull(stringArg()),
      },
      resolve(_parent, args, context: Context, _info): Promise<Review> {
        try {
          const { movieId, rating, comment } = args;
          const { userId } = context;
          if (!userId)
            throw new GraphQLError("Not Authorized to perform this action.");
          const movie = Movie.findOne({ where: { id: movieId } });
          if (!movie) throw new GraphQLError("Movie does not exist.");
          return Review.create({
            movieId,
            userId,
            rating,
            comment,
          }).save();
        } catch (error) {
          console.log(error);
        }
      },
    });
    t.nonNull.field("updateReview", {
      type: "Review",
      args: {
        id: nonNull(intArg()),
        movieId: nonNull(intArg()),
        rating: nonNull(floatArg()),
        comment: nonNull(stringArg()),
      },
      async resolve(_parent, args, context: Context, _info) {
        try {
          const { id, movieId, rating, comment } = args;

          const { userId } = context;
          console.log(userId, "sdasd");
          if (!userId) {
            throw new GraphQLError("Not Allowed to perform this action.");
          }
          const review = await Review.findOne({ where: { id } });
          if (!review) {
            throw new GraphQLError("Movie does not exist.");
          }
          if (review.userId !== userId) {
            throw new GraphQLError("Not Allowed to perform this action.");
          }
          const data = {
            rating,
            comment,
          };
          await Review.update({ id }, data);
          return Review.findOne({ where: { id } });
        } catch (error) {
          popErr(error);
        }
      },
    });
    t.nonNull.field("deleteReview", {
      type: "Review",
      args: {
        id: nonNull(intArg()),
      },
      async resolve(_parent, args, context: Context, _info) {
        try {
          const { id } = args;
          const { userId } = context;
          if (!userId) throw new GraphQLError("Unauthorized to perform this action.");
          const review = await Review.findOne({ where: { id } });
          if (!review) throw new GraphQLError("Movie does not exist.");
          if (review.userId !== userId)
            throw new GraphQLError("Unauthorized to perform this action.");
          await Review.delete(id);
          return true;
        } catch (error) {
          popErr(error);
        }
      },
    });
  },
});
