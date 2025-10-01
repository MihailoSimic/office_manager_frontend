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
  tableStyle: {
    borderRadius: 18,
    background: 'linear-gradient(135deg, #e0f7fa 0%, #ede7f6 100%)',
    border: 'none',
    marginBottom: 0,
    boxShadow: '0 8px 32px rgba(108,99,255,0.13)',
    overflow: 'hidden',
  },
  tableHeader: {
    background: 'linear-gradient(135deg, #d1c4e9 60%, #b2dfdb 100%)',
    color: '#333',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 600,
    border: 'none'
  },
  tableCell: {
    background: '#e0f7fa',
    textAlign: 'center',
    verticalAlign: 'middle',
    fontSize: 15,
    border: 'none',
    borderBottom: '1.5px solid #b2dfdb',
    padding: '8px 8px'
  },
  sidebar: {
    width: "20%",
    background: "rgba(0, 0, 0, 0.4)",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    borderRadius: "12px",
    backdropFilter: "blur(10px)"
  },
  content: {
    flex: 1,
    padding: "30px",
    color: "#333",
  }
};

export default globalStyles;