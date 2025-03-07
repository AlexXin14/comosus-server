import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '@auth/guards';
import { UseGuards } from '@nestjs/common';
import { FindByUsernameArgs } from './dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'userByUsername' })
  @UseGuards(JwtAuthGuard)
  findByUsername(@Args('username') { username }: FindByUsernameArgs) {
    return this.userService.findByUsername(username);
  }
}
