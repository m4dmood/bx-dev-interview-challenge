import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./services/auth/auth.service";
import { AuthController } from "./controllers/auth/auth.controller";
import { JwtStrategy } from "./utils/jwt.strategy";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}