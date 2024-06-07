import { NextResponse } from "next/server";
import { db } from '@/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
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
            stops: stops.map((stop: { id: any; cityId: any; }) => ({
                id: stop.id || uuidv4(),
                cityId: stop.cityId,
            })),
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
            
            routes.push({
                id: doc.id,
                day: routeData.day.toDate(), // Assuming day is a Firestore Timestamp
                startCityId: routeData.startCityId,
                endCityId: routeData.endCityId,
                price: Number(routeData.price),
                stops: routeData.stops, // Stops are now directly part of the route document
            });
        });

        return NextResponse.json(routes);
    } catch (err:any) {
        console.error(`[ROUTES_GET] Error: ${err.message}`);
        console.error(`[ROUTES_GET] Stack: ${err.stack}`);
        return new NextResponse('Internal error', { status: 500 });
    }
}
