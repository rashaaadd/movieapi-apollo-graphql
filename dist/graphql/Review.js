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
exports.ReviewType = (0, nexus_1.objectType)({
    name: "Review",
    definition(t) {
        t.nonNull.int("id"), t.nonNull.int("movieId");
        t.nonNull.int("userId");
        t.float("rating");
        t.string("comment");
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
        t.nonNull.list.nonNull.field("review", {
            type: "Review",
            args: {
                id: (0, nexus_1.intArg)(),
            },
            resolve(_parent, args, _context, _info) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id } = args;
                    const review = yield entities_1.Review.findOne({ where: { id } });
                    if (!review)
                        throw new Error("Review not found.");
                    return [review];
                });
            },
        });
        t.nonNull.list.nonNull.field("reviewsByMovie", {
            type: "Review",
            args: {
                page: (0, nexus_1.intArg)(),
                limit: (0, nexus_1.intArg)(),
                movieId: (0, nexus_1.nonNull)((0, nexus_1.intArg)())
            },
            resolve(_parent, args, _context, _info) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { page, limit, movieId } = args;
                        const pageNum = page || 1;
                        const _limit = limit || 10;
                        const _offset = _limit * (pageNum - 1);
                        const reviews = yield entities_1.Review.find({
                            where: {
                                movieId,
                            },
                            skip: _offset,
                            take: _limit,
                        });
                        console.log(reviews, 'adasd111');
                        return reviews;
                    }
                    catch (error) {
                        console.log(error);
                    }
                });
            }
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
                    console.log({ movieId, rating, comment }, "asdas0");
                    const { userId } = context;
                    console.log(userId, "asdasuser");
                    if (!userId)
                        throw new Error("Not Authorized to perform this action.");
                    const movie = entities_1.Movie.findOne({ where: { id: movieId } });
                    if (!movie)
                        throw new Error("Movie does not exist.");
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
                            throw new Error("Not Allowed to perform this action.");
                        }
                        const review = yield entities_1.Review.findOne({ where: { id } });
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
                        yield entities_1.Review.update({ id }, data);
                        return entities_1.Review.findOne({ where: { id } });
                    }
                    catch (error) {
                        console.log(error);
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
                            throw new Error("Unauthorized to perform this action.");
                        const review = yield entities_1.Review.findOne({ where: { id } });
                        if (!review)
                            throw new Error("Movie does not exist.");
                        if (review.userId !== userId)
                            throw new Error("Unauthorized to perform this action.");
                        yield entities_1.Review.delete(id);
                        return true;
                    }
                    catch (error) {
                        console.log(error);
                    }
                });
            },
        });
    },
});
//# sourceMappingURL=Review.js.map