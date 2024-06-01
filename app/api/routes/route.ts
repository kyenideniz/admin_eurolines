import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        //const { userId } = auth();
        const body = await req.json();

        const { day, startCityId, endCityId, price } = body; 

        /*if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }*/

        if (!day) {
            return new NextResponse("Date is required", { status: 400});
        }

        if (!startCityId) {
            return new NextResponse("Departure City is required", { status: 400});
        }
        if (!endCityId) {
            return new NextResponse("Return City is required", { status: 400});
        }
        if (!price) {
            return new NextResponse("Price is required", { status: 400});
        }
        
        const route = await prismadb.route.create({
            data : {
                day,
                startCityId,
                endCityId,
                price,
                totalSeats: 55,
                emptySeats: 55,
                occupiedSeats: 0,
            }
        })

        return NextResponse.json(route);

    } catch (err) {
        console.log(`[ROUTE_POST] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
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
        return new NextResponse(`Internal error`, { status: 500})
    }
}