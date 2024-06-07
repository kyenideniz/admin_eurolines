import { NextResponse } from "next/server";
import { db } from '@/firebaseConfig';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const body = await req.json();
        const { day, startCityId, endCityId, price, stops } = body;

        if (!day || !startCityId || !endCityId || !price) {
            return new NextResponse("Invalid data provided", { status: 400 });
        }

        // Convert day to Firestore Timestamp
        const formattedDay = new Date(day).toISOString(); 

        // Create a new route document with stops as an array
        const routeRef = await addDoc(collection(db, 'routes'), {
            day: formattedDay,
            startCityId,
            endCityId,
            price,
            stops,
        });

        const routeId = routeRef.id; // Get the ID of the newly created route

        // Create seats subcollection for the route
        const seatsData = Array.from({ length: 55 }, (_, i) => ({
            seatId: uuidv4(),
            seatNumber: i + 1,
            isOccupied: false,
            passengerId: null,
        }));

        for (const seat of seatsData) {
            await addDoc(collection(routeRef, 'seats'), seat);
        }

        // Return the newly created route data
        const newRoute = {
            id: routeId,
            day: formattedDay,
            startCityId,
            endCityId,
            price,
            stops,
            seats: seatsData,
        };

        return NextResponse.json(newRoute);
    } catch (err) {
        console.log('[ROUTE_POST]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const querySnapshot = await getDocs(collection(db, 'routes'));
        const routes: any[] = [];

        querySnapshot.forEach((doc) => {
            const routeData = doc.data();

            let day = routeData.day;
            if (day && typeof day.toDate === 'function') {
                day = day.toDate(); // Convert Firestore Timestamp to JavaScript Date
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
