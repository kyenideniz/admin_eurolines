"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type RouteColumn = {
    id: string
    day: Date,
    startCityId: string,
    endCityId: string,
    price: number,
    busMatrixId: number,
    createdAt: Date,
}

export const columns: ColumnDef<RouteColumn>[] = [
    {
        accessorKey: 'day',
        header: 'Day',
    },
    {
        accessorKey: 'startCityId',
        header: 'Start City Id',
    },
    {
        accessorKey: 'endCityId',
        header: 'End City Id',
    },
    {
        accessorKey: 'price',
        header: 'Price',
    },
    {
        accessorKey: 'busMatrixId',
        header: 'Bus Matrix Id',
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