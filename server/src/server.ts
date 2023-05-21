import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const port = 3333;
const app = fastify();
const prisma = new PrismaClient();

app.get('/hello', async () => {
    const users = await prisma.user.findMany();

    return users;
});

app.listen({
    port,
}).then(() => {
    console.log('HTTP server running on port ' + port);
});