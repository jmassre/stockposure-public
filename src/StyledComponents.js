import styled from 'styled-components'

const PageColor = styled.div`
color: white !important;
`;
const TopFlex = styled.div`
display: flex;
justify-content: center;
`;
const FlexItem = styled.div`
`;

const Title=styled.h1`
text-align: center;
font-size:55px;
`;

const SubTitle=styled.p`
text-align: center;
margin-top:-20px;
font-size:1rem;
`;
const LastText= styled.div`
margin-right:10px`;
const TotalButton = styled.div`
text-align: center;
margin-top:10%;
`;

const ErrorLabel = styled.div`
color:red;
text-align:center
`;
const ButtonStyle = styled.div`
display: inline;
margin-right:10px;
text-align: center;
`;

export {ButtonStyle,TopFlex,FlexItem,LastText,Title,TotalButton,ErrorLabel, SubTitle,PageColor};