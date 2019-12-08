import * as React from 'react'
import { Composition } from 'atomic-layout'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { NavBar, NavTitle, Root, Title, SubTitle } from './styles'

const areas = `
 header
 content
`

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
}

const MotionRoot = motion.custom<{ children: React.ReactNode }>(Root)

const Features = () => (
  <Composition areas={areas}>
    {({ Header, Content }) => (
      <>
        <Header>
          <NavBar>
            <NavTitle>Front Office</NavTitle>
            <Link to="teams">Login</Link>
          </NavBar>
        </Header>
        <Content>
          <header style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                backgroundColor: '#ee9617',
                background: 'linear-gradient(315deg, #ee9617 0%, #fe5858 74%)',
                height: '100%',
                width: '100%',
              }}
            />
            <div
              style={{
                display: 'flex',
                alignContent: 'center',
                justifyItems: 'center',
              }}
            >
              <section
                style={{
                  height: '500px',
                  position: 'relative',
                  flex: 1,
                  display: 'flex',
                  placeContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Title>Front Office</Title>
                <SubTitle>Your GM Dashboard</SubTitle>
                <div style={{ color: '#fff' }}>
                  <p>The easiest way to manage your team.</p>
                </div>
              </section>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  padding: '8px',
                  justifyContent: 'space-between',
                  position: 'relative',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    height: '100%',
                    borderRadius: '20px',
                    background: '#ffffff1a',
                    boxShadow:
                      '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                  }}
                >
                  <MotionRoot
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 2 }}
                  >
                    <div
                      style={{
                        fontSize: '1.25em',
                        display: 'flex',
                        justifyContent: 'center',
                        placeContent: 'center',
                        alignContent: 'center',
                      }}
                    >
                      <ul style={{ listStyle: 'none', flex: 1 }}>
                        <li style={{ margin: '16px 0' }}>
                          Scheduled Game Reminders. Send as many as you like
                        </li>
                        <li style={{ margin: '16px 0' }}>
                          Email and Text Notifications
                        </li>
                        <li style={{ margin: '16px 0' }}>
                          Manage Multiple Teams
                        </li>
                        <li style={{ margin: '16px 0' }}>
                          Receive notifications when players checkout
                        </li>
                      </ul>
                    </div>
                  </MotionRoot>
                </div>
              </div>
            </div>
          </header>
        </Content>
      </>
    )}
  </Composition>
)

export default Features
