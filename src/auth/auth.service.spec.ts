import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock_token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('should register successfully', async () => {
      usersService.findByEmail.mockRejectedValue(new Error('Not found'));
      usersService.createUser.mockResolvedValue({
        _id: '123',
        email: 'test@test.com',
        role: 'user',
      } as any);

      const result = await authService.register('test@test.com', 'password123');
      expect(result.email).toBe('test@test.com');
    });

    it('should throw ConflictException if email already exists', async () => {
      usersService.findByEmail.mockResolvedValue({
        email: 'test@test.com',
      } as any);

      await expect(
        authService.register('test@test.com', 'password123'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      usersService.findByEmail.mockResolvedValue({
        _id: '123',
        email: 'test@test.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
      } as any);

      const result = await authService.login('test@test.com', 'password123');
      expect(result.access_token).toBe('mock_token');
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      usersService.findByEmail.mockResolvedValue({
        _id: '123',
        email: 'test@test.com',
        password: await bcrypt.hash('correctpassword', 10),
        role: 'user',
      } as any);

      await expect(
        authService.login('test@test.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
