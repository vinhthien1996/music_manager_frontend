import axios from 'axios';
import React, { useState, useEffect } from 'react';
import style from "./Musician.module.css";
import { Link } from "react-router-dom";
import Message from '../MessageComponent/Message';

export default function MusicianEdit(props) {
    const [state, setState] = useState({ musician: '', message: '', type: '' });

    const addMusician = () => {
        if (!state.musician.musician_name) {
            setState({ ...state, message: "Musician name is not null!", type: "error" });
        } else if (!state.musician.musician_sex || state.musician.musician_sex === 'None') {
            setState({ ...state, message: "Musician gender not yet selected!", type: "error" });
        } else if (!state.musician.musician_birthday) {
            setState({ ...state, message: "Musician birthday is not null!", type: "error" });
        } else {
            const data = {
                "musician_id": state.musician.musician_id,
                "musician_name": state.musician.musician_name,
                "musician_sex": state.musician.musician_sex,
                "musician_birthday": state.musician.musician_birthday
            };
            axios.put("http://localhost:8080/api/musician/" + state.musician.musician_id, data, { headers: { 'Content-Type': 'application/json' } })
                .then(result => {
                    setState({ ...state, message: "", type: "" });
                    setState({ ...state, message: "Updated Musician successfully!", type: "success" });
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

    const getMusicianById = () => {
        axios.get(`http://localhost:8080/api/musician/${props.match.params.id}`)
            .then(result => {
                setState({ ...state, musician: {...state.musician, musician_id: result.data.musician_id, musician_name: result.data.musician_name, musician_sex: result.data.musician_sex, musician_birthday: formatDate(result.data.musician_birthday)} });
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getMusicianById();
    }, []);

    const closeMessage = () => {
        setState({ ...state, message: "" });
    }

    return (
        <div className={style.musician__container}>
            <div className={style.musician__title}>
                <h2>
                    <i className="fab fa-itunes-note"></i> Edit Musician
                </h2>
                <div className={style.musician__title__add}>
                    <Link to='/musician'>
                        <i className="fa fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
            <input type="text" defaultValue={state.musician.musician_name} className={style.input__musician} placeholder="Musician name" onChange={(event) => setState({ ...state, musician: {...state.musician, musician_name: event.target.value} })} />
            <select value={state.musician.musician_sex} className={style.select_musician} onChange={(event) => setState({...state, musician: {...state.musician, musician_sex: event.target.value} })}>
                <option value="None">Selection gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
            <input type="date" defaultValue={state.musician.musician_birthday} className={style.input__date + " form-controler"} onChange={(event) => setState({...state, musician: {...state.musician, musician_birthday: event.target.value} })} />
            <button className={style.btn__musician} onClick={() => addMusician()}>Save</button>
            {state.message ? <Message message={state.message} typeMessage={state.type} closeMessage={closeMessage} /> : ''}
        </div>
    )
}
