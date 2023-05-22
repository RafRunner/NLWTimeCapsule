import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import prisma from '../lib/prisma';

export default async function memoriesRoute(app: FastifyInstance) {
    app.get('/memories', async () => {
        const memories = await prisma.memory.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        const charLimit = 115;

        return memories.map((memory) => {
            const limited = memory.content.length > charLimit;

            return {
                id: memory.id,
                coverUrl: memory.coverUrl,
                exerpt: limited ? memory.content.substring(0, 115).concat('...') : memory.content,
            };
        });
    });

    app.get('/memories/:id', async (request: FastifyRequest) => {
        const paramsRequest = z.object({
            id: z.string().uuid(),
        });

        const { id } = paramsRequest.parse(request.params);

        const memory = await prisma.memory.findFirstOrThrow({
            where: {
                id,
            },
        });

        return memory;
    });

    app.post('/memories', async (request: FastifyRequest) => {
        const bodyRequest = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false),
        });

        const { isPublic, coverUrl, content } = bodyRequest.parse(request.body);

        const memory = await prisma.memory.create({
            data: {
                content,
                coverUrl,
                isPublic,
                userId: '3264b5a0-0d22-462f-bad4-aad6d4480853',
            },
        });

        return memory;
    });

    app.put('/memories/:id', async (request: FastifyRequest) => {
        const bodyRequest = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false),
        });

        const paramsRequest = z.object({
            id: z.string().uuid(),
        });

        const { id } = paramsRequest.parse(request.params);

        const { isPublic, coverUrl, content } = bodyRequest.parse(request.body);

        const memory = await prisma.memory.update({
            where: {
                id,
            },
            data: {
                content,
                coverUrl,
                isPublic,
            },
        });

        return memory;
    });

    app.delete('/memories/:id', async (request: FastifyRequest) => {
        const paramsRequest = z.object({
            id: z.string().uuid(),
        });

        const { id } = paramsRequest.parse(request.params);

        const memory = await prisma.memory.delete({
            where: {
                id,
            },
        });

        return memory;
    });
}
