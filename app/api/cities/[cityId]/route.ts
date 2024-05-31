import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: { cityId: string }}
) {
    try {
        if(!params.cityId) {
            return new NextResponse("City id is required", { status: 400 });
        }

        const city = await prismadb.city.findUnique({
            where: {
                id: params.cityId,
            }
        })

        return NextResponse.json(city);
    } catch (err) {
        console.log('[CITY_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { cityId: string }}
) {
    try {
        const body = await req.json();

        const { name, value } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Image URL is required", { status: 400 });
        }

        if(!params.cityId) {
            return new NextResponse("City id is required", { status: 400 });
        }

        const city = await prismadb.city.updateMany({
            where: {
                id: params.cityId
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(city);
    } catch (err) {
        console.log('[CITY_PATCH]', err)
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