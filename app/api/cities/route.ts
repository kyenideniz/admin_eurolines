import { db, storage } from '@/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const formData = await req.formData();
        const name = formData.get('name') as string;
        const value = formData.get('value') as string;
        const file = formData.get('file') as File;
        const isOffered = formData.get('isOffered') === 'true';

        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        }

        if (!value) {
            return new NextResponse('Value is required', { status: 400 });
        }

        let fileUrl = '';
        if (file) {
            const storageRef = ref(storage, `cities/${file.name}`);
            await uploadBytes(storageRef, file);
            fileUrl = await getDownloadURL(storageRef);
        }

        const city = await addDoc(collection(db, 'cities'), {
            id: uuidv4(),
            name,
            value,
            url: fileUrl,
            isOffered,
            createdAt: new Date(),
        });

        console.log('Document written with ID: ', city.id);

        return NextResponse.json(city);
    } catch (e) {
        console.error('Error adding document: ', e);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const querySnapshot = await getDocs(collection(db, 'cities'));
        const cities: any[] = [];
        querySnapshot.forEach((doc) => {
            const cityData = doc.data();
            const city = {
                id: doc.id,
                ...cityData,
                hasImage: cityData.url ? true : false // Check if city has an uploaded image
            };
            cities.push(city);
        });

        return NextResponse.json(cities);

    } catch (err) {
        console.log(`[CITIES_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}