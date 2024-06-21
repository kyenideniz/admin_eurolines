"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useState } from "react";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
  } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useStoreModal } from "@/hooks/use-store-modal";

export function MainNav({ className, ...props } : React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [{
        href: `/`,
        label: 'Overview',
        active: pathname === `/`
    },{
        href: `/cities`,
        label: 'Cities',
        active: pathname === `/cities`
    },{
        href: `/routes`,
        label: 'Routes',
        active: pathname === `/routes`
    },];

    const [open, setOpen] = useState(false);
    const storeModal = useStoreModal();

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
           {routes.map((route, index) => (
            
            <Link key={index} href={route.href} className={cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}>
                {route.label}
            </Link>
            
           ))} 
           <>
           <SignedIn>
                {/* Mount the UserButton component */}
                <UserButton />
            </SignedIn>
            <SignedOut>
                {/* Signed out users get sign in button */}
                <SignInButton />
            </SignedOut>

            <Button onClick={() => {
                                setOpen(false); storeModal.onOpen();
                            }}>add</Button>
            </>
        </nav>
    )
}