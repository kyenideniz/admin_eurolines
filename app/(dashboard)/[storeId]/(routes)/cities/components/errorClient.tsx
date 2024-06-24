"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { RefreshCw } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { CityColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"
import getCities from "@/actions/get-cities"
import { useState } from "react"

interface CityClientProps {
    data: CityColumn[],
}

export const ErrorClient: React.FC<CityClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);

    const url = `/api/${params.storeId}/cities`

    let refreshData: CityColumn[];

    const handleClick = async () => {
        console.log("fetching cities...");
        setLoading(true);
        refreshData = await getCities( {}, url );
        
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
            <DataTable columns={columns} data={data} searchKey="createdAt" fetchClick={handleClick} />
            <Heading title="API" description="API calls for Cities" />
            <Separator />
            <ApiList entityName="cities" entityIdName="cityId" />
        </>
    )
}