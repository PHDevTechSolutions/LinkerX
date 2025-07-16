import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import type { NextApiRequest, NextApiResponse } from 'next';

type EmailData = {
    from: { text: string };
    to: string;
    cc: string;
    subject: string;
    date: string;
    body: string;
    attachments: {
        filename: string;
        contentType: string;
        content: string;
    }[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, imapHost, imapPass, imapPort, secure } = req.body;

    if (!email || !imapHost || !imapPass || !imapPort || typeof secure !== 'boolean') {
        return res.status(400).json({ error: 'Missing or invalid IMAP credentials' });
    }

    const client = new ImapFlow({
        host: imapHost,
        port: imapPort,
        secure,
        auth: {
            user: email,
            pass: imapPass,
        },
        tls: secure
            ? { rejectUnauthorized: false }
            : { rejectUnauthorized: true },
    });

    try {
        await client.connect();
    } catch (err: any) {
        return res.status(500).json({ error: 'IMAP connection failed: ' + err.message });
    }

    const messages: EmailData[] = [];

    try {
        const lock = await client.getMailboxLock('INBOX');

        try {
            const uids = await client.search({ all: true });

            if (!uids || uids.length === 0) {
                return res.status(200).json([]);
            }

            // ✅ Change limit from 10 to 40
            const latestUids = uids.slice(-40).reverse();

            for await (const msg of client.fetch(latestUids, { envelope: true, source: true })) {
                const envelope = msg.envelope;
                const source = msg.source;

                if (!envelope || !source) continue;

                const parsed = await simpleParser(source);

                const fromText = envelope.from?.map(
                    (f) => `${f.name || 'Unknown'} <${f.address}>`
                ).join(', ') || 'Unknown Sender';

                const toText = envelope.to?.map(
                    (t) => `${t.name || ''} <${t.address}>`
                ).join(', ') || '';

                const ccText = envelope.cc?.map(
                    (c) => `${c.name || ''} <${c.address}>`
                ).join(', ') || '';

                messages.push({
                    from: { text: fromText },
                    to: toText,
                    cc: ccText,
                    subject: envelope.subject || 'No Subject',
                    date: envelope.date ? new Date(envelope.date).toISOString() : new Date().toISOString(),
                    body: parsed.text || parsed.html || '(No content)',
                    attachments: (parsed.attachments || []).map((att) => ({
                        filename: att.filename || 'attachment',
                        contentType: att.contentType || 'application/octet-stream',
                        content: att.content.toString('base64'),
                    })),
                });
            }
        } finally {
            lock.release();
        }

        await client.logout();
        return res.status(200).json(messages);
    } catch (err: any) {
        return res.status(500).json({ error: 'Email fetch failed: ' + err.message });
    }
}
