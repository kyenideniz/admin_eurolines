// pages/api/stores.js
import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from '@/firebaseConfig';
import { auth as clerkAuth } from "@clerk/nextjs/server";
import { admin } from '@/lib//firebase/firebaseAdmin'; // Ensure this path is correct
import { getAuth, signInWithCustomToken } from "firebase/auth";

export async function POST(req: NextRequest) {
    try {
        // Get Firebase Auth
        const auth = getAuth();
        // Verify user authentication with Clerk
        const { userId } = clerkAuth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Optionally, generate a Firebase custom token for the authenticated user
        const customToken = await admin.auth().createCustomToken(userId);
        
        await signInWithCustomToken(auth, customToken).then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("signed in")
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });

        // Use the Firebase Admin SDK to interact with Firestore
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Add store information to Firestore
        const storeRef = await admin.firestore().collection('stores').add({
            name,
            userId,
        });

        const newStore = {
            id: storeRef.id,
            name,
            userId,
        };

        return NextResponse.json(newStore);

    } catch (err: any) {
        console.error(`[STORES_POST] Error: ${err.message}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}
