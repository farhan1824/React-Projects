import React from 'react'
import { useState } from 'react'

export default function UseFetch(callback) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async (...args) => {
        setLoading(true);
        try {
            const result = await callback(...args);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err);
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, fetchData };
}


// export default UseFetch