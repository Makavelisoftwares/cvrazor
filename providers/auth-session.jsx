'use client'
import {SessionProvider} from "next-auth/react"

export const AuthSession=({children})=>{
    return(
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}