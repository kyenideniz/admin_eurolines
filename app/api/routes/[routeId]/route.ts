import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: { routeId: string }}
) {
    try {
        if(!params.routeId) {
            return new NextResponse("Route id is required", { status: 400 });
        }

        const city = await prismadb.city.findUnique({
            where: {
                id: params.routeId,
            }
        })

        return NextResponse.json(city);
    } catch (err) {
        console.log('[ROUTE_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { routeId: string }}
) {
    try {
        const body = await req.json();

        const { day, startCityId, endCityId, price } = body; 

        if (!day) {
            return new NextResponse("Date is required", { status: 400 });
        }

        if (!startCityId) {
            return new NextResponse("Departure City is required", { status: 400 });
        }

        if (!endCityId) {
            return new NextResponse("Final City is required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if(!params.routeId) {
            return new NextResponse("Route id is required", { status: 400 });
        }

        const route = await prismadb.route.updateMany({
            where: {
                id: params.routeId
            },
            data: {
                day,
                startCityId,
                endCityId,
                price
            }
        })

        return NextResponse.json(route);
    } catch (err) {
        console.log('[ROUTE_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: { cityId: string }}
) {
    try {

        if(!params.cityId) {
            return new NextResponse("City id is required", { status: 400 });
        }

        const city = await prismadb.city.deleteMany({
            where: {
                id: params.cityId,
            }
        })

        return NextResponse.json(city);
    } catch (err) {
        console.log('[CITY_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}