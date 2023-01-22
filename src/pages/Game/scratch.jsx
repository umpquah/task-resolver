/* 

<Stage
name="Setup"
startPhrase="Start"
resultInstruction={
  <ResultInstruction instruction="You must eat [] today." quantity="5 lemons"/>
}
hasTask={true}
endPhrase="Done"
whenDone={handleStageFinish}
/>
<Stage
name="Test"
startPhrase="Roll"
resultInstruction={
  <ResultInstruction instruction="Winner!" />
}
hasTask={false}
endPhrase="Done"
whenDone={handleStageFinish}
/>
<Stage
name="Countdown"
startPhrase="Roll"
resultInstruction={
  <ResultInstruction instruction="Duration is []." quantity="1 minute"/>
}
endPhrase="Continue"
duration={10}
whenDone={handleStageFinish}
/>
*/
