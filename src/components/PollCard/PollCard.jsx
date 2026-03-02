import React, { useState, useEffect } from 'react';
import { 
  FiThumbsUp, 
  FiThumbsDown, 
  FiBarChart2, 
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiAward,
  FiTrendingUp
} from 'react-icons/fi';
import './PollCard.css';

const PollCard = () => {
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [votedPolls, setVotedPolls] = useState({});
  const [showResults, setShowResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | active | voted
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    // Test ma'lumotlari (keyinchalik API dan olish mumkin)
    const pollsData = [
      {
        id: 1,
        question: "5 + 3 = 8 ?",
        category: "matematik",
        difficulty: "oson",
        type: "math",
        yesCount: 245,
        noCount: 12,
        totalVotes: 257,
        timeLeft: "2 soat",
        author: "MathMaster",
        isVerified: true,
        trend: "up",
        icon: "🧮"
      },
      {
        id: 2,
        question: "Dunyodagi eng katta okean Tinch okeanimi?",
        category: "geografiya",
        difficulty: "oson",
        type: "geography",
        yesCount: 189,
        noCount: 23,
        totalVotes: 212,
        timeLeft: "5 soat",
        author: "GeoExpert",
        isVerified: true,
        trend: "stable",
        icon: "🌊"
      },
      {
        id: 11,
        question: "Pingvinlar uch olaydimi?",
        category: "hayvonot",
        difficulty: "qiziqarli",
        type: "fun",
        yesCount: 89,
        noCount: 134,
        totalVotes: 223,
        timeLeft: "12 soat",
        author: "AnimalLover",
        isVerified: false,
        trend: "down",
        icon: "🐧"
      },
      // ... qolgan savollar shu yerga qo'shiladi (30 ta)
      // hozircha test uchun 3 ta qoldirdim, xohlasangiz hammasini qayta joylashtiraman
    ];

    setPolls(pollsData);

    const total = pollsData.reduce((acc, poll) => acc + poll.totalVotes, 0);
    setTotalVotes(total);

    setLoading(false);
  }, []);

  const handleVote = (pollId, voteType) => {
    if (votedPolls[pollId]) return;

    setPolls(prevPolls =>
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          const updated = { ...poll };
          if (voteType === 'yes') updated.yesCount += 1;
          else updated.noCount += 1;
          updated.totalVotes += 1;
          return updated;
        }
        return poll;
      })
    );

    setVotedPolls(prev => ({ ...prev, [pollId]: voteType }));
    setTotalVotes(prev => prev + 1);
  };

  const toggleResults = (pollId) => {
    setShowResults(prev => ({ ...prev, [pollId]: !prev[pollId] }));
  };

  const getPercentage = (count, total) => {
    if (total === 0) return 0;
    return ((count / total) * 100).toFixed(1);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'oson':       return '#4caf50';
      case 'o\'rta':     return '#ff9800';
      case 'qiyin':      return '#f44336';
      case 'qiziqarli':  return '#9c27b0';
      default:           return '#888';
    }
  };

  const getFilteredPolls = () => {
    if (filter === 'active') {
      return polls.filter(p => parseInt(p.timeLeft) <= 3);
    }
    if (filter === 'voted') {
      return polls.filter(p => votedPolls[p.id]);
    }
    return polls;
  };

  const getTrendIcon = (trend) => {
    const className = trend === 'up' ? 'trend-up' 
                     : trend === 'down' ? 'trend-down' 
                     : 'trend-stable';
    return <FiTrendingUp className={className} />;
  };

  if (loading) {
    return (
      <div className="poll-loading">
        <div className="loading-spinner"></div>
        <p>Savollar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="poll-container">
      {/* Header */}
      <div className="poll-header">
        <div className="poll-title-section">
          <h2>
            <FiBarChart2 className="title-icon" />
            So'rovnomalar
          </h2>
          <div className="poll-stats">
            <span className="stat-badge">
              <FiUsers /> {polls.length} ta savol
            </span>
            <span className="stat-badge">
              <FiAward /> Jami {totalVotes.toLocaleString()} ovoz
            </span>
          </div>
        </div>

        <div className="poll-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Barchasi
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Faol
          </button>
          <button 
            className={`filter-btn ${filter === 'voted' ? 'active' : ''}`}
            onClick={() => setFilter('voted')}
          >
            Ovoz berganlarim
          </button>
        </div>
      </div>

      {/* Polls Grid */}
      <div className="polls-grid">
        {getFilteredPolls().map(poll => (
          <div 
            key={poll.id}
            className={`poll-card ${votedPolls[poll.id] ? 'voted' : ''}`}
            onClick={() => setSelectedPoll(selectedPoll === poll.id ? null : poll.id)}
          >
            <div className="poll-card-header">
              <span className="poll-icon">{poll.icon}</span>
              <div className="poll-meta">
                <span 
                  className="poll-category"
                  style={{ background: getDifficultyColor(poll.difficulty) }}
                >
                  {poll.category}
                </span>
                <span 
                  className="poll-difficulty"
                  style={{ color: getDifficultyColor(poll.difficulty) }}
                >
                  {poll.difficulty}
                </span>
              </div>
              {poll.isVerified && <FiCheckCircle className="verified-icon" />}
            </div>

            <div className="poll-question">
              <h3>{poll.question}</h3>
            </div>

            <div className="poll-info">
              <span className="poll-author">
                <FiUsers /> {poll.author}
              </span>
              <span className="poll-time">
                <FiClock /> {poll.timeLeft}
              </span>
              {getTrendIcon(poll.trend)}
            </div>

            {!votedPolls[poll.id] ? (
              <div className="poll-voting">
                <button 
                  className="vote-btn yes"
                  onClick={e => { e.stopPropagation(); handleVote(poll.id, 'yes'); }}
                >
                  <FiThumbsUp /> Ha
                </button>
                <button 
                  className="vote-btn no"
                  onClick={e => { e.stopPropagation(); handleVote(poll.id, 'no'); }}
                >
                  <FiThumbsDown /> Yo'q
                </button>
              </div>
            ) : (
              <div className="vote-confirmed">
                <FiCheckCircle className="confirmed-icon" />
                <span>
                  {votedPolls[poll.id] === 'yes' ? 'Ha' : 'Yo\'q'} deb ovoz berdingiz
                </span>
              </div>
            )}

            <button 
              className="results-toggle"
              onClick={e => { 
                e.stopPropagation(); 
                toggleResults(poll.id); 
              }}
            >
              <FiBarChart2 /> 
              {showResults[poll.id] ? 'Natijalarni yashirish' : 'Natijalarni ko‘rish'}
            </button>

            {showResults[poll.id] && (
              <div className="poll-results">
                <div className="result-bar">
                  <div className="result-label">
                    <FiThumbsUp /> Ha — {poll.yesCount} ({getPercentage(poll.yesCount, poll.totalVotes)}%)
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill yes"
                      style={{ width: `${getPercentage(poll.yesCount, poll.totalVotes)}%` }}
                    />
                  </div>
                </div>

                <div className="result-bar">
                  <div className="result-label">
                    <FiThumbsDown /> Yo'q — {poll.noCount} ({getPercentage(poll.noCount, poll.totalVotes)}%)
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill no"
                      style={{ width: `${getPercentage(poll.noCount, poll.totalVotes)}%` }}
                    />
                  </div>
                </div>

                <div className="total-votes">
                  <FiUsers /> Jami: {poll.totalVotes} ovoz
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal (katta ko'rinish) */}
      {selectedPoll && (
        <div className="poll-modal" onClick={() => setSelectedPoll(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPoll(null)}>×</button>
            
            {polls
              .filter(p => p.id === selectedPoll)
              .map(poll => (
                <div key={poll.id} className="modal-poll-detail">
                  <div className="modal-header">
                    <span className="modal-icon">{poll.icon}</span>
                    <h2>{poll.question}</h2>
                  </div>

                  <div className="modal-stats">
                    <div><FiUsers /> {poll.author}</div>
                    <div><FiClock /> {poll.timeLeft} qoldi</div>
                    <div style={{ color: getDifficultyColor(poll.difficulty) }}>
                      {poll.difficulty.toUpperCase()}
                    </div>
                  </div>

                  <div className="modal-results-detailed">
                    <h3>Natijalar</h3>
                    <div className="result-bar large">
                      <div>Ha: {poll.yesCount} ({getPercentage(poll.yesCount, poll.totalVotes)}%)</div>
                      <div className="progress-bar">
                        <div className="progress-fill yes" style={{width: `${getPercentage(poll.yesCount, poll.totalVotes)}%`}} />
                      </div>
                    </div>
                    <div className="result-bar large">
                      <div>Yo'q: {poll.noCount} ({getPercentage(poll.noCount, poll.totalVotes)}%)</div>
                      <div className="progress-bar">
                        <div className="progress-fill no" style={{width: `${getPercentage(poll.noCount, poll.totalVotes)}%`}} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PollCard;