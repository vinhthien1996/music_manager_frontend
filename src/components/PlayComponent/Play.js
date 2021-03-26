import React, { useState, useRef, useEffect } from 'react';
import style from "./Play.module.css";
import TimeSlider from 'react-input-slider';
import { LINK_MP3 } from "../../const";

export default function Play(props) {

    const audioRef = useRef();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlay, setPlay] = useState(true);
    const [timeDuration, setTimeDuration] = useState(0);
    const [timeCurrent, setTimeCurrent] = useState('00:00');

    const handleLoadedData = () => {
        setCurrentTime(0);
        setDuration(audioRef.current.duration);
        setTimeDuration(convertTime(audioRef.current.duration));
        if (isPlay) audioRef.current.play();
    };

    const convertTime = (time) => {
        const min = Math.floor((time % 3600) / 60);
        const sec = Math.floor(time % 60);
        return (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
    }

    const handlePausePlayClick = () => {
        if (isPlay) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlay(!isPlay);
    };

    const handleTimeSliderChange = ({ x }) => {
        audioRef.current.currentTime = x;
        setCurrentTime(x);
        setTimeCurrent(convertTime(x));

        if (!isPlay) {
            setPlay(true);
            audioRef.current.play();
        }
    };

    useEffect(() => {
    }, [])

    return (
        <div className={style.play__container}>
            <div className={style.play__ticket}>
                <img src="/images/play-music.png" alt="Logo" />
            </div>
            <div className={style.play__content}>
                <div className={style.play__control} onClick={handlePausePlayClick}>
                    {isPlay ? <i class="fa fa-pause-circle"></i> : <i className="fa fa-play-circle"></i>}
                </div>
                <div className={style.play__time}>
                    <div className={style.play__time__item}>
                        {timeCurrent}
                    </div>
                    <TimeSlider
                        axis="x"
                        xmax={duration}
                        x={currentTime}
                        styles={{
                            track: {
                                backgroundColor: "rgba(255, 255, 255, 0.3)",
                                height: "6px",
                            },
                            active: {
                                backgroundColor: "#F15A35",
                                height: "6px",
                            },
                            thumb: {
                                width: "12px",
                                height: "12px",
                                backgroundColor: "#fff",
                                borderRadius: 6,
                            },
                        }}
                        onChange={handleTimeSliderChange}
                    />
                    <div className={style.play__time__item}>
                        {timeDuration}
                    </div>
                    <audio
                        ref={audioRef}
                        src={LINK_MP3 + props.data.url}
                        onLoadedData={handleLoadedData}
                        onTimeUpdate={() => {
                            setCurrentTime(audioRef.current.currentTime)
                            setTimeCurrent(convertTime(audioRef.current.currentTime));
                        }}
                        onEnded={() => setPlay(false)}
                    />
                </div>
                <div className={style.play__info}>
                    <div className={style.play__info__title}>
                        <i className="fab fa-itunes-note"></i> {props.data.song_name}
                    </div>
                    <div className={style.play__info__singer}><i class="fa fa-microphone-alt"></i> {props.data.singer_name}</div>
                </div>
                <div className={style.play__label}>
                    <i className="fa fa-heart" style={{ color: props.data.favorite ? '#f75252' : '#fff' }}></i>
                    <i className="fa fa-times" onClick={() => props.close()}></i>
                </div>
            </div>
        </div>
    )
}
