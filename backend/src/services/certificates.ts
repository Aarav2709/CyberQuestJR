import { prisma } from '../lib/prisma';
import { generateUlid, generateVerificationCode } from '../lib/ids';
import type { CreateCertificateInput } from '../schemas/certificates';

export class CertificateService {
  /**
   * Create a new certificate
   */
  async createCertificate(userId: string, input: CreateCertificateInput) {
    // Validate that the user has completed the required content
    if (input.type === 'lesson' && input.lessonId) {
      const progress = await prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: { userId, lessonId: input.lessonId },
        },
      });

      if (!progress || progress.status !== 'complete') {
        throw new Error('LESSON_NOT_COMPLETED');
      }
    }

    if (input.type === 'chapter' && input.chapterId) {
      const progress = await prisma.chapterProgress.findUnique({
        where: {
          userId_chapterId: { userId, chapterId: input.chapterId },
        },
      });

      if (!progress || progress.status !== 'complete') {
        throw new Error('CHAPTER_NOT_COMPLETED');
      }
    }

    // Check if certificate already exists
    const existingCertificate = await prisma.certificate.findFirst({
      where: {
        userId,
        lessonId: input.lessonId ?? null,
        chapterId: input.chapterId ?? null,
        type: input.type,
      },
    });

    if (existingCertificate) {
      return existingCertificate;
    }

    const certificate = await prisma.certificate.create({
      data: {
        id: generateUlid(),
        userId,
        type: input.type,
        lessonId: input.lessonId,
        chapterId: input.chapterId,
        recipientName: input.recipientName,
        verificationCode: generateVerificationCode(),
        metadata: {},
      },
      include: {
        lesson: { select: { id: true, title: true } },
        chapter: { select: { id: true, title: true } },
      },
    });

    return certificate;
  }

  /**
   * Get all certificates for a user
   */
  async getUserCertificates(userId: string) {
    return prisma.certificate.findMany({
      where: { userId },
      include: {
        lesson: { select: { id: true, title: true } },
        chapter: { select: { id: true, title: true } },
      },
      orderBy: { issueDate: 'desc' },
    });
  }

  /**
   * Get a certificate by ID
   */
  async getCertificateById(certificateId: string) {
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        lesson: { select: { id: true, title: true } },
        chapter: { select: { id: true, title: true } },
        user: {
          select: {
            profile: { select: { displayName: true } },
          },
        },
      },
    });

    if (!certificate) {
      throw new Error('CERTIFICATE_NOT_FOUND');
    }

    return certificate;
  }

  /**
   * Verify a certificate by verification code (public endpoint)
   */
  async verifyCertificate(verificationCode: string) {
    const certificate = await prisma.certificate.findUnique({
      where: { verificationCode },
      include: {
        lesson: { select: { id: true, title: true } },
        chapter: { select: { id: true, title: true } },
      },
    });

    if (!certificate) {
      return {
        valid: false,
        message: 'Certificate not found or invalid verification code',
      };
    }

    return {
      valid: true,
      certificate: {
        id: certificate.id,
        recipientName: certificate.recipientName,
        type: certificate.type,
        lessonTitle: certificate.lesson?.title,
        chapterTitle: certificate.chapter?.title,
        issueDate: certificate.issueDate,
        verificationCode: certificate.verificationCode,
      },
    };
  }

  /**
   * Get certificate count for a user
   */
  async getCertificateCount(userId: string) {
    return prisma.certificate.count({ where: { userId } });
  }
}

export const certificateService = new CertificateService();
