export interface Route {
    id: string;
    day: Date;
    startCityId: string;
    endCityId: string;
    price: number;
    totalSeats: number;
    emptySeats: number;
    occupiedSeats: number;
    createdAt: Date;
    stops: Stop[];
}


export interface City {
    id: string;
    name: string;
    value: string;
    url: string;
    isOffered: boolean;
    price?: number;
}

export interface CityFetch {
    id: string
    name: string
    isOffered: string
    hasImage: string
    createdAt: string
}
  
export interface Stop {
    id: string;
    cityId: string;
}
  