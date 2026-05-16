import { useToastStore } from "../../store/useToastStore";
import { useEffect } from "react";

export default function ToastContainer() {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} removeToast={removeToast} />
            ))}
        </div>
    );
}

function Toast({ id, message, type = "error", removeToast }) {

    useEffect(() => {
        const timer = setTimeout(() => removeToast(id), 3000);
        return () => clearTimeout(timer);
    }, [id, removeToast]);

    const styles = {
        error: "bg-red-500 text-white",
        success: "bg-green-500 text-white",
        info: "bg-blue-500 text-white"
    };

    return (
        <div
            className={`px-4 py-2 rounded shadow-lg animate-slideIn ${styles[type]}`}
        >
            {message}
            <button className="ps-2 cursor-pointer" onClick={() => removeToast(id)}>✕</button>
        </div>
    );
}