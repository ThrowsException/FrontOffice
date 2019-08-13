import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import styled from "styled-components";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const list = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  hidden: {
    opacity: 0
  }
};

const items = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -100 }
};

const Events = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const Event = styled(motion.div)`
  max-width: 960px;
`;

const EventTitle = styled.span`
  text-transform: capitalize;
  flex: 0.3;
`;

const EventDetails = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 2px;
`;

const gatherStats = event => {
  const checked = event.replies.filter(r => r.reply === true);
  const out = event.replies.filter(r => r.reply === false);
  const waiting = event.replies.filter(r => r.reply === null);
  return `${checked.length} In | ${out.length} Out | ${waiting.length} No Reply`;
};

const EventList = ({ events }) => {
  return (
    <>
      {events.length > 0 ? (
        <Events animate="visible" initial="hidden" variants={list}>
          {events.map(event => (
            <Event key={event.id} variants={items}>
              <EventDetails>
                <EventTitle>
                  <Link to={`/teams/${event.team}/events/${event.id}`}>
                    {event.name}
                  </Link>
                </EventTitle>
                <EventTitle>{format(new Date(event.date), "P p")}</EventTitle>
                <EventTitle>{gatherStats(event)}</EventTitle>
                {/* <Button variant="delete">Delete</Button> */}
              </EventDetails>
            </Event>
          ))}
        </Events>
      ) : (
        <div>No Upcoming Events</div>
      )}
    </>
  );
};

EventList.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      team: PropTypes.number,
      name: PropTypes.string
    })
  )
};

EventList.defaultProps = {
  events: []
};

export default EventList;
