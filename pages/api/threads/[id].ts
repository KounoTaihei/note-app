import { Thread } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Thread | null>) {
    const method = req.method;
    switch (method) {
        case 'GET': {
            const id: string = req.query.id.toString();
            const thread = await prisma.thread.findUnique({ where: { id } });
            res.json(thread);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}