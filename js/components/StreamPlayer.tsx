const StreamPlayer = ({ streamUrl }) => {
  return (
    <iframe
      title="Radio Tasty media player"
      src={streamUrl}
      frameBorder={0}
      allowTransparency={true}
      style={{ width: "100%", minHeight: "150px", border: 0 }}
    />
  );
};

export default StreamPlayer;
