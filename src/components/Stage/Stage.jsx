import { Button, Container, ProgressBar, Spinner } from "react-bootstrap";
import { StageStatus } from "../../model/stage";
import Banner from "../banner";
import Announcement from "./Announcement";


export default function Stage({
    label,
    status,
    announce,
    action,
    wait,
    whenUserActionDone,
}) {  
  const rolling = status === StageStatus.LOADED;
  const showAnnouncement = !rolling && announce;
  const showAction = !rolling && action;
  const showTimer = status === StageStatus.WAITING;
  const finished = status === StageStatus.FINISHED;
  return (
    <Container className="stage">
      <div className="stage-banner">
        {label}
      </div>
      {rolling && 
        <div className="roll">
          <Spinner animation="border" />
        </div>
      }
      {showAnnouncement && 
        <Announcement message={announce} />
      }
      {showAction && 
        <div className="action">
            {action}
            <br />
          <Button onClick={whenUserActionDone}>
            Done
          </Button>          
        </div>
      } 
      {showTimer &&
        <div>
          {wait && 
            <ProgressBar now={100 * wait.elapsed / wait.duration} />
          }  
        </div>
      }
      {finished &&
        <Banner message={label + " finished"}/>
      }
    </Container>
  );
}