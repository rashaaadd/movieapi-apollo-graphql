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
exports.CreateMovieMutation = exports.MoviesQuery = exports.MovieType = void 0;
const nexus_1 = require("nexus");
const entities_1 = require("../entities");
const graphql_1 = require("graphql");
const errorHandler_1 = require("../utils/errorHandler");
exports.MovieType = (0, nexus_1.objectType)({
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
                resolve(parent, _args, _context, _info) {
                    return entities_1.User.findOne({ where: { id: parent.creator } });
                },
            });
    },
});
exports.MoviesQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("movies", {
            type: "Movie",
            resolve(_parent, _args, _context, _info) {
                return entities_1.Movie.find();
            },
        });
        t.nonNull.list.nonNull.field("movie", {
            type: "Movie",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            resolve(_parent, args, _context, _info) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id } = args;
                    const movie = yield entities_1.Movie.findOne({ where: { id } });
                    if (!movie)
                        throw new graphql_1.GraphQLError("Review not found.");
                    console.log('hello', movie);
                    return [movie];
                });
            },
        });
        t.nonNull.list.nonNull.field("searchMovie", {
            type: "Movie",
            args: {
                page: (0, nexus_1.intArg)(),
                limit: (0, nexus_1.intArg)(),
            },
            resolve(_parent, args, _context, _info) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const page = (args === null || args === void 0 ? void 0 : args.page) || 1;
                        const limit = (args === null || args === void 0 ? void 0 : args.limit) || 10;
                        const offset = limit * (page - 1);
                        console.log(page, limit, offset, '1111');
                        const movies = yield entities_1.Movie.find({
                            where: {
                                movieName: `${args.movieName}`,
                                description: `${args.description}`,
                            },
                            skip: offset,
                            take: limit,
                        });
                        console.log(movies, "adasd111");
                        return movies;
                    }
                    catch (error) {
                        (0, errorHandler_1.popErr)(error);
                    }
                });
            },
        });
    },
});
exports.CreateMovieMutation = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("updateMovie", {
            type: "Movie",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                movieName: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                description: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                directorName: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                releaseDate: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(_parent, args, context, _info) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { id, movieName, description, directorName, releaseDate } = args;
                        console.log(id, movieName, description, directorName, releaseDate);
                        const { userId } = context;
                        if (!userId) {
                            throw new graphql_1.GraphQLError("Not Allowed to perform this action.");
                        }
                        const movie = yield entities_1.Movie.findOne({ where: { id } });
                        if (!movie) {
                            throw new graphql_1.GraphQLError("Movie not found.");
                        }
                        if (movie.creatorId !== id) {
                            throw new graphql_1.GraphQLError("Not Allowed to perform this action.");
                        }
                        const data = {
                            movieName,
                            description,
                            directorName,
                            releaseDate,
                        };
                        yield entities_1.Movie.update({ id }, data);
                        return entities_1.Movie.findOne({ where: { id } });
                    }
                    catch (error) {
                        (0, errorHandler_1.popErr)(error);
                    }
                });
            },
        });
        t.nonNull.field("createMovie", {
            type: "Movie",
            args: {
                movieName: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                description: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                directorName: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                releaseDate: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(_parent, args, context, _info) {
                try {
                    const { movieName, description, directorName, releaseDate } = args;
                    const { userId } = context;
                    if (!userId)
                        throw new graphql_1.GraphQLError("Not Authorized to perform this action.");
                    args.creatorId = userId;
                    return entities_1.Movie.create({
                        movieName,
                        description,
                        directorName,
                        releaseDate,
                        creatorId: args.creatorId,
                    }).save();
                }
                catch (error) {
                    (0, errorHandler_1.popErr)(error);
                }
            },
        });
        t.nonNull.field("deleteMovie", {
            type: "Movie",
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
                        const movie = yield entities_1.Movie.findOne({ where: { id } });
                        if (!movie)
                            throw new graphql_1.GraphQLError("Movie does not exist.");
                        if (movie.creatorId !== userId)
                            throw new graphql_1.GraphQLError("Unauthorized to perform this action.");
                        yield entities_1.Movie.delete(id);
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
//# sourceMappingURL=Movie.js.map