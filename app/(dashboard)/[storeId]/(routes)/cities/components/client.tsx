"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { CityColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"
import getCities from "@/actions/get-cities"
import { useEffect, useState } from "react"
import { format } from "date-fns"

interface CityClientProps {
    data: CityColumn[],
}

export const CityClient: React.FC<CityClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState<CityColumn[]>([]);

    const url = `/api/${params.storeId}/cities`

    useEffect(() => {
        setTableData(data);
    }, []);
    
    let refreshData: CityColumn[];

    const handleClick = async () => {
        setLoading(true);
        refreshData = await getCities( {}, url );

        const formattedCities: any[] = refreshData.map((routeDoc: any) => {
            return{
                id: routeDoc.id,
                name: routeDoc.name,
                value: routeDoc.value,
                hasImage: routeDoc.url ? "Yes" : "No",
                isOffered: routeDoc.isOffered ? "Yes" : "No",
                createdAt: format(routeDoc.createdAt, "MMMM do, yyyy"), // Convert Firestore Timestamp to JavaScript Date
            };
        });

        if(refreshData.length > 0){
            setTableData(formattedCities)
            setLoading(false);
        }else{
            setLoading(false);
        }
    }

    useEffect(() => {
        if (loading) {
            const errorTable: CityColumn[] = [{
                id: "Loading...",
                name: "Loading...",
                isOffered: "Loading...",
                hasImage: "Loading...",
                createdAt: "Loading...",
            }];
            setTableData(errorTable);
        }
    }, [loading]);

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Cities (${tableData?.length})`}
                    description="Manage cities for your store"/>
                <Button onClick={() => router.push(`/${params.storeId}/cities/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={tableData} searchKey="createdAt" fetchClick={handleClick} loading={loading} />
            <Heading title="API" description="API calls for Cities" />
            <Separator />
            <ApiList entityName={`${params.storeId}/cities`} entityIdName="cityId" />
        </>
    )
}