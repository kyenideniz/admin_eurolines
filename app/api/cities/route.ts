import { NextResponse } from "next/server";

import { v4 as uuidv4 } from 'uuid';
import { db } from '@/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        //const { userId } = auth();
        const body = await req.json();

        const { name, value } = body; 

        /*if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }*/

        if (!name) {
            return new NextResponse("Name is required", { status: 400});
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400});
        }

        const city = await addDoc(collection(db, 'cities'), {
            id: uuidv4(),
            name,
            value,
            createdAt: new Date(),
            });
            console.log('Document written with ID: ', city.id);
        
        return NextResponse.json(city);

    } catch (e) {
        console.error('Error adding document: ', e);
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
            cities.push({ id: doc.id, ...doc.data() });
        });

        return NextResponse.json(cities);

    } catch (err) {
        console.log(`[CITIES_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}