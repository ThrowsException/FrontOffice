import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography } from "@material-ui/core";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const TeamList = ({ items }) => (
  <List dense={true} disablePadding={true}>
    {items.map(({ id, name }) => (
      <ListItem key={id}>
        <ListItemText
          primary={<Link to={`/teams/${id}`}>{name}</Link>}
          secondary={
            <>
              <Typography component="span" variant="body2" color="textPrimary">
                Id: {id}
              </Typography>
            </>
          }
        />
      </ListItem>
    ))}
  </List>
);

export default TeamList;
