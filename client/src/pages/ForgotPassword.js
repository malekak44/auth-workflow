import React, { useState } from 'react';
import axios from 'axios';
import url from '../utils/url';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import FormRow from '../components/FormRow';
import useLocalState from '../utils/localState';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const {
        alert,
        showAlert,
        hideAlert,
        loading,
        setLoading,
        success,
        setSuccess,
    } = useLocalState();

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        hideAlert();
        if (!email) {
            showAlert({
                text: 'Please provide email'
            });
            setLoading(false);
            return;
        }
        try {
            const { data } = await axios.post(`${url}/api/v1/auth/forgot-password`, {
                email,
            });
            showAlert({ text: data.msg, type: 'success' });
            setSuccess(true);
        } catch (error) {
            showAlert({
                text: 'Something went wrong, please try again',
            });
            setSuccess(true);
        }
        setLoading(false);
    }

    return (
        <Wrapper className="page">
            {alert.show && (
                <div className={`alert alert-${alert.type}`}>{alert.text}</div>
            )}
            {!success && (
                <form className={loading ? 'form form-loading' : 'form'}
                    onSubmit={handleSubmit}
                >
                    <h4>Forgot password</h4>
                    <FormRow
                        type='email'
                        name='email'
                        value={email}
                        handleChange={handleChange}
                    />
                    <button type='submit' className='btn btn-block' disabled={loading}>
                        {loading ? 'Please Wait...' : 'Get Reset Password Link'}
                    </button>
                    <p>
                        Already a have an account?
                        <Link to='/login' className='login-link'>
                            Log In
                        </Link>
                    </p>
                </form>
            )}
        </Wrapper>
    )
}

const Wrapper = styled.main`
    h4,
    p {
    text-align: center;
    }
    p {
    margin: 0;
    margin-top: 1rem;
    }
    .login-link {
    display: inline-block;
    margin-left: 0.25rem;
    text-transform: capitalize;
    color: var(--primary-500);
    cursor: pointer;
    }
`;