import React from 'react';
import style from "./DeletePopup.module.css";

export default function PlaylistPopup(props) {

    return (
        <div className={style.delete__container}>
            <div className={style.delete__content}>
                <div className={style.delete__close}>
                    <i className="fa fa-times" onClick={() => props.closePopup()}></i>
                </div>
                <div className={style.delete__message}>
                    <b>Comfirm Remove {props.data.name}?</b>
                    <div className={style.delete__btn}>
                        <button className={style.delete__btn__confirm} onClick={props.deleteData}>Confirm</button>
                        <button className={style.delete__btn__cancel} onClick={() => props.closePopup()}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
