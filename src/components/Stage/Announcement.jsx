const Announcement = ({message}) => {  
    return (
      <div className="announcement">
        {message}
      </div>
    );
  };
  
  export default Announcement;
  
  // -  const regex = /(.*)\[result](.*)/;
  // -  const found = message.match(regex);
  // -  let before = message, after = "";
  // -  if (found) {
  // -    before = found[1];
  // -    after = found[2];
  // -  } 
  // -  return (
  // -    <span className="instruction">
  // -      {before}
  // -      {found &&
  // -        <span className="result">{result}</span>
  // -      }
  // -      {after}
  // -    </span>
  // -  );