import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT } from "src/utils/constants";
import { JwtPayloadModel, ReqUserModel } from "../models";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env[JWT.SECRET]
    });
  }

  async validate(payload: JwtPayloadModel): Promise<ReqUserModel> {
    const reqUser = new ReqUserModel({
      id: payload.sub,
      username: payload.username
    });
    return reqUser;
  }
}