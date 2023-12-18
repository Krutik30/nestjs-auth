// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGaurd } from '../auth/guard';
import { EditUserDto } from '../auth/dto';
import { UserService } from './user.service';

@UseGuards(JwtGaurd)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) {

    }

    // get route as /users/test 
    @Get('me')
    getMe(@GetUser() user: User) {
        // console.log({ user: req.user })
        return user;
    }

    @Patch()
    editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
        return this.userService.editUser(userId, dto);
    }

}
