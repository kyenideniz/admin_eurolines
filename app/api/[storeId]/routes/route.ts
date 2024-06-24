import { NextResponse } from "next/server";
import { db } from '@/lib/firebase/firebaseConfig';
import { collection, addDoc, getDocs, doc, getDoc, orderBy, query  } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { auth as clerkAuth } from "@clerk/nextjs/server";
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { admin } from "@/lib/firebase/firebaseAdmin";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
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

        const body = await req.json();
        const { day, startCityId, endCityId, price, stops } = body;

        if (!day || !startCityId || !endCityId || !price) {
            return new NextResponse("Invalid data provided", { status: 400 });
        }

        // Convert day to Firestore Timestamp
        const formattedDay = new Date(day).toISOString(); 

        // Create a new route document with stops as an array
        const storeRef = await admin.firestore().collection('stores').doc(params.storeId);
        const routesCollectionRef = storeRef.collection('routes');
        const route = await routesCollectionRef.add({
            day: formattedDay,
            startCityId,
            endCityId,
            price,
            stops,
        });

        const routeId = route.id; // Get the ID of the newly created route

        /*/ Create seats subcollection for the route
        const seatsData = Array.from({ length: 55 }, (_, i) => ({
            seatId: uuidv4(),
            seatNumber: i + 1,
            isOccupied: false,
            passengerId: null,
        }));

        for (const seat of seatsData) {
            await addDoc(collection(routesCollectionRef, 'seats'), seat);
        }*/

        // Return the newly created route data
        const newRoute = {
            id: routeId,
            day: formattedDay,
            startCityId,
            endCityId,
            price,
            stops,
            //seats: seatsData,
        };

        return NextResponse.json(newRoute);
    } catch (err) {
        console.log('[ROUTE_POST]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string }} ) {
    try {
        const { searchParams } = new URL(req.url);

        // Convert the iterator to an array
        const queryParamsArray = Array.from(searchParams.entries());

        // Dynamic filter function
        const filterRoutes = (routeData: any) => {
            for (const [key, value] of queryParamsArray) {
                if (key === 'price') {
                    // Convert query parameter value to number
                    const queryValue = Number(value);
                    if (routeData[key] !== queryValue) {
                        return false; // Skip if route does not match query parameter
                    }
                } else {
                    // For other parameters, check for partial match
                    if (!routeData[key]?.includes(value)) {
                        return false; // Skip if route does not match query parameter
                    }
                }
            }
            return true; // Include route if it matches all query parameters
        };

        const querySnapshot = await getDocs(collection(db, `stores/${params.storeId}/routes`));
        const routes: any[] = [];

        querySnapshot.forEach((doc) => {
            const routeData = doc.data();

            let day = routeData.day;
            if (day && typeof day.toDate === 'function') {
                day = day.toDate(); // Convert Firestore Timestamp to JavaScript Date
            }

            // Filter based on query parameters
            if (!filterRoutes(routeData)) {
                return; // Skip if route does not match any query parameter
            }

            routes.push({
                id: doc.id,
                day,
                startCityId: routeData.startCityId,
                endCityId: routeData.endCityId,
                price: Number(routeData.price),
                stops: routeData.stops, // Assuming stops is an array
            });
        });

        return NextResponse.json(routes);
    } catch (err) {
        console.log('[ROUTE_GET]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}
