// #region imports
    // #region libraries
    import styled from 'styled-components';
    // #endregion libraries
// #endregion imports



// #region module
export const StyledPopup = styled.div`
    h1 {
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 2rem;
    }

    a {
        color: white;
        text-decoration: none;
    }

    display: grid;
    place-content: center;
    justify-items: center;
    padding: 2rem;
    grid-gap: 1rem;
    line-height: 1.5;
`;


export const inputStyle = {
    width: '250px',
};


export const sliderStyle = {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    margin: '8px 0',
};
// #endregion module
