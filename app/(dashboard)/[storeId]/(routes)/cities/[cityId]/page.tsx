import { db } from '@/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore';
import { CityForm } from './components/city-form';

export const revalidate = 0;

const CityPage = async ({ params }: { params: { cityId: string } }) => {

    const cityDocRef = doc(db, 'cities', params.cityId);
    const cityDocSnapshot = await getDoc(cityDocRef);
    let formattedCity: any;

    if (cityDocSnapshot.exists()) {
        const cityData = cityDocSnapshot.data();
        formattedCity = {
            id: cityDocSnapshot.id,
            cityId: cityData.id,
            name: cityData.name,
            value: cityData.value,
            url: cityData.url,
            isOffered: cityData.isOffered,
            price: cityData.price,
        };

        return(
            <div className="flex-col">
                <div className="flex-1 p-8 pt-6 space-y-4">
                    <CityForm initialData={formattedCity} />
                </div>
            </div>
        )
    }else{
    return(
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <CityForm initialData={null} />
            </div>
        </div>
        )
    }
};

export default CityPage;
