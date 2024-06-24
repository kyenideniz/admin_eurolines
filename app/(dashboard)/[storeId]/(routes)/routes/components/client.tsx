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
import { useState } from "react"

interface RouteClientProps {
    data: RouteColumn[];
}

export const RouteClient: React.FC<RouteClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);

    const url = `/api/${params.storeId}/cities`

    let refreshData: RouteColumn[];

    const handleClick = async () => {
        console.log("fetching cities...");
        setLoading(true);
        refreshData = await getRoutes( {}, url );
        
        if(refreshData.length > 0){
            console.log("new cities fetched...", refreshData);
            data = [];
            data = refreshData;
            console.log("data set", data);
            setLoading(false);
        }else{
            console.log("Fetch unsuccessfull")
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
                    title={`Routes (${data?.length})`}
                    description="Manage routes for your store"/>
                <Button onClick={() => router.push(`/${params.storeId}/routes/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="startCity" fetchClick={handleClick} />
            <Heading title="API" description="API calls for Routes" />
            <Separator />
            <ApiList entityName="routes" entityIdName="routeId" />
        </>
    )
}