import axios from 'axios';
import React, { useState, useEffect } from 'react';
import style from "./Genre.module.css";
import DeletePopup from "../DeletePopup/DeletePopup";
import { Link } from "react-router-dom";
import { LIMIT_PAGE, LINK_API } from "../../const";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default function Genre() {

    const [listGenre, setListGenre] = useState([]);
    const [state, setState] = useState({ genre: '', isActive: false, page: 1 });
    const [stateLoading, setStateLoading] = useState(true);

    // GET ALL GENRE
    const getAllGenre = () => {
        axios.get(`${LINK_API}/api/genre`)
            .then(result => {
                setListGenre(result.data);
                setTimeout(() => {
                    setStateLoading(false);
                }, 100)
            })
            .catch(err => {
                console.log(err);
                setStateLoading(false);
            });
    }

    // RENDER PAGE
    const renderPage = () => {
        const page_size = Math.ceil(listGenre.length / LIMIT_PAGE);

        let content = [];
        if (state.page > 1) {
            content.push(<div className={style.genre__page__item + " " + style.genre__page__pointer} onClick={() => setState({ ...state, page: state.page - 1 })}>
                <i className="fa fa-arrow-circle-left"></i>
            </div>);
        }
        if (page_size > 1) {
            content.push(<div className={style.genre__page__item}>{state.page}</div>);
        }
        if (state.page < page_size) {
            content.push(<div className={style.genre__page__item + " " + style.genre__page__pointer} onClick={() => setState({ ...state, page: state.page + 1 })}>
                <i className="fa fa-arrow-circle-right"></i>
            </div>);
        }
        return content;
    }

    // DELETE GENRE
    const deleteGenre = () => {
        axios.delete(`${LINK_API}/api/genre/${state.genre.genre_id}`)
            .then(result => {
                getAllGenre();
                setState({ ...state, isActive: false })
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getAllGenre();
        let sock = new SockJS('http://localhost:8080/socket');
        let stompClient = Stomp.over(sock);
        stompClient.connect({}, function (frame) {
            stompClient.subscribe('/topic/genre', function (result) {
                if (result.body === "true") {
                    getAllGenre();
                }
            });
        });
    }, []);

    // CLOSE POPUP
    const closePopup = () => {
        setState({ ...state, isActive: false })
    }

    //RENDER LIST GENRE
    const renderListGenre = () => {

        const totalPage = Math.ceil(listGenre.length / LIMIT_PAGE);
        if (state.page > totalPage && state.page > 1) {
            setState({ ...state, page: state.page - 1 });
        }
        const lastPage = state.page * LIMIT_PAGE;
        const firstPage = lastPage - LIMIT_PAGE;

        return listGenre === '' ? <tr><td colSpan="4">Genre is empty.</td></tr> : listGenre.slice(firstPage, lastPage).map((item, index) => {
            return <tr key={index}>
                <td>{item.genre_name}</td>
                <td>{item.song_num}</td>
                <td style={{ textAlign: 'center' }}><Link to={`/genre/edit/${item.genre_id}`}><i className="fa fa-pencil-alt"></i></Link></td>
                <td style={{ textAlign: 'center' }}><i className="fa fa-trash" onClick={() => setState({ ...state, genre: item, isActive: true })}></i></td>
            </tr>;
        })
    }

    return (
        <>
            {state.isActive ? <DeletePopup data={{ name: state.genre.genre_name, song_num: state.genre.song_num }} deleteData={deleteGenre} closePopup={closePopup} /> : ''}
            <div className={style.genre__container}>
                <div className={style.genre__title}>
                    <h2>
                        <i className="fa fa-align-justify"></i> Genre
                </h2>
                    <div className={style.genre__title__add}>
                        <Link to='/genre/create'>
                            <i className="fa fa-plus-circle"></i>
                        </Link>
                    </div>
                </div>
                <table className={style.genre__table}>
                    {stateLoading ? '' :
                        <thead>
                            <tr>
                                <th width="50%">Genre</th>
                                <th>Song Num</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>}
                    <tbody>
                        {stateLoading ? <tr><td colSpan="4" style={{ textAlign: 'center' }}><i className="fa fa-spinner"></i> Loading Genre...</td></tr> : renderListGenre()}
                    </tbody>
                </table>
                {stateLoading || <div className={style.genre__page}>{listGenre !== '' ? renderPage() : ''}</div>}
            </div>
        </>
    )
}
