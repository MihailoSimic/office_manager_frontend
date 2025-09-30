// src/styles/globalStyles.js

const globalStyles = {
  container: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  minHeight: "100vh",
  width: "100%",
  background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
  fontFamily: "Arial, sans-serif",
  padding: "20px",
  boxSizing: "border-box",
  },
  content: {
    textAlign: "center",
    width: "100%",
  },
  title: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    fontSize: "clamp(1rem, 3vw, 1.3rem)",
    marginBottom: "30px",
    color: "#444",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  button: {
    padding: "12px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
    transition: "0.3s",
    fontSize: "1rem",
    minWidth: "120px",
    textAlign: "center",
  }
};

export default globalStyles;