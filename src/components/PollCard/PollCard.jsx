import React, { useState } from "react";
import './PollCard.css';

const PollCard = ({ question }) => {
  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [voted, setVoted] = useState(false);

  const totalVotes = yesCount + noCount;
  const yesPercent = totalVotes > 0 ? Math.round((yesCount / totalVotes) * 100) : 0;
  const noPercent = totalVotes > 0 ? Math.round((noCount / totalVotes) * 100) : 0;

  const handleYes = () => {
    if (!voted) {
      setYesCount(yesCount + 1);
      setVoted(true);
    }
  };

  const handleNo = () => {
    if (!voted) {
      setNoCount(noCount + 1);
      setVoted(true);
    }
  };

  return (
    <div className="poll-card">
      <h3 className="question">{question}</h3>

      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-yes" 
            style={{ width: `${yesPercent}%` }}
          >
            {yesPercent > 0 && <span>{yesPercent}%</span>}
          </div>
          <div 
            className="progress-no" 
            style={{ width: `${noPercent}%` }}
          >
            {noPercent > 0 && <span>{noPercent}%</span>}
          </div>
        </div>
      </div>

      <div className="buttons">
        <button 
          className="btn-yes" 
          onClick={handleYes}
          disabled={voted}
        >
          Ha {yesCount > 0 && `(${yesCount})`}
        </button>
        <button 
          className="btn-no" 
          onClick={handleNo}
          disabled={voted}
        >
          Yo'q {noCount > 0 && `(${noCount})`}
        </button>
      </div>

      <div className="votes">
        <span>👥 Jami: {totalVotes}</span>
        {voted && <span className="voted">Siz ovoz bergansiz</span>}
      </div>
    </div>
  );
};

export default PollCard;