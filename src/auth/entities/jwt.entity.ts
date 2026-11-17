import { User } from './user.entity.js';

export class AccessTokenPayload {
  email: User['email'];
  sub: User['id'];
  role: User['role'];
}

export class RefreshTokenPayload {
  sub: User['id'];
}
