import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { day, startCityId, endCityId, price, stops } = body;

        if (!day || !startCityId || !endCityId || !price) {
            return new NextResponse("Invalid data provided", { status: 400 });
        }

        const newRoute = await prismadb.route.create({
            data: {
                day,
                startCityId,
                endCityId,
                price,
                totalSeats: 55,
                emptySeats: 55,
                occupiedSeats: 0,
                stops: {
                    createMany: {
                        data: stops.map((stop: any) => ({
                            id: stop.cityId === 'N/A' ? uuidv4() : stop.id,
                            cityId: stop.cityId === 'N/A' ? null : stop.cityId,
                        })),
                    },
                },
            },
            include: {
                stops: true,
            },
        });

        return NextResponse.json(newRoute);
    } catch (err) {
        console.log('[ROUTE_POST]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const routes = await prismadb.route.findMany({
            include: {
                startCity: true,
                endCity: true,
                stops: {
                    include: {
                        city: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const formattedRoutes = routes.map((item) => ({
            id: item.id,
            day: item.day,
            time: item.day,
            startCity: item.startCity.name,
            endCity: item.endCity.name,
            stops: item.stops.map((stop) => stop.city.name),
            price: Number(item.price),
            totalSeats: item.totalSeats,
            emptySeats: item.emptySeats,
            occupiedSeats: item.occupiedSeats,
            createdAt: item.createdAt,
        }));

        console.log('Routes fetched:', formattedRoutes);
        return NextResponse.json(formattedRoutes);

    } catch (err:any) {
        console.error(`[ROUTES_GET] Error: ${err.message}`);
        console.error(`[ROUTES_GET] Stack: ${err.stack}`);
        return new NextResponse('Internal error', { status: 500 });
    }
}