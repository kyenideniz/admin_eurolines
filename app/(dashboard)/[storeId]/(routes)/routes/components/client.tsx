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

interface RouteClientProps {
    data: RouteColumn[];
}

export const RouteClient: React.FC<RouteClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();
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
            <DataTable columns={columns} data={data} searchKey="startCity" />
            <Heading title="API" description="API calls for Routes" />
            <Separator />
            <ApiList entityName="routes" entityIdName="routeId" />
        </>
    )
}