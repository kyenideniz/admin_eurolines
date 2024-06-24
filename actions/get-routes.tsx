import qs from 'query-string';

interface Query {
    id?: string;
    day?: string;
    startCityId?: string;
    endCityId?: string;
    stopsId?: string[];
    price?: number;
}

const getRoutes = async (query: Query = {}, fetchURL: string, cities: { [id: string]: string } = {} ): Promise<any> => {

    const queryObject = {
        day: query.day,
        startCity: query.startCityId,
        endCity: query.endCityId,
        stops: query.stopsId,
        price: query.price,
    }

    const filteredQueryObject = Object.fromEntries(
        Object.entries(queryObject).filter(([_, v]) => v !== undefined)
    );

    const url = qs.stringifyUrl({
        url: fetchURL,
        query: filteredQueryObject
    });

    const res = await fetch(url);

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
    }

    const data = await res.json();
    console.log(data);

    return data;
}

export default getRoutes;
export const revalidate = 0;
