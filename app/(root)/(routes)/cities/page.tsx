import { format } from 'date-fns'
import { db } from '@/firebaseConfig' // Ensure you have this file configured as shown earlier
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { CityClient } from './components/client'
import { CityColumn } from './components/columns'

export const revalidate = 0;

const CitiesPage = async () => {
    try {
        // Firestore query to get cities ordered by creation date
        const citiesCollection = collection(db, 'cities');
        const citiesQuery = query(citiesCollection, orderBy('createdAt', 'desc'));
    
        const querySnapshot = await getDocs(citiesQuery);

        // Map Firestore documents to CityColumn type
        
        const formattedCities: CityColumn[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                value: data.value,
                createdAt: format(data.createdAt.toDate(), "MMMM do, yyyy")
            };
        });

        return (
            <div className="flex-col">
                <div className="flex-1 p-8 pt-6 space-y-4">
                    <CityClient data={formattedCities} />
                </div>
            </div>
        )
    } catch (error) {
        console.error("Error fetching cities: ", error);
        return <div>Error loading cities</div>;
    }
}

export default CitiesPage;
