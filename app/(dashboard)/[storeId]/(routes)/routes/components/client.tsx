"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
// import { Billboard } from "@prisma/client"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { RouteColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"
import getRoutes from "@/actions/get-routes"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Timestamp } from "firebase/firestore"
import getCities from "@/actions/get-cities"
import { City } from "@/types"

interface RouteClientProps {
    data: RouteColumn[];
}

export const RouteClient: React.FC<RouteClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState<RouteColumn[]>([]);

    const url = `/api/${params.storeId}/routes`

    useEffect(() => {
        setTableData(data);
    }, []);

    const handleClick = async () => {
        setLoading(true);
        const cities: any[] = await getCities( {}, `/api/${params.storeId}/cities` )

        const refreshData: RouteColumn[] = await getRoutes( {}, url );

        const formattedRoutes: any[] = refreshData.map((routeDoc: any) => {
            const routeData = routeDoc;

            // Convert routeData.day to a JavaScript Date object if it's a Firestore Timestamp
            const day = routeData.day instanceof Timestamp ? routeData.day.toDate() : new Date(routeData.day);

            // Find city names based on city IDs
            const startCity = cities.find(city => city.id === routeData.startCityId)?.name || 'Unknown City';
            const endCity = cities.find(city => city.id === routeData.endCityId)?.name || 'Unknown City';
            const stops = routeData.stops.map((stopId: string) => cities.find(city => city.id === stopId)?.name || 'Unknown City');

            return {
                id: routeDoc.id,
                day: format(day, 'PPP'),
                time: format(day, 'p'),
                startCity,
                endCity,
                stops,
                price: Number(routeData.price),
            };
        });
        
        
        console.log(formattedRoutes);
        
        if(refreshData.length > 0){
            setTableData(formattedRoutes)
            setLoading(false);
        }else{
            setLoading(false);
        }
    }

    if(loading){
        return <div className="h-full w-full items-center justify-center flex">Reloading...</div>
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Routes (${tableData?.length})`}
                    description="Manage routes for your store"/>
                <Button onClick={() => router.push(`/${params.storeId}/routes/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={tableData} searchKey="startCity" fetchClick={handleClick} />
            <Heading title="API" description="API calls for Routes" />
            <Separator />
            <ApiList entityName={`${params.storeId}/routes`} entityIdName="routeId" />
        </>
    )
}