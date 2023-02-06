import React, { useEffect, useRef } from 'react';

const StreamPlayer = ({ streamUrl }) => {
  const playerFrame = useRef();

  useEffect(() => {
    if (playerFrame?.current) {
      console.log('Iframe was loaded!');
    }
  }, [playerFrame]);

  return (
    <iframe
      ref={playerFrame}
      src={streamUrl}
      frameBorder={0}
      allowTransparency={true}
      style={{ width: '100%', minHeight: '150px', border: 0 }}
    ></iframe>
  );
};

export default StreamPlayer;
