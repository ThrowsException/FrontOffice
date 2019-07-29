import React, { useState, useEffect } from "react";
import wretch from "wretch";
import { TeamForm, TeamList } from "../components";
import { Composition } from "atomic-layout";
import styled from "styled-components";

const areas = `
  header
  content
`;

const NavBar = styled.div`
  display: flex;
  align-items center;
  justify-content: center;
  padding: 0 1em;
  background: #1B1B1E
  color: white;
`;

const NavTitle = styled.h4`
  flex: 1;
`;

const Root = styled.div`
  height: 100vh;
  max-width: 960px;
`;

const StyledButton = styled.button`
  background-color: #58a4b0;
  color: white;
  font-size: 1em;
  padding: 1em;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  :focus {
    outline: 0;
  }
`;

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [formVisible, setFormVisible] = useState(false);

  const postData = async (url, body) => {
    return await wretch(url)
      .post({ ...body })
      .json();
  };

  const fetchData = async (url, callback) => {
    await wretch(url)
      .get()
      .json(json => {
        callback(json);
      })
      .catch(error => console.log(error));
  };

  const onDelete = async id => {
    setTeams(teams.filter(item => item.id != id));
    await wretch(`/api/teams/${id}`).delete();
  };

  useEffect(() => {
    fetchData("/api/teams", setTeams);
  }, []);

  const createTeam = async name => {
    const team = await postData("/api/teams", { name });
    setTeams([...teams, team]);
    setFormVisible(false);
  };

  return (
    <Composition areas={areas}>
      {({ Header, Content }) => (
        <>
          <Header>
            <NavBar>
              <NavTitle>Front Office</NavTitle>
            </NavBar>
          </Header>
          <Content>
            <Root>
              <TeamList items={teams} onDelete={onDelete} />
              <StyledButton onClick={() => setFormVisible(!!!formVisible)}>
                + Add Team
              </StyledButton>
              {formVisible && <TeamForm submit={createTeam} />}
            </Root>
          </Content>
        </>
      )}
    </Composition>
  );
};

export default Teams;
