import { db, storage } from '@/firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { NextResponse } from "next/server";
import { admin } from '@/lib/firebase/firebaseAdmin';
import { auth as clerkAuth } from "@clerk/nextjs/server";
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const querySnapshot = await getDocs(collection(db, 'cities'));
        const cities: any[] = [];
        querySnapshot.forEach((doc) => {
            cities.push({ id: doc.id, ...doc.data() });
        });

        return NextResponse.json(cities);
    } catch (err) {
        console.log(`[CITIES_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { cityId: string, storeId: string } }
) {
    try {
        const auth = getAuth();

        const { userId } = clerkAuth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const name = formData.get('name') as string;
        const value = formData.get('value') as string;
        const isOffered = formData.get('isOffered') === 'true'; // assuming the value 'true' means true, otherwise use 'false' 
        const priceValue = formData.get('price');
        const file = formData.get('file') as File | null;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if (!params.cityId) {
            return new NextResponse("City id is required", { status: 400 });
        }

        const customToken = await admin.auth().createCustomToken(userId);
        
        await signInWithCustomToken(auth, customToken).then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("signed in");
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });

        // Convert price to number
        const price = priceValue ? parseFloat(priceValue.toString()) : null;

        if (price === null || isNaN(price)) {
            return new NextResponse("Valid price is required", { status: 400 });
        }

        const cityDocRef = doc(db, `stores/${params.storeId}/cities`, params.cityId);
        const cityDoc = await getDoc(cityDocRef);

        if (!cityDoc.exists()) {
            return new NextResponse("City not found", { status: 404 });
        }

        const cityData = cityDoc.data();

        let fileUrl = cityData.url;

        if (file) {
            // Delete the old image if it exists
            if (fileUrl) {
                const oldImageRef = ref(storage, fileUrl);
                await deleteObject(oldImageRef).catch((error) => {
                    console.error("Error deleting old image: ", error);
                });
            }

            const storageRef = ref(storage, `${params.storeId}/cities/${params.cityId}/${uuidv4()}`);
            await uploadBytes(storageRef, file);
            fileUrl = await getDownloadURL(storageRef);
        }

        await updateDoc(cityDocRef, {
            name,
            value,
            isOffered,
            url: fileUrl,
            price
        });

        return new NextResponse(JSON.stringify({ message: 'City updated successfully' }), { status: 200 });
    } catch (err) {
        console.log('[CITY_PATCH]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { cityId: string, storeId: string } }
) {
    try {
        const auth = getAuth();

        const { userId } = clerkAuth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
    
        if (!params.cityId) {
            return new NextResponse("City id is required", { status: 400 });
        }

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
        
        const cityDocRef = doc(db, `stores/${params.storeId}/cities`, params.cityId);
        const cityDoc = await getDoc(cityDocRef);

        if (!cityDoc.exists()) {
            return new NextResponse("City not found", { status: 404 });
        }

        const cityData = cityDoc.data();
        const imageUrl = cityData.url;

        // If the city has an image URL, delete the image from Firebase Storage
        if (imageUrl) {
            const imageRef = ref(storage, imageUrl);

            try {
                await deleteObject(imageRef);
                console.log('Image deleted successfully');
            } catch (err) {
                console.error('Error deleting image: ', err);
            }
        }

        // Delete the city document from Firestore
        await deleteDoc(cityDocRef);

        return new NextResponse(JSON.stringify({ message: 'City deleted successfully' }), { status: 200 });
    } catch (err) {
        console.log('[CITY_DELETE]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}