import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/guards";

export const appProviders = [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard
  }
];