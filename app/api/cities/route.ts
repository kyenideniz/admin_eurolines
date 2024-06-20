import { db, storage } from '@/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { City } from '@/types';

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
        const price = formData.get('price');

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
            price,
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
        const { searchParams } = new URL(req.url);

        // Convert the iterator to an array
        const queryParamsArray = Array.from(searchParams.entries());

        // Dynamic filter function
        const filterCities = (cityData: any) => {
            for (const [key, value] of queryParamsArray) {
                // Handle boolean parameters separately
                if (key === 'isOffered') {
                    // Convert query parameter value to boolean
                    const queryValue = value === 'true';
                    if (cityData[key] !== queryValue) {
                        return false; // Skip if city does not match query parameter
                    }
                } else {
                    // For non-boolean parameters, check for partial match
                    if (!cityData[key]?.includes(value)) {
                        return false; // Skip if city does not match query parameter
                    }
                }
            }
            return true; // Include city if it matches all query parameters
        };

        const querySnapshot = await getDocs(collection(db, 'cities'));
        const cities: any[] = [];
        querySnapshot.forEach((doc) => {
            const cityData = doc.data();
            
            // Filter based on query parameters
            if (!filterCities(cityData)) {
                return; // Skip if city does not match any query parameter
            }

            const timestamp = cityData.createdAt;
            const date = timestamp.toDate();
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();

            const city = {
                docId: doc.id,
                id: doc.id,
                ...cityData,
                createdAt: `${month} ${year}`,
                hasImage: cityData.url ? true : false,
            };
            cities.push(city);
        });

        // Log query parameters and filtered cities
        //console.log('Query Parameters:', queryParamsArray);
        //console.log('Filtered Cities:', cities);

        return NextResponse.json(cities);

    } catch (err) {
        console.log(`[CITIES_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500 })
    }
}