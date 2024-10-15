import { Alert } from "react-bootstrap";

export default function Banner({ header, message, isError }) {
  return (
    message 
    ? <Alert variant={ isError ? "danger" : "primary" }>
        { header && <><span className="header">{header}</span><br /></> }
        {message} 
      </Alert>
    : "" 
  );
}
