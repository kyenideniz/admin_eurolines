"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type CityColumn = {
    id: string
    name: string
    isOffered: string
    hasImage: string
    createdAt: string
}

export const columns: ColumnDef<CityColumn>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'isOffered',
        header: 'Offered City',
    },
    {
        accessorKey: 'hasImage',
        header: 'Image Uploaded',
    },
    {
        accessorKey: 'createdAt',
        header: 'Date Added',
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
]