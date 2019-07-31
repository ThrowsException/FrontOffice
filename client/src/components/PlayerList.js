import React from "react";

const PlayerList = ({ members }) => {
  return (
    <>
      {members.length > 0 ? (
        <ul>
          {members.map(member => (
            <li key={member.email}>
              {member.name} {member.email}
            </li>
          ))}
        </ul>
      ) : (
        <span>No Players Added</span>
      )}
    </>
  );
};

export default PlayerList;
