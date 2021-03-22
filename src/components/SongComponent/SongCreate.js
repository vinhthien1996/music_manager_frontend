import axios from 'axios';
import React, { useState, useEffect } from 'react';
import style from "./Song.module.css";
import { Link } from "react-router-dom";
import Message from '../MessageComponent/Message';
import { LINK_API } from "../../const";

export default function SongCreate() {
    const [state, setState] = useState({ song: {}, message: '', type: '' });
    const [listGenre, setListGenre] = useState([]);
    const [listMusician, setListMusician] = useState([]);
    const [listSinger, setListSinger] = useState([]);

    // GET GENRE
    const getAllGenre = (p) => {
        axios.get(`${LINK_API}/api/genre`)
            .then(result => {
                setListGenre(result.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    // RENDER GENRE
    const renderGenre = () => {
        return listGenre === '' ? '' : listGenre.map((item, index) => {
            return <option key={index} value={item.genre_name}>{item.genre_name}</option>
        });
    }

    //GET MUSICIAN
    const getAllMusician = (p) => {
        axios.get(`${LINK_API}/api/musician`)
            .then(result => {
                setListMusician(result.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    // RENDER MUSICIAN
    const renderMusician = () => {
        return listMusician === '' ? '' : listMusician.map((item, index) => {
            return <option key={index} value={item.musician_name}>{item.musician_name}</option>
        });
    }

    // GET SINGER
    const getAllSinger = (p) => {
        axios.get(`${LINK_API}/api/singer`)
            .then(result => {
                setListSinger(result.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    // RENDER SINGER
    const renderSinger = () => {
        return listSinger === '' ? '' : listSinger.map((item, index) => {
            return <option key={index} value={item.singer_name}>{item.singer_name}</option>
        });
    }

    useEffect(() => {
        getAllGenre();
        getAllMusician();
        getAllSinger();
    }, [])

    // ADD SONG
    const addSong = () => {
        if (!state.song.song_name) {
            setState({ ...state, message: "Song name is not null!", type: "error" });
        } else if (!state.song.genre_name || state.song.genre_name === 'None') {
            setState({ ...state, message: "Genre name not yet selected!", type: "error" });
        } else if (!state.song.musician_name || state.song.musician_name === 'None') {
            setState({ ...state, message: "Musician name not yet selected!", type: "error" });
        } else if (!state.song.singer_name || state.song.singer_name === 'None') {
            setState({ ...state, message: "Singer name not yet selected!", type: "error" });
        } else if (!state.song.release_time) {
            setState({ ...state, message: "Release time is not null!", type: "error" });
        } else {
            axios.post(`${LINK_API}/api/song`, {
                "song_name": state.song.song_name,
                "release_time": state.song.release_time,
                "genre_name": state.song.genre_name,
                "musician_name": state.song.musician_name,
                "singer_name": state.song.singer_name
            })
                .then(result => {
                    setState({ ...state, message: "", type: "" });
                    setState({ ...state, message: "Created song successfully!", type: "success" });
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
        <div className={style.song__container}>
            <div className={style.song__title}>
                <h2>
                    <i className="fa fa-align-justify"></i> Create Song
                </h2>
                <div className={style.song__title__add}>
                    <Link to='/home'>
                        <i className="fa fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
            <input type="text" defaultValue={state.song.song_name} className={style.input__song} placeholder="Song name" onChange={(event) => setState({ ...state, song: { ...state.song, song_name: event.target.value } })} />
            {/* GENRE */}
            <div className={style.song__select}>
                <div className={style.song__select__item}>
                    <select value={state.song.genre_name} className={style.select_song} onChange={(event) => setState({ ...state, song: { ...state.song, genre_name: event.target.value } })}>
                        <option value="None">Selection Genre</option>
                        {renderGenre()}
                    </select>
                </div>
                <div className={style.song__select__add}>
                <Link to={{pathname: '/genre/create', state: {linkBack: '/song/create'}}}>
                        <i className="fa fa-plus-circle"></i>
                    </Link>
                </div>
            </div>
            {/* MUSICIAN */}
            <div className={style.song__select}>
                <div className={style.song__select__item}>
                    <select value={state.song.musician_name} className={style.select_song} onChange={(event) => setState({ ...state, song: { ...state.song, musician_name: event.target.value } })}>
                        <option value="None">Selection Musician</option>
                        {renderMusician()}
                    </select>
                </div>
                <div className={style.song__select__add}>
                    <Link to={{pathname: '/musician/create', state: {linkBack: '/song/create'}}}>
                        <i className="fa fa-plus-circle"></i>
                    </Link>
                </div>
            </div>
            {/* SINGER */}
            <div className={style.song__select}>
                <div className={style.song__select__item}>
                    <select value={state.song.singer_name} className={style.select_song} onChange={(event) => setState({ ...state, song: { ...state.song, singer_name: event.target.value } })}>
                        <option value="None">Selection Singer</option>
                        {renderSinger()}
                    </select>
                </div>
                <div className={style.song__select__add}>
                    <Link to={{pathname: '/singer/create', state: {linkBack: '/song/create'}}}>
                        <i className="fa fa-plus-circle"></i>
                    </Link>
                </div>
            </div>
            <input type="date" defaultValue={state.song.release_time} className={style.input__date + " form-controler"} onChange={(event) => setState({ ...state, song: { ...state.song, release_time: event.target.value } })} />
            <button className={style.btn__song} onClick={() => addSong()}>Save</button>
            {state.message ? <Message message={state.message} typeMessage={state.type} closeMessage={closeMessage} /> : ''}
        </div>
    )
}
