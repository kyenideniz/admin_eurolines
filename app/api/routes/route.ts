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


export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const routes = await prismadb.route.findMany({
            where: {
                id: params.id
            }
        })

        return NextResponse.json(routes);

    } catch (err) {
        console.log(`[ROUTES_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500});
    }
}
