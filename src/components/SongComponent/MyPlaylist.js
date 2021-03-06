import axios from 'axios';
import React, { useState, useEffect } from 'react';
import style from "./Song.module.css";
import { LIMIT_PAGE, LINK_API } from "../../const";
import PlaylistPopup from "../DeletePopup/PlaylistPopup";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Play from '../PlayComponent/Play';

export default function MyPlaylist(props) {
    const [listSong, setListSong] = useState([]);
    const [arrange, setArrange] = useState({ value: 'song_name', orderBy: true });
    const [stateLoading, setStateLoading] = useState(true);
    const [state, setState] = useState({ song: '', isActive: false, page: 1 });
    const [playing, setPlaying] = useState(false);
    const [play, setPlay] = useState({ mp3: '/mp3/HappyNewYear.mp3', song_name: '', singer_name: '', favorite: false });
    const [listSearch, setListSearch] = useState([]);

    // GET ALL SONG
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

    // RENDER PAGE
    const renderPage = () => {
        let data = listSong;
        if(listSearch.length > 0) {
            data = listSearch;
        }

        const page_size = Math.ceil(data.length / LIMIT_PAGE);

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

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllSong();
        let sock = new SockJS('http://localhost:8080/socket');
        let stompClient = Stomp.over(sock);
        stompClient.connect({}, function (frame) {
            stompClient.subscribe('/topic/song', function (result) {
                if (result.body === "true") {
                    getAllSong();
                }
            });
        });
    }, []);

    // FORMAT DATE
    const formatDate = (date) => {
        const year = date.substring(0, 4);
        const month = date.substring(5, 7);
        const day = date.substring(8, 10);
        return day + "/" + month + "/" + year;
    }

    // ARRANGE LIST
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

    // RENDER LIST SONG
    const renderListSong = () => {
        let data = listSong;
        if(listSearch.length > 0) {
            data = listSearch;
        }

        const totalPage = Math.ceil(data.length / LIMIT_PAGE);
        if (state.page > totalPage && state.page > 1) {
            setState({ ...state, page: state.page - 1 });
        }
        const lastPage = state.page * LIMIT_PAGE;
        const firstPage = lastPage - LIMIT_PAGE;
        return data === '' ? <tr><td colSpan="9">Song is empty.</td></tr> : arrangeList(data.slice(firstPage, lastPage)).map((item, index) => {
            return <tr key={index}><td>{item.song_name}</td>
                <td>{formatDate(item.release_time)}</td>
                <td>{item.genre_name}</td>
                <td>{item.musician_name}</td>
                <td>{item.singer_name}</td>
                <td><i className="fa fa-heart" style={{ color: item.favorite ? '#ff3b59' : '#fff' }} onClick={() => setState({ ...state, song: item, isActive: true })}></i></td>
                <td>{
                    play.song_name === item.song_name ?
                        <i class="fa fa-stop-circle" onClick={() => {
                            setPlay({ ...play, mp3: '', song_name: '', singer_name: '', favorite: false });
                            setPlaying(false);
                        }}></i>
                        :
                        item.url === null ? '' : <i className="fa fa-play-circle" onClick={() => {
                            setPlaying(false);
                            setPlay({ ...play, url: item.url, song_name: item.song_name, singer_name: item.singer_name, favorite: item.favorite });
                            setPlaying(true);
                        }}></i>
                }</td>
            </tr>;
        })
    }

    // CLOSE POPUP
    const closePopup = () => {
        setState({ ...state, isActive: false })
    }

    // CLOSE PLAY SONG
    const closePlay = () => {
        setPlaying(false);
        setPlay({ mp3: '', song_name: '', singer_name: '', favorite: false });
    }

    // ADD FAVORITE SONG
    const addFavoriteSong = () => {
        axios.get(`${LINK_API}/api/song/favorite/${state.song.song_id}`)
            .then(result => {
                getAllSong();
                setState({ ...state, isActive: false });
            })
            .catch(err => console.log(err));
    }

    // CONVERT UTF-8 TO UNICODE
    function convertVN(str) {
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g,"a"); 
        str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g,"e"); 
        str = str.replace(/??|??|???|???|??/g,"i"); 
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g,"o"); 
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g,"u"); 
        str = str.replace(/???|??|???|???|???/g,"y"); 
        str = str.replace(/??/g,"d");
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "A");
        str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "E");
        str = str.replace(/??|??|???|???|??/g, "I");
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "O");
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "U");
        str = str.replace(/???|??|???|???|???/g, "Y");
        str = str.replace(/??/g, "D");
    
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
        str = str.replace(/\u02C6|\u0306|\u031B/g, "");
        str = str.replace(/ + /g," ");
        str = str.trim();
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        return str;
    }

    //SEARCH
    const searchSong = (event) => {
        const list = listSong.filter(item => {
            return convertVN(item.song_name.toLowerCase()).indexOf(convertVN(event.target.value.toLowerCase())) > -1;
        });
        setListSearch(list);
        if(list.length > 0 && event.target.value !== '') {
            setState({ ...state, page: 1 });
        }
    }

    return (
        <>
            {state.isActive ? <PlaylistPopup data={{ name: state.song.song_name }} deleteData={addFavoriteSong} closePopup={closePopup} /> : ''}
            <div className={style.song__container}>
                <div className={style.song__title}>
                    <h2>
                        <i className="fa fa-headphones-alt"></i> My Playlist
                    </h2>
                </div>
                <div className={style.search__container}>
                    <input type="text" className={style.search__input} placeholder="Search by song name" onChange={searchSong} />
                </div>
                <table className={style.song__table}>
                    <thead>
                        {stateLoading ? '' :
                            <tr>
                                <th width="20%" onClick={() => setArrange({ ...arrange, value: 'song_name', orderBy: arrange.value !== 'song_name' ? true : !arrange.orderBy })}>Song Name {arrange.value === 'song_name' ? (arrange.orderBy ? <i class="fa fa-angle-up"></i> : <i class="fa fa-angle-down"></i>) : ''}</th>
                                <th width="10%" onClick={() => setArrange({ ...arrange, value: 'release_time', orderBy: arrange.value !== 'release_time' ? true : !arrange.orderBy })}>Release Time {arrange.value === 'release_time' ? (arrange.orderBy ? <i class="fa fa-angle-up"></i> : <i class="fa fa-angle-down"></i>) : ''}</th>
                                <th width="20%" onClick={() => setArrange({ ...arrange, value: 'genre_name', orderBy: arrange.value !== 'genre_name' ? true : !arrange.orderBy })}>Genre {arrange.value === 'genre_name' ? (arrange.orderBy ? <i class="fa fa-angle-up"></i> : <i class="fa fa-angle-down"></i>) : ''}</th>
                                <th width="20%" onClick={() => setArrange({ ...arrange, value: 'musician_name', orderBy: arrange.value !== 'musician_name' ? true : !arrange.orderBy })}>Musician {arrange.value === 'musician_name' ? (arrange.orderBy ? <i class="fa fa-angle-up"></i> : <i class="fa fa-angle-down"></i>) : ''}</th>
                                <th width="20%" onClick={() => setArrange({ ...arrange, value: 'singer_name', orderBy: arrange.value !== 'singer_name' ? true : !arrange.orderBy })}>Singer {arrange.value === 'singer_name' ? (arrange.orderBy ? <i class="fa fa-angle-up"></i> : <i class="fa fa-angle-down"></i>) : ''}</th>
                                <th width="5%"></th>
                                <th width="5%"></th>
                            </tr>}
                    </thead>
                    <tbody>
                        {stateLoading ? <tr><td colSpan="9" style={{ textAlign: 'center' }}><i className="fa fa-spinner"></i> Loading Song...</td></tr> : renderListSong()}
                    </tbody>
                </table>
                {stateLoading || <div className={style.song__page}>{listSong !== '' ? renderPage() : ''}</div>}
                {playing && <Play data={play} close={closePlay} />}
            </div>
        </>
    )
}
