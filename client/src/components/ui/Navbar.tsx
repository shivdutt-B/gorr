"use client";
import React from "react";
import { NavbarSource } from "./NavbarSource";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";

export function Navbar() {
    const navItems = [
        {
            name: "Home",
            link: "/",
            icon: <IconHome className="h-4 w-4 shrink-0 text-foreground-muted" />,
        },
        {
            name: "About",
            link: "#about",
            icon: <IconUser className="h-4 w-4 shrink-0 text-foreground-muted" />,
        },
        {
            name: "Contact",
            link: "#contact",
            icon: (
                <IconMessage className="h-4 w-4 shrink-0 text-foreground-muted" />
            ),
        },
    ];
    return (
        (<div className="relative  w-full">
            <NavbarSource navItems={navItems} />
        </div>)
    );
}
