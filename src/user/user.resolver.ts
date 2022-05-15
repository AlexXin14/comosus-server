import { Resolver, Query, Args, Int, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '@auth/guards';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'userById' })
  @UseGuards(JwtAuthGuard)
  findById(@Args('id', { type: () => Int }) _id: number) {
    return this.userService.findById(_id);
  }

  @Query(() => User, { name: 'userByUsername' })
  @UseGuards(JwtAuthGuard)
  findByUsername(@Args('username') _username: string) {
    return this.userService.findByUsername(_username);
  }
}
