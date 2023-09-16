import styled from 'styled-components';

const Wrapper = styled.section`
  border-radius: var(--border-radius);
  width: 100%;
  background: var(--background-secondary-color);
  padding: 3rem 2rem 4rem;
  .job-title {
    margin-bottom: 0.6rem;
  }
  .job-name{
    font-weight:bold; 
    text-align:center;
  }
  .job {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-width: 100%;
    width: 100%;
  }
  .job-row {
    margin-bottom: 0;
    padding-bottom:8px;
    box-shadow:2px 2px 10px rgba(0,0,0,0.2); padding:5px;
  }
  .job-center {
    display: grid;
    row-gap: 1rem;
  }
  .job-btn {
    align-self: end;
    margin-top: 1rem;
    display: grid;
    place-items: center;
  }
  @media (min-width: 992px) {
    .job-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;
    }
  }

  }
`;

export default Wrapper;
