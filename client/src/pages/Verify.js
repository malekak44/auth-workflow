import React, { useState, useEffect } from 'react';
import axios from 'axios';
import url from '../utils/url';
import { useGlobalContext } from '../context';
import { Link, useLocation } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Verify() {
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const { isLoading } = useGlobalContext();
    const query = useQuery();

    const verifyToken = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(`${url}/api/v1/auth/verify-email`, {
                verificationToken: query.get('token'),
                email: query.get('email'),
            });
            setStatus(data.msg);
        } catch (error) {
            const { msg } = error.response.data;
            setError(msg);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!isLoading) {
            verifyToken();
        }
    }, []);

    if (loading) {
        return (
            <section className='page'>
                <h2>Loading...</h2>
            </section>
        );
    }

    if (error !== '') {
        return (
            <section className='page'>
                <h4>{error}</h4>
            </section>
        );
    }

    return (
        <section className='page'>
            <h2>{status}</h2>
            <Link to='/login' className='btn'>
                Please login
            </Link>
        </section>
    )
}