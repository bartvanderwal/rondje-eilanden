import React from 'react';

function ParticipantDetails({ participant }) {
  if (!participant) {
    return <div className="participant-details">Selecteer een deelnemer om de details te zien</div>;
  }

  return (
    <div className="participant-details">
      <h2>{participant.name}</h2>
      <p>Woonplaats: {participant.city}</p>
      <p>Resultaten:</p>
      <ul>
        {participant.results.map(result => (
          <li key={result.year}>
            {result.year}: {result.time} ({result.position})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ParticipantDetails;
