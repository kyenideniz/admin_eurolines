import { auth as clerkAuth } from "@clerk/nextjs/server";
import { admin } from '@/lib/firebase/firebaseAdmin';

export default async function handler(req:any, res:any) {
    if (req.method === 'POST') {
        const { userId } = clerkAuth();
        if (userId){
            try {
                const customToken = await admin.auth().createCustomToken(userId);
                res.status(200).json({ customToken });
            } catch (error) {
                console.error('Error creating custom token:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
