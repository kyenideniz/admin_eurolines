"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { RefreshCw } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { CityColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface CityClientProps {
    data: CityColumn[],
}

export const ErrorClient: React.FC<CityClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

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
            <DataTable columns={columns} data={data} searchKey="createdAt" />
            <Heading title="API" description="API calls for Cities" />
            <Separator />
            <ApiList entityName="cities" entityIdName="cityId" />
        </>
    )
}