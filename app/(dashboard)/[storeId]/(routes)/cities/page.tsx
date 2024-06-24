import { format } from 'date-fns';
import { db } from '@/firebaseConfig'; // Ensure you have this file configured as per your setup
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { CityColumn } from './components/columns';
import { CityClient } from './components/client';
import { firestore } from 'firebase-admin';
import { ErrorClient } from './components/errorClient';
import { handleClientScriptLoad } from 'next/script';

export const revalidate = 0;

const CitiesPage = async ({
    params
}: {
    params: { storeId: string }
}) => {

    try {
        // Firestore query to fetch cities
        const citiesCollectionRef = collection(db, `stores/${params.storeId}/cities`);
        const q = query(citiesCollectionRef, orderBy('createdAt', 'desc'));

        const querySnapshot = await getDocs(q);
        const cities: any[] = [];

        querySnapshot.forEach((doc) => {
            const cityData = doc.data();

            cities.push({
                id: doc.id,
                name: cityData.name,
                value: cityData.value,
                url: cityData.url ? "Yes" : "No",
                isOffered: cityData.isOffered ? "Yes" : "No",
                createdAt: format(cityData.createdAt.toDate(), "MMMM do, yyyy"), // Convert Firestore Timestamp to JavaScript Date
            });
        });

        return (
            <div className="flex-col">
                <div className="flex-1 p-8 pt-6 space-y-4">
                    <CityClient data={cities} />
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching cities: ", error);

        const errorTable: CityColumn[] = Array.from({ length: 1 }).map(doc => {
            return {
                id: "N/A",
                name: "N/A",
                isOffered: "N/A",
                hasImage: "N/A",
                createdAt: "N/A",
            };
        });

        return (
            <div className="flex-col">
                <div className="flex-1 p-8 pt-6 space-y-4">
                    <ErrorClient data={errorTable} />
                </div>
            </div> 
        );
    }
};

export default CitiesPage;