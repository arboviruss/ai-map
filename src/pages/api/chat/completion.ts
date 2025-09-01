// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import OpenAI from 'openai';

const ai = new OpenAI({
    apiKey: process.env['OPENAI_KEY'],
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

type Data = {
    name: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    const completion = await ai.chat.completions.create({
        model: 'gemini-2.5-flash-lite-preview-06-17',
        messages: [
          { role: 'developer', content: 'Talk like a pirate.' },
          { role: 'user', content: 'Are semicolons optional in JavaScript?' },
        ],
    });

    const response = completion.choices[0].message.content;
    
    res.status(200).json({ id: `${Date.now()}-${Math.random()}`, text: response, sender: 'ai', actions: [] });
}
