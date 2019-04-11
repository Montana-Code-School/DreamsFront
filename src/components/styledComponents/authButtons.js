import styled from 'styled-components';

export const AuthButtonS = styled.button`
padding: 10px;
z-index: 20;
font-family: serif;
color: white;
font-size: x-large;
font-weight: 900;
border-style: double;
border-color: darkgoldenrod;
text-align: left;
margin-bottom: 2rem;
margin-top: 1.8rem;
position: relative;
background: rgba(255,255,255,0.3);
border-radius: 6px;
&::placeholder{
color: white;
font-weight: 900;
font-size: x-large;
}
&:hover{
transition: 1s ease-in-out;
background-color: turquoise;;
}
`
