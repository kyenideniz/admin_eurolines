import { Route } from "@/types";
import qs from 'query-string';

interface Query {
    day?: string;
    startCityId?: string;
    endCityId?: string;
    stopsId?: string[];
    price?: number;
}

const getRoutes = async (query: Query = {}, fetchURL: string): Promise<any> => {
    
    const url = qs.stringifyUrl({
        url: fetchURL,
        query: {
            day: query.day,
            startCityId: query.startCityId,
            endCityId: query.endCityId,
            stopsId: query.stopsId,
            price: query.price,
        }
    });

    //console.log('Fetching URL:', url);
    const res = await fetch(url);

    if (!res.ok) {
        const errorText = await res.text();
        //console.log('Fetch error:', errorText);
        throw new Error(errorText);
    }

    const data = await res.json();
    //console.log('Fetch successful:', data);
    return data;
}

export default getRoutes;
export const revalidate = 0;
