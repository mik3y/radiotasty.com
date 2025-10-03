import { Link } from "@tanstack/react-router";
import "./About.scss";

const AboutView = () => {
  return (
    <div className="about-container">
      <h1>About Radio Tasty</h1>
      <p>Welcome to Radio Tasty - your source for the tastiest tunes!</p>
      <p>This is a placeholder about page. More content coming soon...</p>
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>
    </div>
  );
};

export default AboutView;
