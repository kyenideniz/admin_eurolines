import { RouteForm } from "./components/route-form";
import { db } from '@/firebaseConfig'
import { Route } from "@/types";
import { doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';

const RoutePage = async ({ params }: { params: { routeId: string, storeId: string } }) => {
    // Fetch route data from Firestore
    const routeDocRef = doc(db, 'stores', params.storeId, 'routes', params.routeId);
    const routeDocSnapshot = await getDoc(routeDocRef);
    let route: Route | null = null;

    if (routeDocSnapshot.exists()) {
        const routeData = routeDocSnapshot.data();
        route = {
            id: routeDocSnapshot.id,
            day: routeData.day, // Convert Firestore Timestamp to Date
            startCityId: routeData.startCityId,
            endCityId: routeData.endCityId,
            price: routeData.price,
            totalSeats: routeData.totalSeats,
            emptySeats: routeData.emptySeats,
            occupiedSeats: routeData.occupiedSeats,
            createdAt: routeData.createdAt, // Convert Firestore Timestamp to Date
            stops: routeData.stops ? routeData.stops : null // Assuming each stop object has a cityId field
        };
    }

    // Fetch cities data from Firestore
    const citiesCollectionRef = collection(db, `stores/${params.storeId}/cities`);
    const citiesQuery = query(citiesCollectionRef, orderBy('createdAt', 'desc'));

    const citiesQuerySnapshot = await getDocs(citiesQuery);

    const cities = citiesQuerySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            value: data.value,
            isOffered: data.isOffered,
            imageUrl: data.url, // Assuming `url` in Firestore corresponds to `imageUrl`
            createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
        };
    });

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <RouteForm initialData={route} cities={cities} />
            </div>
        </div>
    );
}

export default RoutePage;
