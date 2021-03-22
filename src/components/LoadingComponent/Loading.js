import React from 'react';
import style from "./Loading.module.css";

export default function Loading() {
    return (
        <div className={style.loading}>
            <div className={style.loading__icon}>
                <img src="./images/loading.gif" alt="Loading" />
            </div>
        </div>
    )
}
