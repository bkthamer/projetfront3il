import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);


type Event = {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
};

type Props = {
  className: string;
}

const ListsWidget2: React.FC<Props> = ({ className }) => {

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user/agent/match');
        const match = response.data;

        // Adapter la réponse au format des événements attendu par react-big-calendar
        const adaptedEvent: Event[] = [{
          title: `${match.team1.name} vs ${match.team2.name}`,
          start: new Date(match.time),
          end: new Date(new Date(match.time).getTime() + 2 * 60 * 60 * 1000),
          allDay: false,
        }];

        setEvents(adaptedEvent);
      } catch (error) {
        console.error('Erreur lors de la récupération des données du match:', error);
      }
    };

    fetchMatch();
  }, []);

  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <h3 className="card-title">Calendrier des Matchs</h3>
      </div>
      <div className="card-body">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
        />
      </div>
    </div>
  );
}

export { ListsWidget2 };
