import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from "./Singer.module.css";
import { Link } from "react-router-dom";
import { LIMIT_PAGE, LINK_API } from "../../const";
import DeletePopup from "../DeletePopup/DeletePopup";

export default function Singer() {

    const [listSinger, setListSinger] = useState([]);
    const [stateLoading, setStateLoading] = useState(true);
    const [state, setState] = useState({ singer: '', isActive: false, page: 1 });

    // GET ALL SINGER
    const getAllSinger = () => {
        axios.get(`${LINK_API}/api/singer`)
            .then(result => {
                setListSinger(result.data);
                setTimeout(() => {
                    setStateLoading(false);
                }, 100)
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getAllSinger();
    }, []);

    // RENDER LIST SINGER
    const renderListSinger = () => {

        const totalPage = Math.ceil(listSinger.length / LIMIT_PAGE);
        if (state.page > totalPage) {
            setState({ ...state, page: state.page - 1 });
        }
        const lastPage = (state.page > totalPage ? state.page - 1 : state.page) * LIMIT_PAGE;
        const firstPage = lastPage - LIMIT_PAGE;

        return listSinger === '' ? <tr><td colSpan="4">Singer is empty.</td></tr> : listSinger.slice(firstPage, lastPage).map((item, index) => {
            return <tr key={index}>
                <td>
                    <Link to={`/singer/detail/${item.singer_id}`}>
                        {item.singer_name}
                    </Link>
                </td>
                <td>{item.song_num}</td>
                <td style={{ textAlign: 'center' }}>
                    <Link to={`/singer/edit/${item.singer_id}`}>
                        <i className="fa fa-pencil-alt"></i>
                    </Link>
                </td>
                <td style={{ textAlign: 'center' }}><i className="fa fa-trash" onClick={() => setState({ ...state, singer: item, isActive: true })}></i></td>
            </tr>;
        })
    }

    // RENDER PAGE
    const renderPage = () => {
        const page_size = Math.ceil(listSinger.length / LIMIT_PAGE);

        let content = [];
        if (state.page > 1) {
            content.push(<div className={style.singer__page__item + " " + style.singer__page__pointer} onClick={() => setState({ ...state, page: state.page - 1 })}>
                <i className="fa fa-arrow-circle-left"></i>
            </div>);
        }
        if (page_size > 1) {
            content.push(<div className={style.singer__page__item}>{state.page}</div>);
        }
        if (state.page < page_size) {
            content.push(<div className={style.singer__page__item + " " + style.singer__page__pointer} onClick={() => setState({ ...state, page: state.page + 1 })}>
                <i className="fa fa-arrow-circle-right"></i>
            </div>);
        }
        return content;
    }

    // DELETE SINGER
    const deleteSinger = () => {
        axios.delete(`${LINK_API}/api/singer/${state.singer.singer_id}`)
            .then(result => {
                setState({ ...state, isActive: false });
                getAllSinger();
            })
            .catch(err => console.log(err));
    }

    // CLOSE POPUP
    const closePopup = () => {
        setState({ ...state, isActive: false })
    }

    return (
        <>
            {state.isActive ? <DeletePopup data={{ name: state.singer.singer_name, song_num: state.singer.song_num }} deleteData={deleteSinger} closePopup={closePopup} /> : ''}
            <div className={style.singer__container}>
                <div className={style.singer__title}>
                    <h2>
                        <i className="fab fa-itunes-note"></i> Singer
                </h2>
                    <div className={style.singer__title__add}>
                        <Link to='/singer/create'>
                            <i className="fa fa-plus-circle"></i>
                        </Link>
                    </div>
                </div>
                <table className={style.singer__table}>
                    {stateLoading ? '' :
                        <thead>
                            <tr>
                                <th width="50%">Singer</th>
                                <th>Song Num</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>}
                    <tbody>
                        {stateLoading ? <tr><td colSpan="4" style={{ textAlign: 'center' }}><i className="fa fa-spinner"></i> Loading Singer...</td></tr> : renderListSinger()}
                    </tbody>
                </table>
                {stateLoading || <div className={style.singer__page}>{listSinger !== '' ? renderPage() : ''}</div>}
            </div>
        </>
    )
}
