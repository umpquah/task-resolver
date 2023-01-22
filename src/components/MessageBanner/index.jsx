import { Alert } from "react-bootstrap";

const MessageBanner = ({ message, isError }) => {
  let header = "", text;
  if (Array.isArray(message)) {
    [header, text] = message;
  } else {
    text = message;
  }

  return (
    message 
    ? <Alert variant={ isError ? "danger" : "primary" }>
        { header && <><span className="emphasized">{message[0]}</span><br /></> }
        {message[1]} 
      </Alert>
    : "" 
  );
};

export default MessageBanner;