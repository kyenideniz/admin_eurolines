import { db, storage } from '@/firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { NextResponse } from "next/server"


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
        return new NextResponse(`Internal error`, { status: 500})
    }
}
export async function PATCH(
    req: Request,
    { params }: { params: { cityId: string } }
) {
    try {
        const formData = await req.formData();

        const name = formData.get('name') as string;
        const value = formData.get('value') as string;
        const isOffered = formData.get('isOffered') === 'true';
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

        const cityDocRef = doc(db, 'cities', params.cityId);

        if (file) {
            const storageRef = ref(storage, `cities/${params.cityId}/${file.name}`);
            await uploadBytes(storageRef, file);
            const fileUrl = await getDownloadURL(storageRef);

            await updateDoc(cityDocRef, {
                name,
                value,
                isOffered,
                url: fileUrl
            });
        } else {
            await updateDoc(cityDocRef, {
                name,
                value,
                isOffered
            });
        }

        return new NextResponse(JSON.stringify({ message: 'City updated successfully' }), { status: 200 });
    } catch (err) {
        console.log('[CITY_PATCH]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

//// Delete Method
export async function DELETE (
    req: Request,
    { params }: { params: { cityId: string }}
) {
    try {
        if (!params.cityId) {
            return new NextResponse("City id is required", { status: 400 });
        }

        const cityDocRef = doc(db, 'cities', params.cityId);
        
        await deleteDoc(cityDocRef);

        return new NextResponse(JSON.stringify({ message: 'City deleted successfully' }), { status: 200 });
    } catch (err) {
        console.log('[CITY_DELETE]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}