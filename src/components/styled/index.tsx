import styled from 'styled-components';

export const Section = styled.section`
  border: 2px solid #ccc;
  padding: 25px;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  background-color: ${(props) => props.theme === 'dark' ? '#000' : '#fff'};

  & .headerText {
    color: ${(props) => props.theme === 'dark' ? '#fff' : '#000'};
    font-size: 2rem;
  }
`

export const SectionItem = styled.div`
  display: flex;
  gap: 15px;
`;

export const CodeFormatter = styled.pre`
  background: #eeebeb;
  padding: 15px;
  border-radius: 7px;
`;
