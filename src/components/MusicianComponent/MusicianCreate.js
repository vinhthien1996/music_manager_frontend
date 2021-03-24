import axios from 'axios';
import React, { useState } from 'react';
import style from "./Musician.module.css";
import { Link } from "react-router-dom";
import Message from '../MessageComponent/Message';
import { LINK_API } from "../../const";

export default function MusicianCreate(props) {
    const [state, setState] = useState({ musician: {}, message: '', type: '' });

    const addMusician = () => {
        if (!state.musician.musician_name) {
            setState({ ...state, message: "Musician name is not null!", type: "error" });
        } else if (!state.musician.musician_sex || state.musician.musician_sex === 'None') {
            setState({ ...state, message: "Musician gender not yet selected!", type: "error" });
        } else if (!state.musician.musician_date) {
            setState({ ...state, message: "Musician birthday is not null!", type: "error" });
        } else {
            axios.post(`${LINK_API}/api/musician`, {
                "musician_name": state.musician.musician_name,
                "musician_sex": state.musician.musician_sex,
                "musician_birthday": state.musician.musician_date,
            })
                .then(result => {
                    setState({ ...state, message: "", type: "" });
                    setState({ ...state, message: "Created Musician successfully!", type: "success" });
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
        <div className={style.musician__container}>
            <div className={style.musician__title}>
                <h2>
                    <i className="fa fa-align-justify"></i> Add Musician
                </h2>
                <div className={style.musician__title__add}>
                    <Link to={props.location.state ? props.location.state.linkBack : '/musician'}>
                        <i className="fa fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
            <input type="text" className={style.input__musician} placeholder="Musician name" onChange={(event) => setState({...state, musician: {...state.musician, musician_name: event.target.value} })} />
            <select className={style.select_musician} onChange={(event) => setState({...state, musician: {...state.musician, musician_sex: event.target.value} })}>
                <option value="None">Selection gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
            <input type="date" className={style.input__date + " form-controler"} onChange={(event) => setState({...state, musician: {...state.musician, musician_date: event.target.value} })} />
            <button className={style.btn__musician} onClick={() => addMusician()}>Save</button>
            {state.message ? <Message message={state.message} typeMessage={state.type} closeMessage={closeMessage} /> : ''}
        </div>
    )
}
