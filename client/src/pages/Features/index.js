import React from "react";
import { Composition } from "atomic-layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { NavBar, NavTitle, Root, Title, SubTitle } from "./styles";

const areas = `
 header
 content
 footer
`;

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
};

const MotionRoot = motion.custom(Root);

export default () => (
  <Composition areas={areas}>
    {({ Header, Content }) => (
      <>
        <Header>
          <NavBar>
            <NavTitle>Front Office</NavTitle>
            <Link to="login">Login</Link>
          </NavBar>
        </Header>
        <Content>
          <MotionRoot
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 2 }}
          >
            <Title>Front Office</Title>
            <SubTitle>Your GM Dashboard</SubTitle>
            <div>
              <div
                style={{
                  margin: "8px 0",
                  background: "#0000000a",
                  padding: "8px"
                }}
              >
                <h2>Features</h2>
                <ul>
                  <li>Manage Multiple Teams</li>
                  <li>Completely Email Based</li>
                  <ul>
                    <li>
                      Players only need an email for game reminders and checking
                      in meaning no more forgotten password and apps to install.
                      Simply send an email and get a reply!
                    </li>
                  </ul>
                  <li>
                    Manage notes like who has refreshments, equipment, etc
                  </li>
                </ul>
              </div>
              <div
                style={{
                  margin: "8px 0",
                  background: "#0000000a",
                  padding: "8px"
                }}
              >
                <h2>Coming...</h2>
                <ul>
                  <li>Alerts when players checkout</li>
                  <li>Scheduled Game Reminders</li>
                  <li>Text reminders</li>
                </ul>
              </div>
            </div>
          </MotionRoot>
        </Content>
      </>
    )}
  </Composition>
);
