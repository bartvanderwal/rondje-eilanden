import React, { useState } from 'react';
import participantsData from '../data/participants.json';
import ParticipantDetails from './ParticipantDetails';
function ParticipantList() {
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  return (
    <div className="participant-list">
      <h2>Deelnemers</h2>
      <ul>
        {participantsData.map(participant => (
          <li key={participant.id} onClick={() => setSelectedParticipant(participant)}>
            {participant.name}
          </li>
        ))}
      </ul>
      <ParticipantDetails participant={selectedParticipant} />
    </div>
  );
}
export default ParticipantList;
