import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton } from "@mui/material";

const PageFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        pt: 7,
        pb: 3,
        textAlign: "center",
        color: "rgba(255, 255, 255, 0.4)",
        fontSize: "0.85rem",
      }}
    >
      <IconButton
        component="a"
        href="https://instagram.com/RadioTasty"
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        sx={{
          color: "rgba(255, 255, 255, 0.4)",
          "&:hover": { color: "#E1306C" },
        }}
        aria-label="Radio Tasty on Instagram"
      >
        <FontAwesomeIcon icon={faInstagram} /> RadioTasty
      </IconButton>
    </Box>
  );
};

export default PageFooter;
