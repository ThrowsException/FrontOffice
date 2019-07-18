import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import styled from "styled-components";

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
  width: 400px;
  list-style: none;
`;

const Event = styled(motion.div)`
  max-width: 100px;
`;

const EventTitle = styled.h2`
  font-weight: 300;
  text-transform: capitalize;
`;

const EventList = ({ events }) => {
  return (
    <>
      {events.length > 0 ? (
        <Events animate="visible" initial="hidden" variants={list}>
          {events.map((event, i) => (
            <Event
              variants={items}
              key={event.id}
              animate="visible"
              initial="hidden"
            >
              <EventTitle>{event.name}</EventTitle>
              {event.date}
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
  events: PropTypes.array
};

EventList.defaultProps = {
  events: []
};

export default EventList;
