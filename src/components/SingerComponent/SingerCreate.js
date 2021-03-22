import axios from 'axios';
import React, { useState } from 'react';
import style from "./Singer.module.css";
import { Link } from "react-router-dom";
import Message from '../MessageComponent/Message';
import { LINK_API } from "../../const";

export default function SingerCreate(props) {
    const [state, setState] = useState({ singer: {}, message: '', type: '' });

    const addSinger = () => {
        if (!state.singer.singer_name) {
            setState({ ...state, message: "Singer name is not null!", type: "error" });
        } else if (!state.singer.singer_sex || state.singer.singer_sex === 'None') {
            setState({ ...state, message: "Singer sex not yet selected!", type: "error" });
        } else if (!state.singer.singer_date) {
            setState({ ...state, message: "Singer birthday is not null!", type: "error" });
        } else {
            axios.post(`${LINK_API}/api/singer`, {
                "singer_name": state.singer.singer_name,
                "singer_sex": state.singer.singer_sex,
                "singer_birthday": state.singer.singer_date,
            })
                .then(result => {
                    setState({ ...state, message: "", type: "" });
                    setState({ ...state, message: "Created singer successfully!", type: "success" });
                })
                .catch(err => {
                    setState({ ...state, message: "", type: "" });
                    setState({ ...state, message: err.response.data, type: "error" });
                });
        }
    }

    const closeMessage = () => {
        setState({ ...state, message: "" });
    }

    return (
        <div className={style.singer__container}>
            <div className={style.singer__title}>
                <h2>
                    <i className="fa fa-align-justify"></i> Add Singer
                </h2>
                <div className={style.singer__title__add}>
                    <Link to={props.location.state ? props.location.state.linkBack : '/singer'}>
                        <i className="fa fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
            <input type="text" className={style.input__singer} placeholder="Singer name" onChange={(event) => setState({ ...state, singer: { ...state.singer, singer_name: event.target.value } })} />
            <select className={style.select_singer} onChange={(event) => setState({ ...state, singer: { ...state.singer, singer_sex: event.target.value } })}>
                <option value="None">Selection gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
            <input type="date" className={style.input__date + " form-controler"} onChange={(event) => setState({ ...state, singer: { ...state.singer, singer_date: event.target.value } })} />
            <button className={style.btn__singer} onClick={() => addSinger()}>Save</button>
            {state.message ? <Message message={state.message} typeMessage={state.type} closeMessage={closeMessage} /> : ''}
        </div>
    )
}
