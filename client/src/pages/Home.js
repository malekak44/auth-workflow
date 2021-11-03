import React from 'react';
import main from '../assets/main.svg';
import styled from 'styled-components';
import { useGlobalContext } from '../context';
import { Link, Redirect } from 'react-router-dom';

export default function Home() {
    const { user } = useGlobalContext();

    return (
        <>
            {user && <Redirect to='/dashboard' />}
            <Wrapper className="page">
                <div className='info'>
                    <h2>
                        <span>Auth</span>
                        Workflow
                    </h2>
                    <p>
                        Authentication is the act of proving an assertion, such as the identity of a computer system user. In contrast with identification, the act of indicating a person or thing's identity, authentication is the process of verifying that identity.
                    </p>
                    <p>
                        User authentication is a process that allows a device to verify the identify of someone who connects to a network resource. There are many technologies currently available to a network administrator to authenticate users.
                    </p>
                    <Link to='/login' className='btn'>
                        Login
                    </Link>
                    <Link to='/register' className='btn'>
                        Register
                    </Link>
                </div>
                <img src={main} alt='main-img' className='img main-img' />
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    display: grid;
    align-items: center;
    h2 {
    font-weight: 700;
    }
    h2 span {
    color: var(--primary-500);
    }
    .main-img {
    display: none;
    }
    @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
    column-gap: 6rem;
    .main-img {
        display: block;
    }
    }
    .btn {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    }
`;