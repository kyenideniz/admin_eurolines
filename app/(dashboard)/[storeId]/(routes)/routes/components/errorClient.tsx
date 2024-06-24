"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { RefreshCw } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { RouteColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"
import getRoutes from "@/actions/get-routes"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import getCities from "@/actions/get-cities"
import { Timestamp } from "firebase/firestore"

interface CityClientProps {
    data: RouteColumn[],
}

export const ErrorClient: React.FC<CityClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState<RouteColumn[]>([]);

    const url = `/api/${params.storeId}/routes`

    let refreshData: RouteColumn[];

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

    useEffect(() => {
        if (loading) {
            const errorTable: RouteColumn[] = [{
                id: "Loading...",
                day: "Loading...",
                time: "Loading...",
                startCity: "Loading...",
                endCity: "Loading...",
                price: 0,
            }];
            setTableData(errorTable);
        }
    }, [loading]);
    
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={"Error"}
                    description="Error loading city data..."/>
                <Button>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="createdAt" fetchClick={handleClick} loading={loading} />
            <Heading title="API" description="API calls for Cities" />
            <Separator />
            <ApiList entityName="cities" entityIdName="cityId" />
        </>
    )
}