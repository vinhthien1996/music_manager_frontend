import axios from 'axios';
import React, { useState, useEffect } from 'react';
import style from "./Singer.module.css";
import { Link } from "react-router-dom";
import Message from '../MessageComponent/Message';

export default function SingerEdit(props) {
    const [state, setState] = useState({ singer: '', message: '', type: '' });

    const addSinger = () => {
        if (!state.singer.singer_name) {
            setState({ ...state, message: "Singer name is not null!", type: "error" });
        } else if (!state.singer.singer_sex || state.singer.singer_sex === 'None') {
            setState({ ...state, message: "Singer gender not yet selected!", type: "error" });
        } else if (!state.singer.singer_birthday) {
            setState({ ...state, message: "Singer birthday is not null!", type: "error" });
        } else {
            const data = {
                "singer_id": state.singer.singer_id,
                "singer_name": state.singer.singer_name,
                "singer_sex": state.singer.singer_sex,
                "singer_birthday": state.singer.singer_birthday
            };
            axios.put("http://localhost:8080/api/singer/" + state.singer.singer_id, data, { headers: { 'Content-Type': 'application/json' } })
                .then(result => {
                    setState({ ...state, message: "", type: "" });
                    setState({ ...state, message: "Updated singer successfully!", type: "success" });
                })
                .catch(err => {
                    setState({ ...state, message: "", type: "" });
                    setState({ ...state, message: err.response.data, type: "error" });
                });
        }
    }

    const formatDate = (date) => {
        return date.substring(0, 10);
    }

    const getSingerById = () => {
        axios.get(`http://localhost:8080/api/singer/${props.match.params.id}`)
            .then(result => {
                setState({ ...state, singer: {...state.singer, singer_id: result.data.singer_id, singer_name: result.data.singer_name, singer_sex: result.data.singer_sex, singer_birthday: formatDate(result.data.singer_birthday)} });
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getSingerById();
    }, []);

    const closeMessage = () => {
        setState({ ...state, message: "" });
    }

    return (
        <div className={style.singer__container}>
            <div className={style.singer__title}>
                <h2>
                    <i class="fa fa-microphone-alt"></i> Edit Singer
                </h2>
                <div className={style.singer__title__add}>
                    <Link to='/singer'>
                        <i className="fa fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
            <input type="text" defaultValue={state.singer.singer_name} className={style.input__singer} placeholder="Singer name" onChange={(event) => setState({ ...state, singer: {...state.singer, singer_name: event.target.value} })} />
            <select value={state.singer.singer_sex} className={style.select_singer} onChange={(event) => setState({...state, singer: {...state.singer, singer_sex: event.target.value} })}>
                <option value="None">Selection gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
            <input type="date" defaultValue={state.singer.singer_birthday} className={style.input__date + " form-controler"} onChange={(event) => setState({...state, singer: {...state.singer, singer_birthday: event.target.value} })} />
            <button className={style.btn__singer} onClick={() => addSinger()}>Save</button>
            {state.message ? <Message message={state.message} typeMessage={state.type} closeMessage={closeMessage} /> : ''}
        </div>
    )
}
