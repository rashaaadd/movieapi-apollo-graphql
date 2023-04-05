"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserType = void 0;
const nexus_1 = require("nexus");
exports.UserType = (0, nexus_1.objectType)({
    name: "User",
    definition(t) {
        t.nonNull.int("ID"),
            t.nonNull.string("userName"),
            t.nonNull.string("email"),
            t.nonNull.string("password");
    },
});
// export const UserQuery = extendType({
//   type: "Query",
//   definition(t) {
//     t.nonNull.list.nonNull.field("users", {
//       type: "User",
//       resolve(_parent, _args, _context, _info) : Promise<User[]> {
//         return User.find();
//       },
//     });
//   },
// });
// export const SignUpMutation = extendType({
//   type: "Mutation",
//   definition(t) {
//     t.nonNull.field("signUp", {
//       type: "User",
//       args: {
//         movieName: nonNull(stringArg()),
//         description: nonNull(stringArg()),
//         directorName: nonNull(stringArg()),
//         releaseDate: nonNull(stringArg()),
//         creatorID: nonNull(stringArg())
//       },
//       resolve(_parent, args, _context, _info) : Promise<User> {
//         try {
//           const { movieName, description, directorName,releaseDate, creator } = args;
//             args.releaseDate = new Date(args.releaseDate).toString();
//             return Movie.create({ movieName, description,directorName,releaseDate, creator }).save()
//         } catch (error) {
//           console.log(error)
//         }
//       },
//     });
//   },
// });
//# sourceMappingURL=Users.js.map