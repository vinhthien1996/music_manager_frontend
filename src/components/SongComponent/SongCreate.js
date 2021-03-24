import axios from 'axios';
import React, { useState, useEffect } from 'react';
import style from "./Song.module.css";
import { Link } from "react-router-dom";
import Message from '../MessageComponent/Message';
import { LINK_API, MAX_SIZE } from "../../const";

export default function SongCreate() {
    const [state, setState] = useState({ song: {}, message: '', type: '' });
    const [listGenre, setListGenre] = useState([]);
    const [listMusician, setListMusician] = useState([]);
    const [listSinger, setListSinger] = useState([]);
    const [upload, setUpload] = useState({ title: 'Upload Song', file: null });

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
        } else if (!upload.file) {
            setState({ ...state, message: "No music files yet!", type: "error" });
        } else {
            const formData = new FormData();
            formData.append('file', upload.file);
            formData.append('song_name', state.song.song_name);
            formData.append('release_time', state.song.release_time + " 00:00:00");
            formData.append('genre_name', state.song.genre_name);
            formData.append('musician_name', state.song.musician_name);
            formData.append('singer_name', state.song.singer_name);
            axios.post(`${LINK_API}/api/song`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
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

    // HANDLE UPLOAD SONG
    const handleUpload = (event) => {
        // event.target.value = null;
        // SIZE Math.round(event.target.files[0].size / (1024 * 1024) * 100) / 100;
        if (event.target.files[0].type !== 'audio/mpeg') {
            setState({ ...state, message: "Only allow upload mp3 files!", type: "error" });
            event.target.value = null;
            setUpload({ ...upload, title: 'Upload Song' });
        } else if (event.target.files[0].size > MAX_SIZE) { // MAX SIZE 20MB
            setState({ ...state, message: "File size must under 20MB!", type: "error" });
            event.target.value = null;
            setUpload({ ...upload, title: 'Upload Song' });
        } else {
            setState({ ...state, message: "", type: "" });
            setUpload({ ...upload, title: event.target.files[0].name, file: event.target.files[0] });
        }
    }

    return (
        <div className={style.song__container}>
            <div className={style.song__title}>
                <h2>
                    <i className="fa fa-align-justify"></i> Create Song
                </h2>
                <div className={style.song__title__add}>
                    <Link to='/'>
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
                    <Link to={{ pathname: '/genre/create', state: { linkBack: '/song/create' } }}>
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
                    <Link to={{ pathname: '/musician/create', state: { linkBack: '/song/create' } }}>
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
                    <Link to={{ pathname: '/singer/create', state: { linkBack: '/song/create' } }}>
                        <i className="fa fa-plus-circle"></i>
                    </Link>
                </div>
            </div>
            <input type="date" defaultValue={state.song.release_time} className={style.input__date + " form-controler"} onChange={(event) => setState({ ...state, song: { ...state.song, release_time: event.target.value } })} />
            <input type="file" name="file" id="file" className={style.uploadFile} onChange={handleUpload} />
            <label for="file" className={style.uploadStyle}><i class="fa fa-cloud-upload-alt"></i> {upload.title}</label>
            <button className={style.btn__song} onClick={() => addSong()}>Save</button>
            {state.message ? <Message message={state.message} typeMessage={state.type} closeMessage={closeMessage} /> : ''}
        </div>
    )
}
