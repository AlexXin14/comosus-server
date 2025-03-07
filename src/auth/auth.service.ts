import { Injectable } from '@nestjs/common';
import { User } from '@src/user/entities/user.entity';
import { UserService } from '@src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDetailInput } from './dto';
import * as bcrypt from 'bcrypt';
import { isNil } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(_username: string, _password: string): Promise<any> {
    const user = await this.userService.findByUsername(_username);
    if (isNil(user)) {
      throw new Error(`User ${_username} does not exist.`);
    }

    const isValid = await bcrypt.compare(_password, user?.password);
    if (isValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    return {
      accessToken: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
      user,
    };
  }

  async register(_registerDetail: RegisterDetailInput) {
    const { email, username } = _registerDetail;
    const user = await this.userService.findByUsername(username);
    if (user) {
      throw new Error(`User ${username} already registered`);
    }

    const password = await bcrypt.hash(_registerDetail.password, 10);

    return this.userService.create({ email, username, password });
  }
}
