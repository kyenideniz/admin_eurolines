"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export function MainNav({ className, ...props } : React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [{
        href: `/`,
        label: 'Overview',
        active: pathname === `/`
    },{
        href: `${params.storeId}/cities`,
        label: 'Cities',
        active: pathname === `/cities`
    },{
        href: `${params.storeId}/routes`,
        label: 'Routes',
        active: pathname === `/routes`
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