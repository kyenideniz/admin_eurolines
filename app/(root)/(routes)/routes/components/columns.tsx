"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type RouteColumn = {
    id: string
    day: string,
    startCityId: string,
    endCityId: string,
    price: number,
    totalSeats: number,
    emptySeats: number,
    occupiedSeats: number,
    createdAt: string,
}

export const columns: ColumnDef<RouteColumn>[] = [
    {
        accessorKey: 'startCityId',
        header: 'Start City Id',
    },
    {
        accessorKey: 'endCityId',
        header: 'End City Id',
    },
    {
        accessorKey: 'totalSeats',
        header: 'Total Seats (55)',
    },
    {
        accessorKey: 'occupiedSeats',
        header: 'Occupied Seats',
    },
    {
        accessorKey: 'emptySeats',
        header: 'Empty Seats',
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
        accessorKey: 'createdAt',
        header: 'Created At',
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
]