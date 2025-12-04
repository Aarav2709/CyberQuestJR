import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { certificateService } from '../services/certificates';
import { createCertificateSchema } from '../schemas/certificates';

export async function certificateRoutes(app: FastifyInstance) {
  /**
   * GET /certificates/verify/:code
   * Verify a certificate by verification code (public endpoint)
   */
  app.get('/verify/:code', async (request: FastifyRequest<{ Params: { code: string } }>, reply: FastifyReply) => {
    const { code } = request.params;
    const result = await certificateService.verifyCertificate(code);

    if (!result.valid) {
      return reply.status(404).send({
        success: false,
        error: { message: result.message, code: 'CERTIFICATE_NOT_FOUND' },
      });
    }

    return reply.send({
      success: true,
      data: result.certificate,
    });
  });

  // Authenticated routes
  app.register(async (authenticatedRoutes) => {
    authenticatedRoutes.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.status(401).send({
          success: false,
          error: { message: 'Not authenticated', code: 'UNAUTHORIZED' },
        });
      }
    });

    /**
     * POST /certificates
     * Create a new certificate
     */
    authenticatedRoutes.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
      const payload = request.user as { userId: string };
      const body = createCertificateSchema.safeParse(request.body);

      if (!body.success) {
        return reply.status(400).send({
          success: false,
          error: { message: 'Validation error', details: body.error.flatten() },
        });
      }

      try {
        const certificate = await certificateService.createCertificate(payload.userId, body.data);

        return reply.status(201).send({
          success: true,
          data: certificate,
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'LESSON_NOT_COMPLETED') {
            return reply.status(400).send({
              success: false,
              error: { message: 'You must complete the lesson before requesting a certificate', code: 'LESSON_NOT_COMPLETED' },
            });
          }
          if (error.message === 'CHAPTER_NOT_COMPLETED') {
            return reply.status(400).send({
              success: false,
              error: { message: 'You must complete the chapter before requesting a certificate', code: 'CHAPTER_NOT_COMPLETED' },
            });
          }
        }
        throw error;
      }
    });

    /**
     * GET /certificates
     * Get all certificates for the current user
     */
    authenticatedRoutes.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
      const payload = request.user as { userId: string };
      const certificates = await certificateService.getUserCertificates(payload.userId);

      return reply.send({
        success: true,
        data: certificates,
      });
    });

    /**
     * GET /certificates/:id
     * Get a specific certificate by ID
     */
    authenticatedRoutes.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params;

      try {
        const certificate = await certificateService.getCertificateById(id);

        return reply.send({
          success: true,
          data: certificate,
        });
      } catch (error) {
        if (error instanceof Error && error.message === 'CERTIFICATE_NOT_FOUND') {
          return reply.status(404).send({
            success: false,
            error: { message: 'Certificate not found', code: 'CERTIFICATE_NOT_FOUND' },
          });
        }
        throw error;
      }
    });
  });
}
