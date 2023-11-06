// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Calendar = () => {
//   const [events, setEvents] = useState([]);
//   const [newEvent, setNewEvent] = useState({ title: '', description: '', start_time: '', end_time: '' });

//   useEffect(() => {
//     // Chargez la liste des événements depuis le backend lors du chargement initial
//     axios.get('http://localhost:3000/events')
//       .then(response => setEvents(response.data));
//   }, []);

//   const handleAddEvent = () => {
//     // Envoyez un nouvel événement au backend et mettez à jour la liste d'événements
//     axios.post('http://localhost:3000/events', newEvent)
//       .then(response => {
//         setEvents([...events, response.data]);
//         setNewEvent({ title: '', description: '', start_time: '', end_time: '' });
//       });
//   };

//   const handleDeleteEvent = (eventId) => {
//     // Supprimez un événement du backend et mettez à jour la liste d'événements
//     axios.delete(`http://localhost:3000/events/${eventId}`)
//       .then(() => {
//         setEvents(events.filter(event => event.id !== eventId));
//       });
//   };
// Définissez la variable eventColors comme une constante
//const eventColors = ['#ff5733', '#33ff57', '#5733ff', '#ff33f4', '#33fff4'];


//   return (
//     <div>
//       <h1>Calendrier</h1>
//       <ul>
//         {events.map(event => (
//           <li key={event.id}>
//             {event.title} - {event.start_time} to {event.end_time}
//             <button onClick={() => handleDeleteEvent(event.id)}>Supprimer</button>
//           </li>
//         ))}
//       </ul>
//       <div>
//         <input
//           type="text"
//           placeholder="Titre"
//           value={newEvent.title}
//           onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Description"
//           value={newEvent.description}
//           onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
//         />
//         <input
//           type="datetime-local"
//           placeholder="Heure de début"
//           value={newEvent.start_time}
//           onChange={e => setNewEvent({ ...newEvent, start_time: e.target.value })}
//         />
//         <input
//           type="datetime-local"
//           placeholder="Heure de fin"
//           value={newEvent.end_time}
//           onChange={e => setNewEvent({ ...newEvent, end_time: e.target.value })}
//         />
//         <button onClick={handleAddEvent}>Ajouter</button>
//       </div>
//     </div>
//   );
// };

// export default Calendar;
//const eventColors = ['#ff5733', '#33ff57', '#5733ff', '#ff33f4', '#33fff4'];
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Calendar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    width: '500px',
    height: '450px',
    margin: 'auto',
    padding: '20px',
    borderRadius: '0',
    backgroundColor: '#fff',
  },
};

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', start_time: '', end_time: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchEventsByDate(currentDate);
  }, [currentDate]);

  const fetchEventsByDate = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    axios.get(`http://localhost:3000/events?date=${formattedDate}`)
      .then(response => setEvents(response.data));
  };

  const handlePreviousDay = () => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(currentDate.getDate() - 1);
    setCurrentDate(previousDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const handleAddEvent = () => {
    axios.post('http://localhost:3000/events', newEvent)
      .then(response => {
        setEvents([...events, response.data]);
        setNewEvent({ title: '', description: '', start_time: '', end_time: '' });
        setIsFormVisible(false);
      });
  };

  const handleDeleteEvent = (eventId) => {
    axios.delete(`http://localhost:3000/events/${eventId}`)
      .then(() => {
        setEvents(events.filter(event => event.id !== eventId));
      });
  };

  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

  const eventColors = ['#ff5733', '#33ff57', '#5733ff', '#ff33f4', '#33fff4'];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="navigation-buttons">
          <button onClick={handlePreviousDay}>Jour précédent</button>
          <button onClick={handleNextDay}>Jour suivant</button>
        </div>
        <h1>{currentDate.toDateString()}</h1>
        <button onClick={() => setIsFormVisible(true)}>Ajouter un événement</button>
      </div>

      <div className="calendar">
        <div className="hours-column">
          {hoursOfDay.map((hour) => (
            <div key={hour} className="hour-item">
              {hour < 10 ? `0${hour}:00` : `${hour}:00`}
            </div>
          ))}
        </div>

        <div className="events-column">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="event-item"
              style={{ backgroundColor: eventColors[index % eventColors.length] }}
            >
              <p>{event.title}</p>
              <p>{event.description}</p>
              <p>{new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}</p>
              <button onClick={() => handleDeleteEvent(event.id)}>Supprimer</button>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isFormVisible}
        onRequestClose={() => setIsFormVisible(false)}
        style={customStyles}
      >
        <div className="add-event-form-rectangular">
          <input
            type="text"
            placeholder="Titre"
            value={newEvent.title}
            onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
            style={{
              border: 'none',
              borderBottom: '1px solid #000',
              width: '100%',
              fontSize: '16px',
              padding: '10px',
              marginBottom: '20px',
            }}
          />
          <div className="date-input">
            <span className="icon">
              <FontAwesomeIcon icon={faCalendar} />
            </span>
            <input
              type="date"
              value={newEvent.start_time.split('T')[0]}
              onChange={e => setNewEvent({ ...newEvent, start_time: `${e.target.value}T${newEvent.start_time.split('T')[1]}` })}
              style={{ marginBottom: '20px' }}
            />
          </div>
          <div className="time-input">
            <span className="icon">
              <FontAwesomeIcon icon={faClock} />
            </span>
            <input
              type="time"
              value={newEvent.start_time.split('T')[1]}
              onChange={e => setNewEvent({ ...newEvent, start_time: `${newEvent.start_time.split('T')[0]}T${e.target.value}` })}
            />
            <span className="icon" style={{ marginLeft: '10px' }}>
              <FontAwesomeIcon icon={faClock} />
            </span>
            <input
              type="time"
              value={newEvent.end_time.split('T')[1]}
              onChange={e => setNewEvent({ ...newEvent, end_time: `${newEvent.end_time.split('T')[0]}T${e.target.value}` })}
              style={{ marginLeft: '10px' }}
            />
          </div>
          <textarea
            placeholder="Description"
            value={newEvent.description}
            onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
            style={{
              border: 'none',
              width: '100%',
              fontSize: '16px',
              padding: '10px',
              height: '100px',
              marginBottom: '20px',
            }}
          ></textarea>
          <button className="add-button" onClick={handleAddEvent}>
            Ajouter
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;

