"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type CityColumn = {
    id: string
    name: string
    value: string
    createdAt: string
}

export const columns: ColumnDef<CityColumn>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'value',
        header: 'Value',
    },
    {
        accessorKey: 'createdAt',
        header: 'Date',
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
]