import { Spinner } from "reactstrap";

const StyledSpinner = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
      <Spinner color="primary" style={{ width: 60, height: 60, borderWidth: 6 }} />
    </div>
  );
};

export default StyledSpinner;