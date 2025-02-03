import React from 'react'
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <Menubar>
            <MenubarMenu>
                <Link to={"/journal"}>
                    <Button>
                        <Plus /> Create Entry
                    </Button>
                </Link>
            </MenubarMenu>
        </Menubar>

    )
}

export default Header