import { GraphQLError } from "graphql";
import * as jwt from "jsonwebtoken";

export interface AuthTokenPayload {
  userId: number;
}

export const auth = (headers: string): AuthTokenPayload => {
  const token = headers.split(" ")[1];
  if (!token) {
    throw new GraphQLError("Invalid token");
  }
  const res = jwt.verify(token, process.env.JWT_SECRET_KEY as jwt.Secret);
  return jwt.verify(
    token,
    process.env.JWT_SECRET_KEY as jwt.Secret
  ) as AuthTokenPayload;
};
 