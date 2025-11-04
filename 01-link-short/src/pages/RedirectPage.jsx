import { useParams } from "react-router-dom";
import UseFetch from "../hooks/UseFetch";
import { getLongUrl } from "../db/Url";
import { useEffect } from "react";
import { storeclicks } from "../db/Clicks";

function RedirectPage() {
    const { id } = useParams();
    const { data, error, loading, fetchData: fetchUrl } = UseFetch(getLongUrl);
    const { fetchData: fetchStats } = UseFetch(storeclicks);

    useEffect(() => {
        if (id) fetchUrl(id);
    }, [id]);

    useEffect(() => {
        if (!loading && data) {
            fetchStats({ id: data.id, original_url: data.original_url });
        }
    }, [loading, data]);

    return (
        <div className="text-white bg-black min-h-screen flex items-center justify-center">
            Redirecting...
        </div>
    );
}

export default RedirectPage;
