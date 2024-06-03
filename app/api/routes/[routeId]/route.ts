import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid';

export async function GET (
    req: Request,
    { params }: { params: { routeId: string }}
) {
    try {
        if(!params.routeId) {
            return new NextResponse("Route id is required", { status: 400 });
        }

        const route = await prismadb.route.findUnique({
            where: {
                id: params.routeId,
            },
            include: {
                stops: true,
            },
        })

        return NextResponse.json(route);
    } catch (err) {
        console.log('[ROUTE_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { routeId: string } }
) {
    try {
        const body = await req.json();
        const { day, startCityId, endCityId, price, stops } = body;

        if (!day || !startCityId || !endCityId || !price || !params.routeId) {
            return new NextResponse("Invalid data provided", { status: 400 });
        }

        const existingStops = await prismadb.route.findUnique({
            where: {
                id: params.routeId,
            },
            select: {
                stops: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        const existingStopIds = existingStops ? existingStops.stops.map((stop) => stop.id) : [];

        if (stops.length === 0) {
            await prismadb.routeStop.deleteMany({
                where: {
                    routeId: params.routeId,
                },
            });
        } else {
            const stopsToDelete = existingStopIds.filter((existingStopId) => {
                return !stops.some((newStop: { id: string; }) => newStop.id === existingStopId);
            });

            await prismadb.routeStop.deleteMany({
                where: {
                    id: {
                        in: stopsToDelete,
                    },
                },
            });
        }

        const updatedRoute = await prismadb.route.update({
            where: {
                id: params.routeId,
            },
            data: {
                day,
                startCityId,
                endCityId,
                price,
                stops: {
                    upsert: stops.map((stop: { id: any; cityId: string; }) => ({
                        where: { id: stop.id || uuidv4() }, // Add condition to handle empty ids
                        create: {
                            id: stop.cityId === 'N/A' ? uuidv4() : stop.id,
                            cityId: stop.cityId === 'N/A' ? null : stop.cityId,
                        },
                        update: {
                            cityId: stop.cityId === 'N/A' ? null : stop.cityId,
                        },
                    })),
                },
            },
            include: {
                stops: true,
            },
        });

        return NextResponse.json(updatedRoute);
    } catch (err) {
        console.log('[ROUTE_PATCH]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}


//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: { routeId: string }}
) {
    try {
        if (!params.routeId) {
            return new NextResponse("Route id is required", { status: 400 });
        }

        // Delete related records in RouteStop table
        await prismadb.routeStop.deleteMany({
            where: {
                routeId: params.routeId,
            },
        });

        // Now delete the route
        const route = await prismadb.route.delete({
            where: {
                id: params.routeId,
            },
        });

        return NextResponse.json(route);
    } catch (err) {
        console.log('[ROUTE_DELETE]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}
