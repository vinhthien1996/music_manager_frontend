import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from "./Musician.module.css";
import { Link } from "react-router-dom";
import { LIMIT_PAGE, LINK_API } from "../../const";
import DeletePopup from "../DeletePopup/DeletePopup";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default function Musician() {

    const [listMusician, setListMusician] = useState([]);
    const [stateLoading, setStateLoading] = useState(true);
    const [state, setState] = useState({ musician: '', isActive: false, page: 1 });

    // GET ALL MUSICIAN
    const getAllMusician = () => {
        axios.get(`${LINK_API}/api/musician`)
            .then(result => {
                setListMusician(result.data);
                setTimeout(() => {
                    setStateLoading(false);
                }, 100)
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getAllMusician();
        let sock = new SockJS('http://localhost:8080/socket');
        let stompClient = Stomp.over(sock);
        stompClient.connect({}, function (frame) {
            stompClient.subscribe('/topic/musician', function (result) {
                if (result.body === "true") {
                    getAllMusician();
                }
            });
        });
    }, []);

    // RENDER LIST MUSICIAN
    const renderListMusician = () => {

        const totalPage = Math.ceil(listMusician.length / LIMIT_PAGE);
        if (state.page > totalPage && state.page > 1) {
            setState({ ...state, page: state.page - 1 });
        }
        const lastPage = state.page * LIMIT_PAGE;
        const firstPage = lastPage - LIMIT_PAGE;

        return listMusician === '' ? <tr><td colSpan="4">Musician is empty.</td></tr> : listMusician.slice(firstPage, lastPage).map((item, index) => {
            return <tr key={index}>
                <td>{item.musician_name}</td>
                <td>{item.song_num}</td>
                <td style={{ textAlign: 'center' }}>
                    <Link to={`/musician/edit/${item.musician_id}`}>
                        <i className="fa fa-pencil-alt"></i>
                    </Link>
                </td>
                <td style={{ textAlign: 'center' }}><i className="fa fa-trash" onClick={() => setState({ ...state, musician: item, isActive: true })}></i></td>
            </tr>;
        })
    }

    // RENDER PAGE
    const renderPage = () => {
        const page_size = Math.ceil(listMusician.length / LIMIT_PAGE);

        let content = [];
        if (state.page > 1) {
            content.push(<div className={style.musician__page__item + " " + style.musician__page__pointer} onClick={() => setState({ ...state, page: state.page - 1 })}>
                <i className="fa fa-arrow-circle-left"></i>
            </div>);
        }
        if (page_size > 1) {
            content.push(<div className={style.musician__page__item}>{state.page}</div>);
        }
        if (state.page < page_size) {
            content.push(<div className={style.musician__page__item + " " + style.musician__page__pointer} onClick={() => setState({ ...state, page: state.page + 1 })}>
                <i className="fa fa-arrow-circle-right"></i>
            </div>);
        }
        return content;
    }

    // DELETE MUSICIAN
    const deleteMusician = () => {
        axios.delete(`${LINK_API}/api/musician/${state.musician.musician_id}`)
            .then(result => {
                setState({ ...state, isActive: false })
                getAllMusician();
            })
            .catch(err => console.log(err));
    }

    // CLOSE POPUP
    const closePopup = () => {
        setState({ ...state, isActive: false })
    }

    return (
        <>
            {state.isActive ? <DeletePopup data={{name: state.musician.musician_name, song_num: state.musician.song_num}} deleteData={deleteMusician} closePopup={closePopup} /> : ''}
            <div className={style.musician__container}>
                <div className={style.musician__title}>
                    <h2>
                        <i className="fab fa-itunes-note"></i> Musician
                </h2>
                    <div className={style.musician__title__add}>
                        <Link to='/musician/create'>
                            <i className="fa fa-plus-circle"></i>
                        </Link>
                    </div>
                </div>
                <table className={style.musician__table}>
                    {stateLoading ? '' :
                        <thead>
                            <tr>
                                <th width="50%">Musician</th>
                                <th>Song Num</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>}
                    <tbody>
                        {stateLoading ? <tr><td colSpan="4" style={{ textAlign: 'center' }}><i className="fa fa-spinner"></i> Loading Musician...</td></tr> : renderListMusician()}
                    </tbody>
                </table>
                {stateLoading || <div className={style.musician__page}>{listMusician !== '' ? renderPage(): ''}</div>}
            </div>
        </>
    )
}
