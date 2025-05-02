import React, { useEffect, useState } from 'react';
import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const GroupList = ({ userId }) => {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    axios.get(API_BASE_URL + '/groups').then(response => setGroups(response.data));
  }, []);
  const joinGroup = groupId => console.log(`Joining group ${groupId}`);
  return (
    <div>
      <h2>Available Groups</h2>
      <ul>
        {groups.map(group => (
          <li key={group._id}>
            {group.name}
            <button onClick={() => joinGroup(group._id)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default GroupList;