import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent
} from "@material-ui/core";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 320px;
`;

const TeamCard = styled.div`
  background: ${p => (p.row % 2 == 0 ? "#D3D3D3" : "white")};
  display: flex;
  align-items: center;
`;

const TeamName = styled.h3`
  flex: 1;
  margin: 16px;
`;

const TeamList = ({ items, onDelete }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [id, setId] = useState();

  const deleteTeam = async () => {
    await onDelete(id);
    setDialogVisible(false);
  };

  return (
    <Container>
      {items.map((item, i) => (
        <TeamCard key={item.id} row={i}>
          <TeamName>
            <Link to={`/teams/${item.id}`}>{item.name}</Link>
          </TeamName>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              setId(item.id);
              setDialogVisible(true);
            }}
          >
            Delete
          </Button>
        </TeamCard>
      ))}
      <Dialog open={dialogVisible}>
        <DialogContent dividers>
          This action can be be undone and will delete all players and events.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogVisible(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => deleteTeam()} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TeamList;
