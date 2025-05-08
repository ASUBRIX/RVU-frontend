import TinySlider from '@/components/TinySlider';
import { getAllEvents } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import { Container, Row } from 'react-bootstrap';

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <img src={event.image} className="w-100" alt="Event" />
    </div>
  );
};

const UpcomingEvents = () => {
  const allEvents = useFetchData(getAllEvents);
  
  const eventSliderSettings = {
    items: 3,
    gutter: 20,
    autoplay: false,
    controls: true,
    nav: false,
    mouseDrag: true,
    controlsText: ['<', '>'], // Customizing the controls text
    responsive: {
      1: { items: 1 },
      576: { items: 2 },
      992: { items: 3 }
    }
  };

  return (
    <section className="pt-0">
      <Container>
        <Row className="mb-4">
          <h2 className="mb-0">Upcoming Events</h2>
        </Row>
        <Row>
          <div className="tiny-slider">
            <TinySlider settings={eventSliderSettings}>
              {allEvents?.map((event, idx) => (
                <EventCard key={idx} event={event} />
              ))}
            </TinySlider>
          </div>
        </Row>
      </Container>
    </section>
  );
};

export default UpcomingEvents;