const Instructions = ({ message, result }) => {  
  const regex = /(.*)\[result](.*)/;
  const found = message.match(regex);
  let before = message, after = "";
  if (found) {
    before = found[1];
    after = found[2];
  } 
  return (
    <span className="instruction">
      {before}
      {found &&
        <span className="result">{result}</span>
      }
      {after}
    </span>
  );
};

export default Instructions;