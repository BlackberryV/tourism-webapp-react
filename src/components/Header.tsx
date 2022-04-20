import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../firebase/AuthContext";
import {NavLink, useNavigate} from "react-router-dom";
import {getUserById, logOut} from "../firebase/firebase";
import {IUser} from "../types";

const Header: React.FC = () => {
    const user = useContext(AuthContext);
    const [dbUser, setDbUser] = useState<IUser | undefined>(undefined)
    const navigate = useNavigate();
    useEffect(() => {
        getUserById(user?.uid).then((user) => {
            setDbUser(user)
        })
    }, [user?.uid])
    const openBurger = () => {
        const menu : null| HTMLElement = document.getElementById('menu');
        menu!.classList.toggle('active');
    }
    const handleProfileNavigate = () => {
        navigate(`/profile/${dbUser?.uid}`)
    }
    return (
        <header className="header">
            <NavLink to={"/"}>
                <div className='logo'><img className='logo-img' alt='' src='../imgs/green.png'/></div>
            </NavLink>
            {user ?
                <ul  onClick={openBurger} id='menu' className="menu">
                    {dbUser?.role === 'ADMIN' ?
                        <>
                            <NavLink to='/requests'>Admin Panel</NavLink>
                            <NavLink to='/posts'>Home</NavLink>
                        </>
                        :
                        <NavLink to='/posts'>Home</NavLink>
                    }
                    <NavLink to='/login' onClick={() => logOut()}>Log Out</NavLink>
                    <div className='profile' onClick={handleProfileNavigate}>
                        <div className="avatar">{dbUser?.name.substr(0, 1)}</div>
                        <div className="profile-link-text">Profile</div>
                    </div>
                </ul>
                :
                <ul  onClick={openBurger}  id='menu' className="menu">
                    <NavLink to='/posts'>Home</NavLink>
                    <NavLink to='/login'>Log In</NavLink>
                    <NavLink to='/signup'>Sign Up</NavLink>
                </ul>}
                <svg onClick={openBurger} fill='white' className='header-burger' viewBox="0 0 100 80" width="70" height="70">
                    <rect width="100" height="15"/>
                    <rect y="30" width="100" height="15"/>
                    <rect y="60" width="100" height="15"/>
                </svg>
        </header>
    );
};

export default Header;
