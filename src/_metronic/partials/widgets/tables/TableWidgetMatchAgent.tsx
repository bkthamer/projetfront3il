import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Button } from '@mui/material';
import { useAuth } from '../../../../app/modules/auth';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';


const socket = io('http://localhost:3002');
const localizer = momentLocalizer(moment);

type Match = {
  _id: string;
  team1: {
    _id: string;
    name: string;
    logo: string;
  };
  team2: {
    _id: string;
    name: string;
    logo: string;
  };
  division: {
    _id: string;
    name: string;
  };
  time: string;
  scoreTeam1: number;
  scoreTeam2: number;
};

type MatchStatus = 'En cours' | 'Terminé';
type CardCounts = {
  yellow: number;
  red: number;
};

const TableWidgetMatchAgent: React.FC = () => {
  const [match, setMatch] = useState<Match | null>(null);
  const [matchStatus, setMatchStatus] = useState<MatchStatus>('En cours');
  const [cardCounts, setCardCounts] = useState<CardCounts>({ yellow: 0, red: 0 });
  const { auth } = useAuth();

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user/agent/match', {
          headers: {
            Authorization: `Bearer ${auth?.api_token}`,
          },
        });
        if (response.data) {
          setMatch(response.data);
        } else {
          console.error('No match data received');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error fetching match:', error.message);
          if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
          }
        } else {
          console.error('Unexpected error:', error);
        }
      }
    };

    fetchMatch();

    socket.on('scoreUpdated', (updatedMatch) => {
      if (match && updatedMatch._id === match._id) {
        // Adapter la structure des données reçues pour correspondre à celle attendue par le front-end
        const adaptedMatch = {
          _id: updatedMatch._id,
          team1: {
            _id: match.team1._id, 
            name: updatedMatch.team1Name,
            logo: updatedMatch.team1Logo,
          },
          team2: {
            _id: match.team2._id, 
            name: updatedMatch.team2Name,
            logo: updatedMatch.team2Logo,
          },
          division: {
            _id: match.division._id, 
            name: updatedMatch.divisionName,
          },
          time: updatedMatch.time,
          scoreTeam1: updatedMatch.scoreTeam1,
          scoreTeam2: updatedMatch.scoreTeam2,
        };
        setMatch(adaptedMatch);
      }
    });
    

    socket.on('matchStatusUpdated', (statusData: { status: MatchStatus }) => {
      setMatchStatus(statusData.status);
    });

    socket.on('cardStatusUpdated', (cardData: { yellow: number; red: number }) => {
      setCardCounts(cardData);
    });

    return () => {
      socket.off('scoreUpdated');
      socket.off('matchStatusUpdated');
      socket.off('cardStatusUpdated');
    };
  }, [auth?.api_token, match?._id]);

  const handleMatchStatusChange = (newStatus: MatchStatus) => {
    setMatchStatus(newStatus);
    if (match && match._id) {
        socket.emit('matchStatusChanged', { _id: match._id, status: newStatus });
    }
};


  const handleScoreUpdate = (team: 'team1' | 'team2') => {
    if (match) {
      const updatedScore = {
        ...match,
        scoreTeam1: team === 'team1' ? match.scoreTeam1 + 1 : match.scoreTeam1,
        scoreTeam2: team === 'team2' ? match.scoreTeam2 + 1 : match.scoreTeam2,
      };
      socket.emit('updateScore', updatedScore);
    }
  };


  const handleCardUpdate = (cardType: 'yellow' | 'red') => {
    const updatedCards = {
      yellow: cardType === 'yellow' ? cardCounts.yellow + 1 : cardCounts.yellow,
      red: cardType === 'red' ? cardCounts.red + 1 : cardCounts.red,
    };
    setCardCounts(updatedCards);
  
    socket.emit('cardUpdated', { _id: match?._id, ...updatedCards });
  };

  if (!match) {
    return <div>No match found for this agent.</div>;
  }

  const events = [{
    title: `${match.team1.name} vs ${match.team2.name}`,
    start: new Date(match.time),
    end: new Date(match.time), 
    allDay: false,
  }];

  return (
    <div className="card mt-4" style={{
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.25)',
      borderRadius: '10px',
    }}>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col text-center">
            <img src={`http://localhost:3001/${match.team1?.logo}`} alt={match.team1.name} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
            <div className="mt-2"><strong>{match.team1.name}</strong></div>
            <Button onClick={() => handleScoreUpdate('team1')} style={{marginTop: '10px', background: 'green', color: 'white'}}>+1 Team 1</Button>
          </div>
          
          <div className="col text-center">
            <h5 className="card-title">VS</h5>
            <p className="card-text"><small className="text-muted">{match.division.name}</small></p>
            <p className="card-text">{new Date(match.time).toLocaleString()}</p>
            <p style={{fontSize: '20px', fontWeight: 'bold'}}>Score: {match.scoreTeam1} - {match.scoreTeam2}</p>
          </div>
          
          <div className="col text-center">
            <img src={`http://localhost:3001/${match.team2?.logo}`} alt={match.team2.name} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
            <div className="mt-2"><strong>{match.team2.name}</strong></div>
            <Button onClick={() => handleScoreUpdate('team2')} style={{marginTop: '10px', background: 'blue', color: 'white'}}>+1 Team 2</Button>
          </div>
        </div>
        
        <div className="text-center" style={{marginTop: '20px'}}>
          <Button onClick={() => handleMatchStatusChange('En cours')} variant="contained" style={{marginRight: '10px', background: '#007bff', color: 'white'}}>
            Début du Match
          </Button>
          <Button onClick={() => handleMatchStatusChange('Terminé')} variant="contained" style={{marginRight: '10px', background: '#dc3545', color: 'white'}}>
            Fin du Match
          </Button>
          <Button onClick={() => handleCardUpdate('yellow')} variant="outlined" style={{marginRight: '10px', borderColor: '#ffc107', color: '#ffc107'}}>
            +1 Carton Jaune
          </Button>
          <Button onClick={() => handleCardUpdate('red')} variant="outlined" style={{borderColor: '#dc3545', color: '#dc3545'}}>
            +1 Carton Rouge
          </Button>
          
          <p style={{marginTop: '20px'}}>Statut du match : {matchStatus}</p>
          <p>Cartons Rouges : {cardCounts.red}</p>
          <p>Cartons Jaunes : {cardCounts.yellow}</p>
        </div>
      </div>
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
      />
    </div>
    
  );
};

export { TableWidgetMatchAgent };
