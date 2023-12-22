import { Alert } from "react-bootstrap";

const MessageBanner = ({ header, message, isError }) => {
  return (
    message 
    ? <Alert variant={ isError ? "danger" : "primary" }>
        { header && <><span className="emphasized">{header}</span><br /></> }
        {message} 
      </Alert>
    : "" 
  );
};

export default MessageBanner;