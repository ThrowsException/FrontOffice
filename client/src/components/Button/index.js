import styled from "styled-components";

export default styled.button`
  background-color: ${p => (p.variant === "delete" ? "red" : "#58a4b0")};
  color: white;
  font-size: 1em;
  padding: 1em;
  border: 0;

  width: ${p => (p.fullWidth ? "100%" : "")}


  :focus {
    outline: 0;
  }
`;
