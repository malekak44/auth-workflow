import React, { useState } from 'react';
import axios from 'axios';
import url from '../utils/url';
import styled from 'styled-components';
import { useGlobalContext } from '../context';
import useLocalState from '../utils/localState';

export default function Dashboard() {
    const { user } = useGlobalContext();
    const { userId, name, role } = user;
    const [users, setUsers] = useState([]);
    const {
        alert,
        showAlert,
        loading,
        setLoading,
        hideAlert
    } = useLocalState();

    const showAllUsers = async () => {
        hideAlert();
        setLoading(true);
        try {
            const { data } = await axios.get(`${url}/api/v1/user/all`);
            showAlert({
                text: `${data.msg}`,
                type: 'success',
            });
            setUsers(data.users);
            setLoading(false);
            setTimeout(() => {
                hideAlert();
            }, 3000);
        } catch (error) {
            showAlert({ text: error.response.data.msg });
            setLoading(false);
        }
    }

    return (
        <Wrapper className="page">
            <h2>Hello there, {name}</h2>
            <p>
                Your ID : <span>{userId}</span>
            </p>
            <p>
                Your Role : <span>{role}</span>
            </p>
            {user.role === 'admin' && (
                <>
                    <p onClick={showAllUsers}><span className="btn">Get all users</span></p>
                    {alert.show && (
                        <div className={`alert alert-${alert.type}`}>{alert.text}</div>
                    )}
                    {loading ? <div className="loading"></div> : ''}

                    {users && <article id="users">
                        {users.map(user => <div key={user._id} className="user_div">
                            <p>ID: <span>{user._id}</span></p>
                            <p>Name: <span>{user.name}</span></p>
                            <p>Role:  <span>{user.role}</span></p>
                        </div>)}
                    </article>}
                </>
            )}
        </Wrapper>
    )
}

const Wrapper = styled.section`
    p span {
        background: var(--primary-500);
        padding: 0.15rem 0.25rem;
        color: var(--white);
        border-radius: var(--borderRadius);
        letter-spacing: var(--letterSpacing);
    }
    p .btn {
        cursor: pointer;
        padding: 0.15rem 0.5rem;
    }
    .alert,
    .loading {
        margin-bottom: 2rem;
    }
    #users {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        @media only screen and (max-width: 728px) {
           justify-content: center;
        }
    }
    #users .user_div {
        width: 30%;
        border-radius: 5px;
        padding-left: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--primary-500);
        @media only screen and (max-width: 728px) {
           width: 100%;
        }
    }
`;