"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMutation = exports.AuthType = void 0;
const nexus_1 = require("nexus");
const argon2_1 = __importDefault(require("argon2"));
const entities_1 = require("../entities");
const jwt = __importStar(require("jsonwebtoken"));
const graphql_1 = require("graphql");
const errorHandler_1 = require("../utils/errorHandler");
exports.AuthType = (0, nexus_1.objectType)({
    name: "AuthType",
    definition(t) {
        t.nonNull.string("token");
        t.nonNull.field("user", {
            type: "User",
        });
    },
});
exports.AuthMutation = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("login", {
            type: "AuthType",
            args: {
                username: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(_parent, args, _context, _info) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { username, password } = args;
                        const user = yield entities_1.User.findOne({ where: { username } });
                        if (!user) {
                            throw new graphql_1.GraphQLError("User not found.");
                        }
                        const isValid = yield argon2_1.default.verify(user.password, password);
                        if (!isValid) {
                            throw new graphql_1.GraphQLError("Invalid Credentials.");
                        }
                        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);
                        return {
                            user,
                            token
                        };
                    }
                    catch (error) {
                        (0, errorHandler_1.popErr)(error);
                    }
                });
            }
        });
        t.nonNull.field("register", {
            type: "AuthType",
            args: {
                username: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(_parent, args, context, _info) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { username, email, password } = args;
                    const hashedPassword = yield argon2_1.default.hash(password);
                    let user;
                    let token;
                    try {
                        const result = yield context.conn
                            .createQueryBuilder()
                            .insert()
                            .into(entities_1.User)
                            .values({ username, email, password: hashedPassword })
                            .returning("*")
                            .execute();
                        user = result.raw[0];
                        token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);
                        return {
                            user,
                            token,
                        };
                    }
                    catch (error) {
                        (0, errorHandler_1.popErr)(error);
                    }
                });
            },
        });
    },
});
//# sourceMappingURL=Auth.js.map