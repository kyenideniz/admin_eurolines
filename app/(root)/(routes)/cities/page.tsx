import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { CityClient } from './components/client'
import { CityColumn } from './components/columns'

export const revalidate = 0;

const CitiesPage = async () => {

    const cities = await prismadb.city.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedCities: CityColumn[] = cities.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <CityClient data={formattedCities} />
            </div>
        </div>
    )
}

export default CitiesPage;