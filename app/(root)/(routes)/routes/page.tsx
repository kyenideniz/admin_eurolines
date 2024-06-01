import prismadb from '@/lib/prismadb'
import { RouteClient } from './components/client'
import { RouteColumn } from './components/columns'
import { format } from 'date-fns'

const RoutesPage = async () => {

    const routes = await prismadb.route.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedRoutes: RouteColumn[] = routes.map(item => ({
        id: item.id,
        day: format(item.day,"PPP"),
        startCityId: item.startCityId,
        endCityId: item.endCityId,
        price: item.price,
        
        totalSeats: item.totalSeats,
        emptySeats: item.emptySeats,
        occupiedSeats: item.occupiedSeats,

        createdAt: format(item.createdAt,"PPP"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <RouteClient data={formattedRoutes} />
            </div>
        </div>
    )
}

export default RoutesPage;