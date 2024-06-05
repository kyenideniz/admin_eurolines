export interface Route {
    id: string;
    day: Date;

    startCity: City;
    endCity: City;

    stops: RouteStop[];

    price: number;

    totalSeats: number;
    emptySeats: number;
    occupiedSeats: number;
}


export interface City {
    id: string;
    name: string;
    value: string;
}
  
export interface RouteStop {
    id: string;
    route: Route;
    city: City;
}
  