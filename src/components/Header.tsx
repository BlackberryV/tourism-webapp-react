import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../firebase/AuthContext";
import {NavLink} from "react-router-dom";
import {getUserById, logOut} from "../firebase/firebase";
import {IUser} from "../types";

const Header: React.FC = () => {
    const user = useContext(AuthContext);
    const [dbUser, setDbUser] = useState<IUser | undefined>(undefined)
    useEffect(() => {
        getUserById(user?.uid).then((user) => {
            setDbUser(user)
        })
    }, [user?.uid])
    return (
        <header className="header">
            <NavLink to={"/"}>
                <div className='logo'><img className='logo-img' alt='' src='../imgs/green.png'/></div>
            </NavLink>
            <input id="menu-toggle" type="checkbox"/>
            <label className='menu-button-container' htmlFor="menu-toggle">
                <div className='menu-button'/>
            </label>
            {user ?
                <ul className="menu">
                    {dbUser?.role === 'ADMIN' ?
                        <>
                            <NavLink to='/requests'>Admin Panel</NavLink>
                            <NavLink to='/posts'>Home</NavLink>
                        </>
                        :
                        <NavLink to='/posts'>Home</NavLink>
                    }
                    <NavLink to='/login' onClick={() => logOut()}>Log Out</NavLink>
                    <NavLink className='profile' to='/profile'>
                        <div className="avatar">{dbUser?.name.substr(0, 1)}</div>
                    </NavLink>
                </ul>
                :
                <ul className="menu">
                    <NavLink to='/posts'>Home</NavLink>
                    <NavLink to='/login'>Log In</NavLink>
                    <NavLink to='/signup'>Sign Up</NavLink>
                </ul>}
        </header>
    );
};

export default Header;
