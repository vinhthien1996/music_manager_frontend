import React from 'react';
import style from "./DeletePopup.module.css";

export default function DeletePopup(props) {

    const renderDelete = () => {
        if (props.data.isFavorite) {
            return (
                <div className={style.delete__message}>
                    <b>{props.data.name} is in My Playlist. Can't delete!</b>
                    <div className={style.delete__btn}>
                        <button className={style.delete__btn__cancel} onClick={() => props.closePopup()}>Cancel</button>
                    </div>
                </div>
            )
        } else {
            if (props.data.song_num === 0) {
                return (
                    <div className={style.delete__message}>
                        <b>Comfirm Delete {props.data.name}?</b>
                        <div className={style.delete__btn}>
                            {props.data.song_num === 0 ? <button className={style.delete__btn__confirm} onClick={props.deleteData}>Confirm</button> : ''}
                            <button className={style.delete__btn__cancel} onClick={() => props.closePopup()}>Cancel</button>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className={style.delete__message}>
                        <b>{props.data.name} has {props.data.song_num} song. Can't delete!</b>
                        <div className={style.delete__btn}>
                            <button className={style.delete__btn__cancel} onClick={() => props.closePopup()}>Cancel</button>
                        </div>
                    </div>
                )
            }
        }
    }

    return (
        <div className={style.delete__container}>
            <div className={style.delete__content}>
                <div className={style.delete__close}>
                    <i className="fa fa-times" onClick={() => props.closePopup()}></i>
                </div>
                {renderDelete()}
            </div>
        </div>
    )
}
