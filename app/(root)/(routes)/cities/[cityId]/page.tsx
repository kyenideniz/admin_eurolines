import { format } from 'date-fns'
import { db } from '@/firebaseConfig' // Ensure you have this file configured as shown earlier
import { doc, getDoc } from 'firebase/firestore';
import { City } from "@/types"
import { CityForm } from './components/city-form';
import { v4 as uuidv4 } from 'uuid';

export const revalidate = 0;

const CityPage = async ({ params }: { params: { cityId: string } }) => {

    const cityDocRef = doc(db, 'cities', params.cityId);
    const cityDocSnapshot = await getDoc(cityDocRef);
    let formattedCity: any;

    if (cityDocSnapshot.exists()) {
        const cityData = cityDocSnapshot.data();
        formattedCity = {
            id: cityDocSnapshot.id,
            name: cityData.name,
            value: cityData.value,
        };

        return(
            <div className="flex-col">
                <div className="flex-1 p-8 pt-6 space-y-4">
                    <CityForm initialData={formattedCity} />
                </div>
            </div>
        )
    }
    return(
    <div className="flex-col">
        <div className="flex-1 p-8 pt-6 space-y-4">
            <CityForm initialData={null} />
        </div>
    </div>
    )
};

export default CityPage;
