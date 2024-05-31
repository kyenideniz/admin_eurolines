import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        //const { userId } = auth();
        const body = await req.json();

        const { name, value } = body; 

        /*if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }*/

        if (!name) {
            return new NextResponse("Name is required", { status: 400});
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400});
        }

        const city = await prismadb.city.create({
            data : {
                name,
                value,
            }
        })

        return NextResponse.json(city);

    } catch (err) {
        console.log(`[CITIES_POST] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cities = await prismadb.city.findMany({
            where: {
                id: params.id
            }
        })

        return NextResponse.json(cities);

    } catch (err) {
        console.log(`[CITIES_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}