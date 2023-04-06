"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewMutation = exports.ReviewQuery = exports.ReviewType = void 0;
const nexus_1 = require("nexus");
const entities_1 = require("../entities");
const errorHandler_1 = require("../utils/errorHandler");
const graphql_1 = require("graphql");
exports.ReviewType = (0, nexus_1.objectType)({
    name: "Review",
    definition(t) {
        t.nonNull.int("id"), t.nonNull.int("movieId");
        t.nonNull.int("userId");
        t.float("rating");
        t.string("comment");
        t.field("user", {
            type: "User",
            resolve(parent, _args, _context, _info) {
                return entities_1.User.findOne({ where: { id: parent.userId } });
            },
        });
        t.field("movie", {
            type: "Movie",
            resolve(parent, _args, _context, _info) {
                return entities_1.Movie.findOne({ where: { id: parent.movieId } });
            }
        });
    },
});
exports.ReviewQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("reviews", {
            type: "Review",
            args: {
                page: (0, nexus_1.intArg)(),
                limit: (0, nexus_1.intArg)(),
                filter: (0, nexus_1.stringArg)(),
                sort: (0, nexus_1.stringArg)(),
            },
            resolve(_parent, args, _context, _info) {
                return entities_1.Review.find();
            },
        });
        t.field("reviewById", {
            type: "Review",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            resolve(_parent, args, _context, _info) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { id } = args;
                        const review = yield entities_1.Review.findOne({ where: { id } });
                        if (!review) {
                            throw new graphql_1.GraphQLError(`Review not found`);
                        }
                        return review;
                    }
                    catch (error) {
                        (0, errorHandler_1.popErr)(error);
                    }
                });
            },
        });
        t.nonNull.list.nonNull.field("reviewsByMovie", {
            type: "Review",
            args: {
                movieId: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            resolve(_parent, args, _context, _info) {
                const { movieId } = args;
                return entities_1.Review.find({ where: { movieId } });
            },
        });
        t.nonNull.list.nonNull.field("reviewsByMoviePaginated", {
            type: "Review",
            args: {
                movieId: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                page: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                limit: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            resolve(_parent, args, _context, _info) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { movieId, page, limit } = args;
                        const offset = (page - 1) * limit;
                        const reviews = yield entities_1.Review.find({
                            where: { movieId },
                            skip: offset,
                            take: limit,
                        });
                        return reviews;
                    }
                    catch (error) {
                        (0, errorHandler_1.popErr)(error);
                    }
                });
            },
        });
    },
});
exports.ReviewMutation = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createReview", {
            type: "Review",
            args: {
                movieId: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                rating: (0, nexus_1.nonNull)((0, nexus_1.floatArg)()),
                comment: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(_parent, args, context, _info) {
                try {
                    const { movieId, rating, comment } = args;
                    const { userId } = context;
                    if (!userId)
                        throw new graphql_1.GraphQLError("Not Authorized to perform this action.");
                    const movie = entities_1.Movie.findOne({ where: { id: movieId } });
                    if (!movie)
                        throw new graphql_1.GraphQLError("Movie does not exist.");
                    return entities_1.Review.create({
                        movieId,
                        userId,
                        rating,
                        comment,
                    }).save();
                }
                catch (error) {
                    console.log(error);
                }
            },
        });
        t.nonNull.field("updateReview", {
            type: "Review",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                movieId: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                rating: (0, nexus_1.nonNull)((0, nexus_1.floatArg)()),
                comment: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(_parent, args, context, _info) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { id, movieId, rating, comment } = args;
                        const { userId } = context;
                        console.log(userId, "sdasd");
                        if (!userId) {
                            throw new graphql_1.GraphQLError("Not Allowed to perform this action.");
                        }
                        const review = yield entities_1.Review.findOne({ where: { id } });
                        if (!review) {
                            throw new graphql_1.GraphQLError("Movie does not exist.");
                        }
                        if (review.userId !== userId) {
                            throw new graphql_1.GraphQLError("Not Allowed to perform this action.");
                        }
                        const data = {
                            rating,
                            comment,
                        };
                        yield entities_1.Review.update({ id }, data);
                        return entities_1.Review.findOne({ where: { id } });
                    }
                    catch (error) {
                        (0, errorHandler_1.popErr)(error);
                    }
                });
            },
        });
        t.nonNull.field("deleteReview", {
            type: "Review",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            resolve(_parent, args, context, _info) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { id } = args;
                        const { userId } = context;
                        if (!userId)
                            throw new graphql_1.GraphQLError("Unauthorized to perform this action.");
                        const review = yield entities_1.Review.findOne({ where: { id } });
                        if (!review)
                            throw new graphql_1.GraphQLError("Movie does not exist.");
                        if (review.userId !== userId)
                            throw new graphql_1.GraphQLError("Unauthorized to perform this action.");
                        yield entities_1.Review.delete(id);
                        return true;
                    }
                    catch (error) {
                        (0, errorHandler_1.popErr)(error);
                    }
                });
            },
        });
    },
});
//# sourceMappingURL=Review.js.map