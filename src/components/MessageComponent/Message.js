import React from 'react';
import style from "./Message.module.css";

export default function Message(props) {

    return (
        <div className={style.message} style={{ color: props.typeMessage === 'error' ? '#f75252' : '#83ca81' }}>
            {props.message}
            <i className="fa fa-times" onClick={props.closeMessage}></i>
        </div>
    )
}
