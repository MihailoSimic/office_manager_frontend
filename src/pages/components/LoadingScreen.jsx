import React from "react";
import { Spinner } from "reactstrap";
import globalStyles from "../../styles/GlobalStyles";

const LoadingScreen = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={globalStyles.container}
    >
      <Spinner color="primary" style={{ width: 80, height: 80, borderWidth: 8 }} />
    </div>
  );
};

export default LoadingScreen;
