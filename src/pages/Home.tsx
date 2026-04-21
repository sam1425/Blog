import React from 'react';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="CardContainer">
        <div className="card cardmax">
          <h2>
            Hey{' '}
            <span
              className="tooltip"
              style={{
                '--tooltip-content': '"a person that visit lots of websites"',
              } as React.CSSProperties}
            >
              surfer
            </span>{' '}
            this is my web
          </h2>
          <p>
            This is a website about you, if you find yourself here you either
            are my friend or you have been searching lots of websites my friend
            so congrats! you are in a very isolated part of the internet
          </p>
        </div>
        <div className="card cardmax">
          <h2>why neocities?</h2>
          <p>
            short answer because it's free long answer because it's free and i
            liked the people and it made me feel part of a community
          </p>
        </div>
        <div className="card cardmax">
          <p>cool stuff:</p>
          <p>
            This will be my little space of the internet or like everyone calls
            it (corner)
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
