import prismadb from "@/lib/prismadb";
import { RouteForm } from "./components/route-form";

const RoutePage = async ({ params }: { params: { routeId: string } }) => {
    const route = await prismadb.route.findUnique({ 
        where: {
            id: params.routeId
        }
    });

    const cities = await prismadb.city.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <RouteForm initialData={route} cities={cities} />
            </div>
        </div>
    )
}

export default RoutePage;