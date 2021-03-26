import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from "./Singer.module.css";
import { Link } from "react-router-dom";
import { LIMIT_PAGE, LINK_API } from "../../const";
import DeletePopup from "../DeletePopup/DeletePopup";

export default function SingerDetail(props) {

    const [listSong, setListSong] = useState([]);
    const [stateLoading, setStateLoading] = useState(true);
    const [info, setInfo] = useState([]);
    const [state, setState] = useState({ singer: '', song: '', isActive: false, page: 1 });

    useEffect(() => {
        getInfoSinger();
        getAllSong();
    }, []);

    // GET INFO SINGER
    const getInfoSinger = () => {
        axios.get(`${LINK_API}/api/singer/${props.match.params.id}`)
            .then(result => {
                setInfo(result.data);
                setTimeout(() => {
                    setStateLoading(false);
                }, 100);
            })
            .catch(err => console.log(err));
    }

    // GET ALL SONG
    const getAllSong = () => {
        axios.get(`${LINK_API}/api/song/singer/${props.match.params.id}`)
            .then(result => {
                setListSong(result.data);
                setTimeout(() => {
                    setStateLoading(false);
                }, 100)
            })
            .catch(err => console.log(err));
    }

    // RENDER LIST SONG
    const renderListSong = () => {
        const totalPage = Math.ceil(listSong.length / LIMIT_PAGE);
        if (state.page > totalPage && state.page > 1) {
            setState({ ...state, page: state.page - 1 });
        }
        const lastPage = state.page * LIMIT_PAGE;
        const firstPage = lastPage - LIMIT_PAGE;

        return listSong === '' ? <tr><td colSpan="4">Singer has no song yet.</td></tr> : listSong.slice(firstPage, lastPage).map((item, index) => {
            return <tr key={index}>
                <td>
                    {item.song_name}
                </td>
                <td>{formatDate(item.release_time)}</td>
                <td style={{ textAlign: 'center' }}>
                    <Link to={{ pathname: `/song/edit/${item.song_id}`, state: { linkBack: `/singer/detail/${props.match.params.id}` } }}>
                        <i className="fa fa-pencil-alt"></i>
                    </Link>
                </td>
                <td style={{ textAlign: 'center' }}><i className="fa fa-trash" onClick={() => setState({ ...state, song: item, isActive: true })}></i></td>
            </tr>;
        })
    }

    // RENDER PAGE
    const renderPage = () => {
        const page_size = Math.ceil(listSong.length / LIMIT_PAGE);

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

    // FORMAT DATE
    const formatDate = (date) => {
        const year = !!date && date.substring(0, 4);
        const month = !!date && date.substring(5, 7);
        const day = !!date && date.substring(8, 10);
        return day + "/" + month + "/" + year;
    }

    // DELETE SONG
    const deleteSong = () => {
        axios.delete(`${LINK_API}/api/song/${state.song.song_id}`)
            .then(result => {
                setState({ ...state, isActive: false });
                getAllSong();
            })
            .catch(err => console.log(err));
    }

    // CLOSE POPUP
    const closePopup = () => {
        setState({ ...state, isActive: false })
    }

    return (
        <>
            {state.isActive ? <DeletePopup data={{ name: state.song.song_name, song_num: 0, isFavorite: state.song.favorite }} deleteData={deleteSong} closePopup={closePopup} /> : ''}
            <div className={style.singer__container}>
                <div className={style.singer__title}>
                    <h2>
                        <i class="fa fa-microphone-alt"></i> Singer Detail
                    </h2>
                    <div className={style.singer__title__add}>
                        <Link to='/singer'>
                            <i className="fa fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
                {stateLoading ? <div className={style.singer__detail_container} style={{ textAlign: 'center' }}><i className="fa fa-spinner"></i> Loading Info Singer...</div> :
                    <div className={style.singer__detail_container}>
                        <div className={style.singer__detail_info}>
                            <div className={style.singer__detail_info_left}>Name:</div>
                            <div className={style.singer__detail_info_right}>{info.singer_name}</div>
                        </div>
                        <div className={style.singer__detail_info}>
                            <div className={style.singer__detail_info_left}>Birthday:</div>
                            <div className={style.singer__detail_info_right}>{formatDate(info.singer_birthday)}</div>
                        </div>
                        <div className={style.singer__detail_info}>
                            <div className={style.singer__detail_info_left}>Gender:</div>
                            <div className={style.singer__detail_info_right}>{info.singer_sex}</div>
                        </div>
                    </div>}

                {/* LIST SONG */}

                <div className={style.singer__title}>
                    <h2>
                        <i className="fa fa-list-ul"></i> List Song
                </h2>
                </div>

                <table className={style.singer__table}>
                    {stateLoading ? '' :
                        <thead>
                            <tr>
                                <th width="50%">Song Name</th>
                                <th>Release Time</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>}
                    <tbody>
                        {stateLoading ? <tr><td colSpan="4" style={{ textAlign: 'center' }}><i className="fa fa-spinner"></i> Loading List Song...</td></tr> : renderListSong()}
                    </tbody>
                </table>
                {stateLoading || <div className={style.singer__page}>{listSong !== '' ? renderPage() : ''}</div>}
            </div>
        </>
    )
}
