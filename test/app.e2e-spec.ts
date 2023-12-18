import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto, EditUserDto } from 'src/auth/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

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
      it('It should only pass if token is available', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200);
      })
    })
    describe('Edit User', () => {
      const dto: EditUserDto = {
        firstName: 'Krutik',
      }
      it('It should edit the user', () => {
        return pactum
          .spec()
          .patch('http://localhost:3333/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(200)
      })
    })
  })

  describe('Bookmarks', () => {
    describe('Get Empty Bookmarks', () => {
      it('Should get bookmark', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBody([]);
      })
    })
    describe('Create Bookmarks', () => {
      const dto: CreateBookmarkDto = {
        title: 'first bookmark',
        link: 'https://youtu.be/GHTA143_b-s?si=0xALY9jadttOtVv7'
      }
      it('Should create bookmarks', () => {
        return pactum
          .spec()
          .post('http://localhost:3333/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id')
      })
    })
    describe('Get Bookmarks', () => {
      it('Should get bookmark', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
      })
    })
    describe('Get Bookmark by id', () => {
      it('Should get bookmark by id', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/bookmarks/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
      })
    })
    describe('Edit Bookmark', () => {
      it('Should edit bookmark by id', () => {
        const dto: EditBookmarkDto = {
          title: 'second bookmark'
        }
        return pactum
          .spec()
          .patch('http://localhost:3333/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(200)
      })

    })
    describe('Delete Bookmark', () => {
      it('Should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('http://localhost:3333/bookmarks/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(204)
      })
    })
    describe('Get Empty Bookmarks', () => {
      it('Should get bookmark', () => {
        return pactum
          .spec()
          .get('http://localhost:3333/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBody([]);
      })
    })
  })

  it.todo('should pass');
})