import React from 'react';
import style from "./Header.module.css";
import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <div className={style.header}>
            <div className={style.header__logo}>
                <img src="/images/logo.png" className={style.logo} alt="Logo" />
            </div>
            <div className={style.header__title}><a href="/">Music Manager</a></div>
            <div className={style.header__menu}>
                <ul>
                    <NavLink exact={true} activeClassName={style.header__active} to='/'>
                        <li><i className="fa fa-home"></i> Home</li>
                    </NavLink>
                    <NavLink activeClassName={style.header__active} to='/genre'>
                        <li><i className="fa fa-align-justify"></i> Genre</li>
                    </NavLink>
                    <NavLink activeClassName={style.header__active} to='/musician'>
                        <li><i className="fab fa-itunes-note"></i> Musician</li>
                    </NavLink>
                    <NavLink activeClassName={style.header__active} to='/singer'>
                        <li><i class="fa fa-microphone-alt"></i> Singer</li>
                    </NavLink>
                    <NavLink activeClassName={style.header__active} to='/playlist'>
                        <li><i className="fa fa-headphones-alt"></i> My Playlist</li>
                    </NavLink>
                </ul>
            </div>
        </div>
    )
}
