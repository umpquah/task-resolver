import { Alert } from "react-bootstrap";

const MessageBanner = ({ message, isError }) => {

  return (
    message 
    ? <Alert variant={ isError ? "danger" : "primary" }>
        <span className="emphasized">{message[0]}</span><br />
        {message[1]} 
      </Alert>
    : "" 
  );
};

export default MessageBanner;