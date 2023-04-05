import {
  extendType,
  floatArg,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { Movie, Review } from "../entities";
import { Context } from "../types/Context";

export const ReviewType = objectType({
  name: "Review",
  definition(t) {
    t.nonNull.int("id"), t.nonNull.int("movieId");
    t.nonNull.int("userId");
    t.float("rating");
    t.string("comment");
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
    t.nonNull.list.nonNull.field("review", {
      type: "Review",
      args: {
        id: intArg(),
      },
      async resolve(_parent, args, _context, _info){
        const { id } = args;
        const review = await Review.findOne({ where: { id } });
        if (!review) throw new Error("Review not found.");
        return [review];
      },
    });
    t.nonNull.list.nonNull.field("reviewsByMovie", {
        type : "Review",
        args: {
            page: intArg(),
            limit: intArg(),
            movieId: nonNull(intArg())
        },
        async resolve(_parent, args, _context, _info) {
            try {
                const { page, limit, movieId } = args;

                const pageNum = page || 1;
                const _limit = limit || 10;
                const _offset = _limit * ( pageNum - 1 );

                const reviews = await Review.find({
                    where: {
                      movieId,
                    },
                    skip: _offset,
                    take: _limit,
                  });
                  console.log(reviews,'adasd111')
                return reviews
            } catch (error) {
                console.log(error)
            }
        }
    })
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
          console.log({ movieId, rating, comment }, "asdas0");
          const { userId } = context;
          console.log(userId, "asdasuser");
          if (!userId)
            throw new Error("Not Authorized to perform this action.");
          const movie = Movie.findOne({ where: { id: movieId } });
          if (!movie) throw new Error("Movie does not exist.");
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
            throw new Error("Not Allowed to perform this action.");
          }
          const review = await Review.findOne({ where: { id } });
          if (!review) {
            throw new Error("Movie does not exist.");
          }
          if (review.userId !== userId) {
            throw new Error("Not Allowed to perform this action.");
          }
          const data = {
            rating,
            comment,
          };
          await Review.update({ id }, data);
          return Review.findOne({ where: { id } });
        } catch (error) {
          console.log(error);
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
          if (!userId) throw new Error("Unauthorized to perform this action.");
          const review = await Review.findOne({ where: { id } });
          if (!review) throw new Error("Movie does not exist.");
          if (review.userId !== userId)
            throw new Error("Unauthorized to perform this action.");
          await Review.delete(id);
          return true;
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});
