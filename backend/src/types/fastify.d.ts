import '@fastify/jwt';

// JWT payload type
export interface JwtPayload {
  userId: string;
}

// Augment FastifyRequest to include user property set by JWT verification
declare module 'fastify' {
  interface FastifyRequest {
    jwtVerify(): Promise<void>;
    user: JwtPayload;
  }

  interface FastifyInstance {
    jwt: {
      sign(payload: object, options?: object): string;
      verify(token: string): JwtPayload;
    };
  }
}

// Declare modules for plugins without type definitions
declare module '@fastify/cors' {
  const cors: any;
  export default cors;
}

declare module '@fastify/helmet' {
  const helmet: any;
  export default helmet;
}

declare module '@fastify/rate-limit' {
  const rateLimit: any;
  export default rateLimit;
}

declare module '@fastify/sensible' {
  const sensible: any;
  export default sensible;
}

declare module '@fastify/jwt' {
  const jwt: any;
  export default jwt;
}

// Re-export for convenience
export type AuthenticatedRequest = import('fastify').FastifyRequest & {
  user: JwtPayload;
};
