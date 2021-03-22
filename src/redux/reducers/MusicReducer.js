const stateDefault = {
    message: ''
}

export const MusicReducer = (state = stateDefault, action) => {

    switch (action.type) {
        case 'ADD_MESSAGE': {
            return { ...state, message: action.content }
        }
        default: {
            return { ...state };
        }
    }
}