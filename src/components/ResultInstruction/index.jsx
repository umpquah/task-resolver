const ResultInstruction = ({ instruction, quantity }) => {  
  const regex = /(.*)\[](.*)/;
  const found = instruction.match(regex);
  let before = instruction, amount = "", after = "";
  if (found) {
    before = found[1];
    amount = quantity;
    after = found[2];
  } 
  return (
    <span className="result">
      {before}
      {quantity &&
        <span className="quantity">{amount}</span>
      }
      {after}
    </span>
  );
};

export default ResultInstruction;