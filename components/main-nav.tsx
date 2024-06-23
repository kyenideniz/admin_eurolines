"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export function MainNav({ className, ...props } : React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [{
        href: `/${params.storeId}`,
        label: 'Overview',
        active: pathname === `/${params.storeId}`
    },{
        href: `/${params.storeId}/cities`,
        label: 'Cities',
        active: pathname === `/${params.storeId}/cities`
    },{
        href: `/${params.storeId}/routes`,
        label: 'Routes',
        active: pathname === `${params.storeId}/routes`
    },];

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
           {routes.map((route, index) => (
            <Link key={index} href={route.href} className={cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}>
                {route.label}
            </Link>
           ))} 
        </nav>
    )
}