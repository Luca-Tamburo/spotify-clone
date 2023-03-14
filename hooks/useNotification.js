//Imports
import { toast } from "react-toastify";

const useNotification = () => {
    const notification = {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: true,
        draggable: false,
        draggableDirection: 'x',
        progress: undefined,
    }

    const notify = {
        error: (error) => {
            toast.error(error, {
                type: toast.TYPE.ERROR,
                position: toast.POSITION.TOP_RIGHT,
                theme: 'colored',
                ...notification,
            });
        },

        success: (response) => {
            toast.success(response, {
                type: toast.TYPE.SUCCESS,
                position: toast.POSITION.TOP_RIGHT,
                theme: 'colored',
                ...notification,
            });
        }
    }

    return notify;
}

export default useNotification;