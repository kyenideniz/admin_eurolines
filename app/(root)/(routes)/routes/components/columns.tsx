"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type RouteColumn = {
    id: string
    day: string,
    time: string,
    startCity: string,
    endCity: string,
    price: number,
    totalSeats: number,
    emptySeats: number,
    occupiedSeats: number,
    createdAt: string,
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
        accessorKey: 'time',
        header: 'Departure Time',
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