'use client'

import { AuthProvider } from "@/context/AuthContext"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

export default function clientProviders({children}){
    return(
        <AuthProvider>
            <DndProvider backend={HTML5Backend}>
                {children}
            </DndProvider>
        </AuthProvider>
    );
}