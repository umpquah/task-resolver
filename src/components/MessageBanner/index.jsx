import { Alert } from "react-bootstrap";

const MessageBanner = ({ message, isError }) => {
  return (
    message 
    ? <Alert variant={ isError ? "danger" : "primary" }>
        {message}
      </Alert>
    : "" 
  );
};

export default MessageBanner;