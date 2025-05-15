import Logo from "../../static/img/radio-tasty-logo.png";
import StreamPlayer from "../components/StreamPlayer";
import "./Home.scss";

const TASTY_STREAM_URL =
  "https://listen.radiotasty.com/public/radio_tasty/embed?theme=dark";

const HomeView = () => {
  return (
    <div className="home-container">
      <img src={Logo} alt="Radio Tasty Logo" />
      <div className="stream-player">
        <StreamPlayer streamUrl={TASTY_STREAM_URL} />
      </div>
      <div className="cta-link">
        <a href="https://mailchi.mp/a0216ed0e271/newsletter-signup">
          <span>Be the tastiest: Join our mailing list</span>
          <span className="arrow">→</span>
        </a>
      </div>
    </div>
  );
};

export default HomeView;
