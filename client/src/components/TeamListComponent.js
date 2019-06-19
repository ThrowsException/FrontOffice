import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography } from "@material-ui/core";

const TeamListComponent = ({ items }) => {
  return (
    <List dense={true} disablePadding={true}>
      {items.map(({ id, name }) => (
        <ListItem key={id}>
          <ListItemText
            primary={name}
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  Id: {id}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TeamListComponent;
