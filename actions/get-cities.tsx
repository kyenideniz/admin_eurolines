import { CityFetch as City } from "@/types";
import qs from 'query-string';

interface Query {
    id?: string;
    name?: string;
    value?: string;
    isOffered?: boolean;
    url?: string;
    createdAt?: string;
    price?: number;
}

const getCities = async (query: Query = {}, fetchURL: string): Promise<City[]> => {
    const queryObject = {
        id: query.id,
        name: query.name,
        value: query.value,
        isOffered: query.isOffered,
        hasImage: query.url,
        date: query.createdAt,
        price: query.price,
    };

    // Remove undefined values from the query object
    const filteredQueryObject = Object.fromEntries(
        Object.entries(queryObject).filter(([_, v]) => v !== undefined)
    );

    const url = qs.stringifyUrl({
        url: fetchURL,
        query: filteredQueryObject
    });

    //console.log('Fetching URL:', url);
    const res = await fetch(url);

    if (!res.ok) {
        const errorText = await res.text();
        //console.log('Fetch error:', errorText);
        throw new Error(errorText);
    }

    const data: City[] = await res.json();

    // Only filter by isOffered if it is specified in the query
    const cities = query.isOffered !== undefined
        ? data.filter((city: City) => city.isOffered === query.isOffered?.toString())
        : data;

    //console.log('Fetch successful:', cities);
    return cities;
}

export default getCities;

export const revalidate = 0;