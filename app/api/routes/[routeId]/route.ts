import { NextResponse } from "next/server"
import { db } from '@/firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Stop } from "@/types";

export async function GET (
    req: Request,
    { params }: { params: { routeId: string }}
) {
    try {
        if(!params.routeId) {
            return new NextResponse("Route id is required", { status: 400 });
        }

        const routeDocRef = doc(db, 'routes', params.routeId);
        const routeSnapshot = await getDoc(routeDocRef);

        if (!routeSnapshot.exists()) {
            return new NextResponse("Route not found", { status: 404 });
        }

        const routeData = routeSnapshot.data();

        return NextResponse.json(routeData);
    } catch (err) {
        console.log('[ROUTE_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { routeId: string } }
) {
    try {
        const body = await req.json();
        const { day, startCityId, endCityId, price, stops } = body;

        if (!day || !startCityId || !endCityId || !price || !params.routeId) {
            return new NextResponse("Invalid data provided", { status: 400 });
        }

        const routeDocRef = doc(db, 'routes', params.routeId);
        const routeSnapshot = await getDoc(routeDocRef);

        if (!routeSnapshot.exists()) {
            return new NextResponse("Route not found", { status: 404 });
        }

        const existingStops: Stop[] = routeSnapshot.data().stops || [];

        const stopsToDelete = existingStops.filter(existingStop => {
            return !stops.some((newStop: { id: string; }) => newStop.id === existingStop.id);
        }).map(stop => stop.id);

        for (const stopId of stopsToDelete) {
            const stopDocRef = doc(db, 'routes', params.routeId, 'stops', stopId);
            await deleteDoc(stopDocRef);
        }

        const stopsToUpsert = stops.map((stop: { id: any; cityId: string; }) => ({
            id: stop.id || uuidv4(),
            cityId: stop.cityId === 'N/A' ? null : stop.cityId,
        }));

        for (const stop of stopsToUpsert) {
            const stopDocRef = doc(db, 'routes', params.routeId, 'stops', stop.id);
            await setDoc(stopDocRef, stop, { merge: true });
        }

        await updateDoc(routeDocRef, {
            day,
            startCityId,
            endCityId,
            price,
        });

        return NextResponse.json({ message: "Route updated successfully" });
    } catch (err) {
        console.log('[ROUTE_PATCH]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}


//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: { routeId: string }}
) {
    try {
        if (!params.routeId) {
            return new NextResponse("Route id is required", { status: 400 });
        }

        const routeDocRef = doc(db, 'routes', params.routeId);
        const routeSnapshot = await getDoc(routeDocRef);

        if (!routeSnapshot.exists()) {
            return new NextResponse("Route not found", { status: 404 });
        }

        await deleteDoc(routeDocRef);

        return NextResponse.json({ message: "Route deleted successfully" });
    } catch (err) {
        console.log('[ROUTE_DELETE]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}
