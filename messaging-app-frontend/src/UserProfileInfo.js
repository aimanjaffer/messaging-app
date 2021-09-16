import { Card } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
function UserProfileInfo(props) {
    return (
      <Row>
        <Card bg="dark" text="white">
           <Card.Title>{props.conversationName}</Card.Title> 
           <Card.Subtitle>{props.lastSeenTime}</Card.Subtitle>
        </Card>
      </Row>
    );
  }

export default UserProfileInfo;