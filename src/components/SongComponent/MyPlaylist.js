import axios from 'axios';
import React, { useState, useEffect } from 'react';
import style from "./Song.module.css";
import { LIMIT_PAGE, LINK_API } from "../../const";
import PlaylistPopup from "../DeletePopup/PlaylistPopup";

export default function MyPlaylist(props) {
    const [listSong, setListSong] = useState([]);
    const [arrange, setArrange] = useState({ value: 'song_name', orderBy: true });
    const [stateLoading, setStateLoading] = useState(true);
    const [state, setState] = useState({ song: '', isActive: false, page: 1 });

    const getAllSong = () => {
        axios.get(`${LINK_API}/api/song/favorite`)
            .then(result => {
                setListSong(result.data);
                setTimeout(() => {
                    setStateLoading(false);
                }, 100);
            })
            .catch(err => console.log(err));
    }

    const getPage = () => {
        axios.get(`${LINK_API}/api/song/page-favorite/${LIMIT_PAGE}`)
            .then(result => setState({ ...state, page_size: result.data.page }))
            .catch(err => console.log(err));
    }

    const renderPage = () => {
        const page_size = Math.ceil(listSong.length / LIMIT_PAGE);

        let content = [];
        if (state.page > 1) {
            content.push(<div className={style.song__page__item + " " + style.song__page__pointer} onClick={() => setState({ ...state, page: state.page - 1 })}>
                <i className="fa fa-arrow-circle-left"></i>
            </div>);
        }
        if (page_size > 1) {
            content.push(<div className={style.song__page__item}>{state.page}</div>);
        }
        if (state.page < page_size) {
            content.push(<div className={style.song__page__item + " " + style.song__page__pointer} onClick={() => setState({ ...state, page: state.page + 1 })}>
                <i className="fa fa-arrow-circle-right"></i>
            </div>);
        }
        return content;
    }

    useEffect(() => {
        getPage();
        getAllSong();
    }, []);

    const formatDate = (date) => {
        const year = date.substring(0, 4);
        const month = date.substring(5, 7);
        const day = date.substring(8, 10);
        return day + "/" + month + "/" + year;
    }

    const arrangeList = (list) => {
        return list.sort((a, b) => {
            let fa, fb;
            if (arrange.value === 'song_id') {
                fa = a.song_id;
                fb = b.song_id;
            } else if (arrange.value === 'song_name') {
                fa = a.song_name;
                fb = b.song_name;
            } else if (arrange.value === 'release_time') {
                fa = a.release_time;
                fb = b.release_time;
            } else if (arrange.value === 'genre_name') {
                fa = a.genre_name;
                fb = b.genre_name;
            } else if (arrange.value === 'musician_name') {
                fa = a.musician_name;
                fb = b.musician_name;
            } else if (arrange.value === 'singer_name') {
                fa = a.singer_name;
                fb = b.singer_name;
            }

            if (fa < fb) {
                return arrange.orderBy ? -1 : 1;
            }
            if (fa > fb) {
                return arrange.orderBy ? 1 : -1;
            }
            return 0;
        });
    }

    const renderListSong = () => {

        const totalPage = Math.ceil(listSong.length / LIMIT_PAGE);
        if (state.page > totalPage) {
            setState({ ...state, page: state.page - 1 });
        }
        const lastPage = (state.page > totalPage ? state.page - 1 : state.page) * LIMIT_PAGE;
        const firstPage = lastPage - LIMIT_PAGE;
        return listSong === '' ? <tr><td colSpan="8">Song is empty.</td></tr> : arrangeList(listSong.slice(firstPage, lastPage)).map((item, index) => {
            return <tr key={index}><td>{item.song_name}</td>
                <td>{formatDate(item.release_time)}</td>
                <td>{item.genre_name}</td>
                <td>{item.musician_name}</td>
                <td>{item.singer_name}</td>
                <td><i className="fa fa-heart" style={{ color: item.favorite ? '#f75252' : '#fff' }} onClick={() => setState({ ...state, song: item, isActive: true })}></i></td>
            </tr>;
        })
    }

    const closePopup = () => {
        setState({ ...state, isActive: false })
    }

    const addFavoriteSong = () => {
        axios.get(`${LINK_API}/api/song/favorite/${state.song.song_id}`)
            .then(result => {
                getAllSong();
                setState({ ...state, isActive: false });
            })
            .catch(err => console.log(err));
    }

    return (
        <>
            {state.isActive ? <PlaylistPopup data={{ name: state.song.song_name }} deleteData={addFavoriteSong} closePopup={closePopup} /> : ''}
            <div className={style.song__container}>
                <div className={style.song__title}>
                    <h2>
                        <i className="fa fa-home"></i> My Playlist
                    </h2>
                </div>
                <table className={style.song__table}>
                    <thead>
                        {stateLoading ? '' :
                            <tr>
                                <th width="20%" onClick={() => setArrange({ ...arrange, value: 'song_name', orderBy: arrange.value !== 'song_name' ? true : !arrange.orderBy })}>Song Name {arrange.value === 'song_name' ? (arrange.orderBy ? <i class="fa fa-angle-up"></i> : <i class="fa fa-angle-down"></i>) : ''}</th>
                                <th width="15%" onClick={() => setArrange({ ...arrange, value: 'release_time', orderBy: arrange.value !== 'release_time' ? true : !arrange.orderBy })}>Release Time {arrange.value === 'release_time' ? (arrange.orderBy ? <i class="fa fa-angle-up"></i> : <i class="fa fa-angle-down"></i>) : ''}</th>
                                <th width="20%" onClick={() => setArrange({ ...arrange, value: 'genre_name', orderBy: arrange.value !== 'genre_name' ? true : !arrange.orderBy })}>Genre {arrange.value === 'genre_name' ? (arrange.orderBy ? <i class="fa fa-angle-up"></i> : <i class="fa fa-angle-down"></i>) : ''}</th>
                                <th width="20%" onClick={() => setArrange({ ...arrange, value: 'musician_name', orderBy: arrange.value !== 'musician_name' ? true : !arrange.orderBy })}>Musician {arrange.value === 'musician_name' ? (arrange.orderBy ? <i class="fa fa-angle-up"></i> : <i class="fa fa-angle-down"></i>) : ''}</th>
                                <th width="20%" onClick={() => setArrange({ ...arrange, value: 'singer_name', orderBy: arrange.value !== 'singer_name' ? true : !arrange.orderBy })}>Singer {arrange.value === 'singer_name' ? (arrange.orderBy ? <i class="fa fa-angle-up"></i> : <i class="fa fa-angle-down"></i>) : ''}</th>
                                <th width="5%"></th>
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
