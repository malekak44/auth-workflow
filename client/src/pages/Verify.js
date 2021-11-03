import React, { useState, useEffect } from 'react';
import axios from 'axios';
import url from '../utils/url';
import styled from 'styled-components';
import { useGlobalContext } from '../context';
import { Link, useLocation } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Verify() {
    const [error, setError] = useState(false);
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
            console.log(data);
        } catch (error) {
            setError(true);
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
            <Wrapper className='page'>
                <h2>Loading...</h2>
            </Wrapper>
        );
    }

    if (error) {
        return (
            <Wrapper className='page'>
                <h4>There was an error, please double check your verification link </h4>
            </Wrapper>
        );
    }

    return (
        <Wrapper className='page'>
            <h2>Account Confirmed</h2>
            <Link to='/login' className='btn'>
                Please login
            </Link>
        </Wrapper>
    )
}

const Wrapper = styled.section``;