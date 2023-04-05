"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMovieMutation = exports.MoviesQuery = exports.MovieType = void 0;
const nexus_1 = require("nexus");
const entities_1 = require("../entities");
// import { NexusGenObjects } from "../../nexus.typgen";
exports.MovieType = (0, nexus_1.objectType)({
    name: "Movie",
    definition(t) {
        t.nonNull.int("ID"),
            t.nonNull.string("movieName"),
            t.nonNull.string("description"),
            t.nonNull.string("directorName"),
            t.nonNull.string("releaseDate"),
            t.nonNull.string("createdBy");
    },
});
// let movies: NexusGenObjects["Movie"][] = [
//   {
//     ID: 1,
//     movieName: "Harry Potter",
//     description: "Chamber of Secrets",
//     directorName: "JK Rowling",
//     releaseDate: "10-04-2004",
//     createdBy: "Rashad",
//   },
//   {
//     ID: 2,
//     movieName: "Inception",
//     description: "Thriller",
//     releaseDate: "10-05-2014",
//     directorName: "Christopher Nolan",
//     createdBy: "Shahid",
//   },
// ];
exports.MoviesQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("movies", {
            type: "Movie",
            resolve(_parent, _args, _context, _info) {
                return entities_1.Movie.find();
            },
        });
    },
});
exports.CreateMovieMutation = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createMovie", {
            type: "Movie",
            args: {
                movieName: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                description: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                directorName: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                releaseDate: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                createdBy: (0, nexus_1.nonNull)((0, nexus_1.stringArg)())
            },
            resolve(_parent, args, _context, _info) {
                try {
                    console.log("Create call");
                    const { movieName, description, directorName, releaseDate, createdBy } = args;
                    args.releaseDate = new Date(args.releaseDate).toString();
                    return entities_1.Movie.create({ movieName, description, directorName, releaseDate, createdBy }).save();
                }
                catch (error) {
                    console.log(error);
                }
            },
        });
    },
});
//# sourceMappingURL=Movies.js.map