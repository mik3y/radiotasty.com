import React from 'react';

import Logo from '../../static/img/radio-tasty-logo.png';
import StreamPlayer from '../components/StreamPlayer';
import './Home.scss';

const TASTY_STREAM_URL = 'https://listen.radiotasty.com/public/radio_tasty/embed?theme=dark';

const HomeView = () => {
  return (
    <div className="home-container">
      <img src={Logo} alt="Radio Tasty Logo" />
      <div className="stream-player">
        <StreamPlayer streamUrl={TASTY_STREAM_URL} />
      </div>
    </div>
  );
};

export default HomeView;
