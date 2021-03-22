import axios from 'axios';
import React, { useState, useEffect } from 'react';
import style from "./Genre.module.css";
import { Link } from "react-router-dom";
import Message from '../MessageComponent/Message';

export default function GenreEdit(props) {
    const [state, setState] = useState({ genre: '', genre_name: '', message: '', type: '' });

    // ADD GENRE
    const addGenre = () => {
        if (state.genre_name === '') {
            setState({ ...state, message: "Genre is not null!", type: "error" });
        } else {
            const data = {
                "genre_id": state.genre.genre_id,
                "genre_name": state.genre_name,
                "genre_num": state.genre.genre_num
            };
            axios.put("http://localhost:8080/api/genre/" + state.genre.genre_id, data, { headers: { 'Content-Type': 'application/json' } })
                .then(result => {
                    setState({ ...state, message: "", type: "" });
                    setState({ ...state, message: "Updated Genre successfully!", type: "success" });
                })
                .catch(err => {
                    setState({ ...state, message: "", type: "" });
                    setState({ ...state, message: err.response.data, type: "error" });
                });
        }
    }

    // GET GENRE BY ID
    const getGenreById = () => {
        axios.get(`http://localhost:8080/api/genre/${props.match.params.id}`)
            .then(result => {
                setState({ ...state, genre: result.data, genre_name: result.data.genre_name });
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getGenreById();
    }, []);

    // CLOSE MESSAGE
    const closeMessage = () => {
        setState({ ...state, message: "" });
    }

    return (
        <div className={style.genre__container}>
            <div className={style.genre__title}>
                <h2>
                    <i className="fa fa-align-justify"></i> Edit Genre
                </h2>
                <div className={style.genre__title__add}>
                    <Link to='/genre'>
                        <i className="fa fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
            <input type="text" defaultValue={state.genre_name} className={style.input__genre} placeholder="Genre name" onChange={(event) => setState({...state, genre_name: event.target.value })} />
            <button className={style.btn__genre} onClick={() => addGenre()}>Save</button>
            {state.message ? <Message message={state.message} typeMessage={state.type} closeMessage={closeMessage} /> : ''}
        </div>
    )
}
