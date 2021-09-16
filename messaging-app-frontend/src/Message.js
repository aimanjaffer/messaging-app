import { Row } from "react-bootstrap";
import ListGroupItem from 'react-bootstrap/ListGroupItem';
function Message(props) {
  let alignment = (props.userId === props.senderId) ? "right" : "left";
    return (
        <Row>
          <ListGroupItem style={{textAlign: alignment}}>{props.messageContent}</ListGroupItem>
        </Row>
    );
  }

export default Message;