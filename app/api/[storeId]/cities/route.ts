// POST function to add a document
import { db, storage } from '@/lib/firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebase/firebaseAdmin';
import { auth as clerkAuth } from "@clerk/nextjs/server";
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const auth = getAuth();

        const { userId } = clerkAuth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
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

        const formData = await req.formData();
        const name = formData.get('name') as string;
        const value = formData.get('value') as string;
        const file = formData.get('file') as File;
        const isOffered = formData.get('isOffered') === 'true';
        const price = formData.get('price');

        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        }

        if (!value) {
            return new NextResponse('Value is required', { status: 400 });
        }

        let fileUrl = '';
        if (file) {      
            const storageRef = ref(storage, `${params.storeId}/cities/${uuidv4()}`);
            await uploadBytes(storageRef, file);
            fileUrl = await getDownloadURL(storageRef);
        }

        // Ensure the collection reference is correctly structured
        const storeRef = await admin.firestore().collection('stores').doc(params.storeId);
        const citiesCollectionRef = storeRef.collection('cities');
        const city = await citiesCollectionRef.add({
            id: uuidv4(),
            name,
            value,
            url: fileUrl,
            isOffered,
            createdAt: new Date(),
            price,
        });

        console.log('Document written with ID: ', city.id);
        return NextResponse.json(city);
    } catch (e) {
        console.error('Error adding document: ', e);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { searchParams } = new URL(req.url);

        // Convert the iterator to an array
        const queryParamsArray = Array.from(searchParams.entries());

        // Dynamic filter function
        const filterCities = (cityData: any) => {
            for (const [key, value] of queryParamsArray) {
                if (key === 'price') {
                    // Convert query parameter value to number
                    const queryValue = Number(value);
                    if (cityData[key] !== queryValue) {
                        return false; // Skip if city does not match query parameter
                    }
                } else {
                    // For other parameters, check for partial match
                    const cityValue = cityData[key];
                    if (typeof cityValue === 'string' || Array.isArray(cityValue)) {
                        if (!cityValue.includes(value)) {
                            return false; // Skip if city does not match query parameter
                        }
                    } else {
                        return false; // Skip if city value is not a string or array
                    }
                }
            }
            return true; // Include city if it matches all query parameters
        };

        // Firestore query to fetch cities
        const citiesCollectionRef = collection(db, `stores/${params.storeId}/cities`);
        const q = query(citiesCollectionRef, orderBy('createdAt', 'desc'));

        const querySnapshot = await getDocs(q);
        const cities: any[] = [];

        querySnapshot.forEach((doc) => {
            const cityData = doc.data();

            // Filter based on query parameters
            if (!filterCities(cityData)) {
                return; // Skip if city does not match any query parameter
            }

            cities.push({
                id: doc.id,
                name: cityData.name,
                value: cityData.value,
                url: cityData.url,
                isOffered: cityData.isOffered,
                createdAt: cityData.createdAt.toDate(), // Convert Firestore Timestamp to JavaScript Date
                price: Number(cityData.price),
            });
        });

        return NextResponse.json(cities);
    } catch (err) {
        console.error('[GET_CITIES]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}