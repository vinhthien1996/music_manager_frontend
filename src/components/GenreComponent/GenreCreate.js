import axios from 'axios';
import React, { useState } from 'react';
import style from "./Genre.module.css";
import { Link } from "react-router-dom";
import Message from '../MessageComponent/Message';
import { LINK_API } from "../../const";

export default function GenreCreate(props) {

    const [state, setState] = useState({ genre: '', message: '', type: '' });

    // ADD GENRE
    const addGenre = () => {
        if (!state.genre) {
            setState({ ...state, message: "Genre is not null!", type: "error" });
        } else {
            axios.post(`${LINK_API}/api/genre`, {
                "genre_name": state.genre
            })
                .then(result => {
                    setState({ ...state, message: "", type: "" });
                    setState({ ...state, message: "Created Genre successfully!", type: "success" });
                })
                .catch(err => {
                    setState({ ...state, message: "", type: "" });
                    setState({ ...state, message: err.response.data, type: "error" });
                });
        }
    }

    // CLOSE MESSAGE
    const closeMessage = () => {
        setState({ ...state, message: "" });
    }

    return (
        <div className={style.genre__container}>
            <div className={style.genre__title}>
                <h2>
                    <i className="fa fa-align-justify"></i> Add Genre
                </h2>
                <div className={style.genre__title__add}>
                    <Link to={props.location.state ? props.location.state.linkBack : '/genre'}>
                        <i className="fa fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
            <input type="text" className={style.input__genre} placeholder="Genre name" onChange={(event) => setState({ genre: event.target.value })} />
            <button className={style.btn__genre} onClick={() => addGenre()}>Save</button>
            {state.message ? <Message message={state.message} typeMessage={state.type} closeMessage={closeMessage} /> : ''}
        </div>
    )
}
