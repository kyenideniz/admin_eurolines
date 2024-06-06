"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Stop } from '@/types';

export type RouteColumn = {
    id: string;
    day: string;
    time: string;
    startCity: string; // Assuming startCity is the name of the city
    endCity: string; // Assuming endCity is the name of the city
    stops: Stop; // Array of strings representing city names
    price: number;
}

export const columns: ColumnDef<RouteColumn>[] = [
    {
        accessorKey: 'startCity',
        header: 'Start City',
    },
    {
        accessorKey: 'endCity',
        header: 'End City',
    },
    {
        accessorKey: 'stops',
        header: 'Stops',
    },
    {
        accessorKey: 'occupiedSeats',
        header: 'Tickets Bought (55)',
    },
    {
        accessorKey: 'price',
        header: 'Price Per Seats',
    },
    {
        accessorKey: 'day',
        header: 'Day',
    },
    {
        accessorKey: 'time',
        header: 'Departure Time',
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
]