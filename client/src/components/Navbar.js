import React from 'react';
import logo from '../assets/logo.svg';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context';

export default function Navbar() {
    const { user, logoutUser } = useGlobalContext();

    return (
        <Wrapper>
            <div className="nav-center">
                <Link to="/" className="home-link">
                    <img src={logo} alt="logo" className="logo" />
                </Link>
            </div>
            {user && (<div className="nav-links">
                <p>Hello, {user.name.split(' ')[0]}</p>
                <button className="btn btn-small"
                    onClick={() => logoutUser()}>
                    logout
                </button>
            </div>)}
        </Wrapper>
    )
}

const Wrapper = styled.nav`
    height: 6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--white);
    .nav-center{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: var(--fluid-width);
        max-width: var(--max-width);
        justify-content: space-between;
    }
    .nav-links{
        display: flex;
        flex-direction: column;
    }
    .nav-links p{
        margin: 0;
        margin-bottom: 0.25rem;
        text-transform: capitalize;
    }
    .home-link{
        display: flex;
        align-items: flex-end;
    }
    @media (min-width: 776px) {
        .nav-links {
          flex-direction: row;
          align-items: center;
        }
        .nav-links p {
          margin: 0;
          margin-right: 1.5rem;
        }
    }
`;