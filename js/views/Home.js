import React from 'react';

import StreamPlayer from '../components/StreamPlayer';
import './Home.scss';

const TASTY_STREAM_URL = 'https://listen.radiotasty.com/public/radio_tasty/embed?theme=dark';

const HomeView = () => {
  return (
    <div className="home-container">
      <h1>Radio Tasty</h1>
      <div className="stream-player">
        <StreamPlayer streamUrl={TASTY_STREAM_URL} />
      </div>
    </div>
  );
};

export default HomeView;
