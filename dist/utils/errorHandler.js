"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.popErr = void 0;
const graphql_1 = require("graphql");
class DuplicateError extends Error {
}
const popErr = (err) => {
    var _a;
    console.log(err);
    if ((err === null || err === void 0 ? void 0 : err.name) === "SequelizeUniqueConstraintError")
        throw new graphql_1.GraphQLError(`${(_a = err === null || err === void 0 ? void 0 : err.errors[0]) === null || _a === void 0 ? void 0 : _a.message} !`);
    throw new graphql_1.GraphQLError(err === null || err === void 0 ? void 0 : err.message);
};
exports.popErr = popErr;
//# sourceMappingURL=errorHandler.js.map