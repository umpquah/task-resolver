const ResultInstruction = ({ phrase, quantity }) => {  
  return (
    <span className="result">
      {phrase}
      {quantity &&
        <>
          {" "}
          <span className="quantity">{quantity}</span>
          .
        </>
      }
    </span>
  );
};

export default ResultInstruction;