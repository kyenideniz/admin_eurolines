import { RouteClient } from './components/client';
import { RouteColumn } from './components/columns';
import { collection, getDocs, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { db } from '@/firebaseConfig';
import { Timestamp } from 'firebase/firestore';

export const revalidate = 0; 

const RoutesPage = async () => {
    try {
        // Fetch cities data
        const cityQuerySnapshot = await getDocs(collection(db, 'cities'));
        const cities: { [id: string]: string } = {}; // Map to store city ID and name

        cityQuerySnapshot.forEach((cityDoc) => {
            const cityData = cityDoc.data();
            cities[cityDoc.id] = cityData.name; // Store city name with its ID
        });

        // Fetch routes data
        const querySnapshot = await getDocs(collection(db, 'routes'));
        const formattedRoutes: any[] = [];

        for (const routeDoc of querySnapshot.docs) {
            const routeData = routeDoc.data();
            // Convert routeData.day to a JavaScript Date object if it's a Firestore Timestamp
            const day = routeData.day instanceof Timestamp ? routeData.day.toDate() : new Date(routeData.day);
        
            formattedRoutes.push({
                id: routeDoc.id,
                day: format(day, 'PPP'),
                time: format(day, 'p'),
                startCity: cities[routeData.startCityId], // Get start city name
                endCity: cities[routeData.endCityId], // Get end city name
                stops: routeData.stops.map((stop: string) => cities[stop] || 'Unknown City'), // Map stops cityId to city names
                price: Number(routeData.price),
            });
        }
        
        return (
            <div className="flex-col">
                <div className="flex-1 p-8 pt-6 space-y-4">
                    <RouteClient data={formattedRoutes} />
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching routes:', error);
        return <div>Error loading routes</div>;
    }
};

export default RoutesPage;
