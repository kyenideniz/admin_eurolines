import prismadb from '@/lib/prismadb';
import { RouteClient } from './components/client';
import { RouteColumn } from './components/columns';
import { format } from 'date-fns';

const RoutesPage = () => {
    return new Promise((resolve, reject) => {
        prismadb.route
            .findMany({
                include: {
                    startCity: true,
                    endCity: true,
                    stops: {
                        include: {
                            city: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            })
            .then((routes) => {
                const formattedRoutes: RouteColumn[] = routes.map((item) => ({
                    id: item.id,
                    day: format(item.day, 'PPP'),
                    time: format(item.day, 'p'),
                    startCity: item.startCity.name,
                    endCity: item.endCity.name,
                    stops: item.stops.map((stop) => stop.city.name),
                    price: Number(item.price),
                    totalSeats: item.totalSeats,
                    emptySeats: item.emptySeats,
                    occupiedSeats: item.occupiedSeats,
                    createdAt: format(item.createdAt, 'PPP'),
                }));
                resolve(
                    <div className="flex-col">
                        <div className="flex-1 p-8 pt-6 space-y-4">
                            <RouteClient data={formattedRoutes} />
                        </div>
                    </div>
                );
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export default RoutesPage;
