export class JwtPayloadModel {
  sub: string;
  username: string;

  constructor(params: {
    sub: string,
    username: string
  }) {
    this.sub = params.sub;
    this.username = params.username;
  }

}