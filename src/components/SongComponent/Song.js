import axios from 'axios';
import React, { useState, useEffect } from 'react';
import style from "./Song.module.css";
import { Link } from "react-router-dom";
import { LIMIT_PAGE, LINK_API } from "../../const";
import DeletePopup from "../DeletePopup/DeletePopup";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Play from '../PlayComponent/Play';

export default function Song(props) {

    const [listSong, setListSong] = useState([]);
    const [stateLoading, setStateLoading] = useState(true);
    const [state, setState] = useState({ song: '', isActive: false, page: 1 });
    const [playing, setPlaying] = useState(false);
    const [play, setPlay] = useState({ mp3: '/mp3/HappyNewYear.mp3', song_name: '', singer_name: '', favorite: false });
    const [listSearch, setListSearch] = useState([]);

    // GET ALL SONG
    const getAllSong = () => {
        axios.get(`${LINK_API}/api/song`)
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

    // RENDER SONG
    const renderListSong = () => {

        let data = listSong;
        if(listSearch.length > 0) {
            data = listSearch;
        }
        const totalPage = Math.ceil(data.length / LIMIT_PAGE);
        if (state.page > totalPage && state.page > 1) {
            setState({ ...state, page: state.page - 1 });
        }
        // const lastPage = (state.page > totalPage ? state.page - 1 : state.page) * LIMIT_PAGE;
        const lastPage = state.page * LIMIT_PAGE;
        const firstPage = lastPage - LIMIT_PAGE;

        return data === '' ? <tr><td colSpan="9">Song is empty.</td></tr> : data.slice(firstPage, lastPage).map((item, index) => {
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
                <td><i className="fa fa-heart" style={{ color: item.favorite ? '#ff2a68' : '#fff' }} onClick={() => addFavoriteSong(item.song_id)}></i></td>
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

    // DELETE SONG
    const deleteSong = () => {
        axios.delete(`${LINK_API}/api/song/${state.song.song_id}`)
            .then(result => {
                setState({ ...state, isActive: false });
            })
            .catch(err => console.log(err));
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
    const addFavoriteSong = (id) => {
        axios.get(`${LINK_API}/api/song/favorite/${id}`)
            .then(result => {
                getAllSong(state.page);
            })
            .catch(err => console.log(err));
    }

    function convertVN(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        str = str.replace(/đ/g,"d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
    
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
        if(list.length > 0 && event.target.value != '') {
            setState({ ...state, page: 1 });
        }
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
                <div className={style.search__container}>
                    <input type="text" className={style.search__input} placeholder="Search by song name" onChange={searchSong} />
                </div>
                <table className={style.song__table}>
                    <thead>
                        {stateLoading ? '' :
                            <tr>
                                <th width="25%">Song Name</th>
                                <th>Release Time</th>
                                <th>Genre</th>
                                <th>Musician</th>
                                <th>Singer</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
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
