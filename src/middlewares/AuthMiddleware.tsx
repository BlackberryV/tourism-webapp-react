import React, {ReactElement, useContext} from "react"
import {Navigate} from "react-router-dom"
import {AuthContext} from "../firebase/AuthContext"

interface AuthMiddlewareProps {
    children: ReactElement
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({children}) => {
    const user = useContext(AuthContext)

    return (
        user ? <Navigate to="/posts"/> : children
    )
}

export default AuthMiddleware