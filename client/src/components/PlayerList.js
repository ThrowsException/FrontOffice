import React from "react";

const PlayerList = ({ members }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {members.map(member => (
          <tr key={member.email}>
            <td>{member.name}</td>
            <td>{member.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlayerList;
