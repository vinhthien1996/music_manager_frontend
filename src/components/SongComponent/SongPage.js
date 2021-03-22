import axios from 'axios';
import React, { useState, useEffect } from 'react';
import style from "./Song.module.css";
import { Link } from "react-router-dom";
import { LIMIT_PAGE, LINK_API } from "../../const";
import DeletePopup from "../DeletePopup/DeletePopup";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default function SongPage(props) {
    const [listSong, setListSong] = useState([]);
    const [stateLoading, setStateLoading] = useState(true);
    const [state, setState] = useState({ song: '', isActive: false, page: 1, limit: LIMIT_PAGE, page_size: 0 });

    const getAllSong = (p) => {
        axios.get(`${LINK_API}/api/song/page/${p}/${LIMIT_PAGE}`)
            .then(result => {
                setListSong(result.data);
                setTimeout(() => {
                    setStateLoading(false);
                }, 100);
            })
            .catch(err => console.log(err));
    }

    const getPage = () => {
        axios.get(`${LINK_API}/api/song/page/${LIMIT_PAGE}`)
            .then(result => setState({ ...state, page_size: result.data.page }))
            .catch(err => console.log(err));
    }

    const nextPage = () => {
        setState({ ...state, page: state.page + 1 });
        setStateLoading(true);
        getAllSong(state.page + 1);
    }
    const previousPage = () => {
        setState({ ...state, page: state.page - 1 });
        setStateLoading(true);
        getAllSong(state.page - 1);
    }
    const renderPage = () => {
        let content = [];
        if (props.match.params.id > 1) {
            content.push(<div className={style.song__page__item + " " + style.song__page__pointer}>
                <Link to={`/song/page/${Number(props.match.params.id) - 1}`}>
                    <i className="fa fa-arrow-circle-left"></i>
                </Link>
            </div>);
        }
        if (state.page_size > 1) {
            content.push(<div className={style.song__page__item}>{props.match.params.id}</div>);
        }
        if (props.match.params.id < state.page_size) {
            content.push(<div className={style.song__page__item + " " + style.song__page__pointer}>
                <Link to={`/song/page/${Number(props.match.params.id) + 1}`}>
                    <i className="fa fa-arrow-circle-right"></i>
                </Link>
            </div>);
        }
        return content;
    }

    useEffect(() => {
        getPage();
        getAllSong(props.match.params.id);
        let sock = new SockJS('http://localhost:8080/socket');
        let stompClient = Stomp.over(sock);
        stompClient.connect({}, function (frame) {
            stompClient.subscribe('/topic/song', function (result) {
                if (result.body === "true") {
                    getPage();
                    axios.get(`${LINK_API}/api/song/page/${LIMIT_PAGE}`)
                        .then(result => {
                            if (result.data.page < 2) {
                                window.location.replace("/");
                            }
                            getAllSong(props.match.params.id);
                        })
                        .catch(err => console.log(err));
                }
            });
        });
    }, []);

    const formatDate = (date) => {
        const year = date.substring(0, 4);
        const month = date.substring(5, 7);
        const day = date.substring(8, 10);
        return day + "/" + month + "/" + year;
    }

    const renderListSong = () => {
        return listSong === '' ? <tr><td colSpan="8">Song is empty.</td></tr> : listSong.map((item, index) => {
            return <tr key={index}><td>{item.song_name}</td>
                <td>{formatDate(item.release_time)}</td>
                <td>{item.genre_name}</td>
                <td>{item.musician_name}</td>
                <td>{item.singer_name}</td>
                <td>
                    <Link to={`/song/edit/${item.song_id}`}>
                        <i className="fa fa-pencil-alt"></i>
                    </Link>
                </td>
                <td><i className="fa fa-trash" onClick={() => setState({ ...state, song: item, isActive: true })}></i></td>
                <td><i className="fa fa-heart" style={{ color: item.favorite ? '#f75252' : '#fff' }} onClick={() => addFavoriteSong(item.song_id)}></i></td>
            </tr>;
        })
    }

    const deleteSong = () => {
        axios.delete(`${LINK_API}/api/song/${state.song.song_id}`)
            .then(result => {
                window.location.reload();
            })
            .catch(err => console.log(err));
    }
    const closePopup = () => {
        setState({ ...state, isActive: false })
    }

    const addFavoriteSong = (id) => {
        axios.get(`${LINK_API}/api/song/favorite/${id}`)
            .then(result => {
                getAllSong(props.match.params.id);
            })
            .catch(err => console.log(err));
    }
    return (
        <>
            {state.isActive ? <DeletePopup data={{ name: state.song.song_name, song_num: 0, isFavorite: state.song.favorite }} deleteData={deleteSong} closePopup={closePopup} /> : ''}
            <div className={style.song__container}>
                <div className={style.song__title}>
                    <h2>
                        <i className="fa fa-home"></i> Home
                </h2>
                    <div className={style.song__title__add}>
                        <Link to='/song/create'>
                            <i className="fa fa-plus-circle"></i>
                        </Link>
                    </div>
                </div>
                <table className={style.song__table}>
                    <thead>
                        {stateLoading ? '' :
                            <tr>
                                <th>Song Name</th>
                                <th>Release Time</th>
                                <th>Genre</th>
                                <th>Musician</th>
                                <th>Singer</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>}
                    </thead>
                    <tbody>
                        {stateLoading ? <tr><td colSpan="8" style={{ textAlign: 'center' }}><i className="fa fa-spinner"></i> Loading Song...</td></tr> : renderListSong()}
                    </tbody>
                </table>
                {stateLoading || <div className={style.song__page}>{listSong !== '' ? renderPage() : ''}</div>}
            </div>
        </>
    )
}
