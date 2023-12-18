import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  })

  afterAll(() => {
    app.close()
  })

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'vlad@gmail.com',
      password: '123',
    }
    describe('SignUp', () => {
      it('It should throw an error if email empty', () => {
        return pactum
          .spec()
          // .post('/auth/signUp')
          .post('http://localhost:3333/auth/signUp')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);
      })

      it('It should throw an error if password empty', () => {
        return pactum
          .spec()
          // .post('/auth/signUp')
          .post('http://localhost:3333/auth/signUp')
          .withBody({
            email: dto.email
          })
          .expectStatus(400);
      })

      it('should sign up', () => {
        return pactum
          .spec()
          // .post('/auth/signUp')
          .post('http://localhost:3333/auth/signUp')
          .withBody(dto)
          .expectStatus(201);
      })
    })
    describe('SignIn', () => {

      it('It should throw an error if email empty', () => {
        return pactum
          .spec()
          // .post('/auth/signUp')
          .post('http://localhost:3333/auth/signIn')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);
      })

      it('It should throw an error if password empty', () => {
        return pactum
          .spec()
          // .post('/auth/signUp')
          .post('http://localhost:3333/auth/signIn')
          .withBody({
            email: dto.email
          })
          .expectStatus(400);
      })

      it('should sign in', () => {
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signIn')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      })
    })
  })
  describe('User', () => {
    describe('Get me', () => {
      it('It should onl pass if token is available', () => {
        return pactum
          .spec()
          // .post('/auth/signUp')
          .get('http://localhost:3333/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200);
      })
    })
    describe('Edit User', () => {

    })
  })
  describe('Bookmarks', () => {
    describe('Create Bookmarks', () => {

    })
    describe('Get Bookmarks', () => {

    })
    describe('Get Bookmark by id', () => {

    })
    describe('Edit Bookmark', () => {

    })
    describe('Delete Bookmark', () => {

    })
  })

  it.todo('should pass');
})