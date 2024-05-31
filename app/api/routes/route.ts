import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const initialMatrix = [
    [{ id: "J1", status: 0 }, { id: "I1", status: 0 }, { id: "H1", status: 0 }, { id: "G1", status: 0 }, { id: "F1", status: 0 }, { id: "E1", status: 0 }, { id: "D1", status: 0 }, { id: "C1", status: 0 }, { id: "B1", status: 0 }, { id: "A1", status: 0 }],
    [{ id: "J2", status: 0 }, { id: "I2", status: 0 }, { id: "H2", status: 0 }, { id: "G2", status: 0 }, { id: "F2", status: 0 }, { id: "E2", status: 0 }, { id: "D2", status: 0 }, { id: "C2", status: 0 }, { id: "B2", status: 0 }, { id: "A2", status: 0 }],
    [{ id: "J3", status: 0 }],
    [{ id: "J4", status: 0 }, { id: "I3", status: 0 }, { id: "H3", status: 0 }, { id: "G3", status: 0 }, { id: "F3", status: 0 }, { id: "E3", status: 0 }, { id: "D3", status: 0 }, { id: "C3", status: 0 }, { id: "B3", status: 0 }, { id: "A3", status: 0 }],
    [{ id: "J5", status: 0 }, { id: "I4", status: 0 }, { id: "H4", status: 0 }, { id: "G4", status: 0 }, { id: "F4", status: 0 }, { id: "E4", status: 0 }, { id: "D4", status: 0 }, { id: "C4", status: 0 }, { id: "B4", status: 0 }, { id: "A4", status: 0 }],
];

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
        console.log("not created")

        const matrix = await prismadb.busMatrix.create({
            data: {
              rows: {
                create: initialMatrix.map(row => ({
                  items: {
                    create: row.map(item => ({
                      status: item.status,
                      id: Math.random().toString(),
                    })),
                  },
                })),
              },
            },
        });

        console.log("matrix created", matrix.id)
        
        const route = await prismadb.route.create({
            data : {
                day,
                startCityId,
                endCityId,
                price,
                busMatrix: { connect: { id: matrix.id } }, // Connect to the busMatrix
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