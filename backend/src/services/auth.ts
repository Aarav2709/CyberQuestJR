import argon2 from 'argon2';
import { prisma } from '../lib/prisma';
import { generateSessionToken } from '../lib/ids';
import type { RegisterInput, LoginInput, ChangePasswordInput } from '../schemas/auth';

export class AuthService {
  /**
   * Register a new user
   */
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw new Error('EMAIL_EXISTS');
    }

    const passwordHash = await argon2.hash(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        isParentGuided: input.isParentGuided,
        profile: {
          create: {
            displayName: input.displayName,
          },
        },
        streaks: {
          create: {
            currentStreak: 0,
            longestStreak: 0,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      profile: user.profile,
    };
  }

  /**
   * Login user and create session
   */
  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const validPassword = await argon2.verify(user.passwordHash, input.password);

    if (!validPassword) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
      token,
      expiresAt,
    };
  }

  /**
   * Logout user by invalidating session
   */
  async logout(token: string) {
    await prisma.session.deleteMany({
      where: { token },
    });
  }

  /**
   * Validate session token and return user
   */
  async validateSession(token: string) {
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    // Update last active time
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActiveAt: new Date() },
    });

    return session.user;
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    const validPassword = await argon2.verify(user.passwordHash, input.currentPassword);

    if (!validPassword) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const newPasswordHash = await argon2.hash(input.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Invalidate all other sessions
    await prisma.session.deleteMany({
      where: { userId },
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
  }
}

export const authService = new AuthService();
