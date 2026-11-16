import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class AuthService {
  JWT_SECRET: string;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_SECRET = configService.get('JWT_SECRET')!;
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: registerDto.email,
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    const newUser = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    const { password, ...restUser } = await this.userRepository.save(newUser);
    return restUser;
  }

  async login(loginDto: LoginDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: loginDto.email,
    });

    let isPasswordCorrect = false;
    if (existingUser) {
      isPasswordCorrect = await this.verifyPassword(
        loginDto.password,
        existingUser.password,
      );
    }

    if (!existingUser || !isPasswordCorrect) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = this.generateTokens(existingUser);
    const { password, ...restUser } = existingUser;

    return { ...restUser, tokens };
  }

  async refreshToken(refreshToken: string) {
    const user = await this.verifyToken(refreshToken);
    const accessToken = this.generateAccessToken(user);

    return { accessToken };
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  private generateTokens(user: User) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    return this.jwtService.sign(payload, {
      secret: this.JWT_SECRET,
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(user: User) {
    const payload = { sub: user.id };

    return this.jwtService.sign(payload, {
      secret: this.JWT_SECRET,
      expiresIn: '7d',
    });
  }

  private async verifyToken(token: string) {
    try {
      const payload: { sub: number } = this.jwtService.verify(token, {
        secret: this.JWT_SECRET,
      });

      const user = await this.userRepository.findOneBy({ id: payload.sub });

      if (!user) throw new Error();
      return user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
