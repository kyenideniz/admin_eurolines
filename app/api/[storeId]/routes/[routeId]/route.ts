import { NextResponse } from "next/server"
import { db } from '@/firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, getDocs } from 'firebase/firestore';
import { admin } from '@/lib/firebase/firebaseAdmin';
import { auth as clerkAuth } from "@clerk/nextjs/server";
import { getAuth, signInWithCustomToken } from 'firebase/auth';

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

        return NextResponse.json({
            ...routeData,
            stops: routeData.Stops
        });
    } catch (err) {
        console.log('[ROUTE_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { 
        params 
    }: { 
    params: { storeId: any; routeId: string } 
}) {
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
            console.log("signed in");
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });

        const body = await req.json();
        const { day, startCityId, endCityId, price, stops } = body;

        if (!day || !startCityId || !endCityId || !price || !params.routeId) {
            return new NextResponse("Invalid data provided", { status: 400 });
        }

        const routeDocRef = doc(db, `stores/${params.storeId}/routes`, params.routeId);
        const routeSnapshot = await getDoc(routeDocRef);

        if (!routeSnapshot.exists()) {
            return new NextResponse("Route not found", { status: 404 });
        }
        console.log("stops:",stops)
        await updateDoc(routeDocRef, {
            day,
            startCityId,
            endCityId,
            price,
            stops,
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
    { params }: { params: { routeId: string, storeId: string }}
) {
    try {
        const auth = getAuth();

        const { userId } = clerkAuth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
    
        if (!params.routeId) {
            return new NextResponse("Route id is required", { status: 400 });
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

        const routeDocRef = doc(db, `stores/${params.storeId}/routes`, params.routeId);

        /*/ Delete the seats subcollection in routes
        const seatsCollectionRef = collection(routeDocRef, 'seats');
        const seatsQuery = query(seatsCollectionRef);
        const seatsSnapshot = await getDocs(seatsQuery);
        seatsSnapshot.forEach(async (seatDoc) => {
            await deleteDoc(seatDoc.ref);
        });*/

        // After deleting seats, delete the route itself
        await deleteDoc(routeDocRef);

        return NextResponse.json({ message: "Route deleted successfully" });
    } catch (err) {
        console.log('[ROUTE_DELETE]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}