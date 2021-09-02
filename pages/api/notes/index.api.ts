import { Note, Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Note[] | Note>) {
    const method = req.method;
    switch (method) {
        case 'POST': {
            const session = await getSession({ req });
            if (!session) return res.status(401).end("Please log in");

            const userId = session.user?.id;
            const body: Prisma.NoteCreateInput = req.body;
            const note: Note = await prisma.note.create({
                data: {
                    title: body.title,
                    userId: userId
                }
            });
            res.status(200).json(note);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}