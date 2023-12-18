// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGaurd } from '../auth/guard';

@UseGuards(JwtGaurd)
@Controller('users')
export class UserController {

    // get route as /users/test 
    @Get('me')
    getMe(@GetUser() user: User) {
        // console.log({ user: req.user })
        return user;
    }


}
