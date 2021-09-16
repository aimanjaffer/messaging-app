import { ListGroup } from 'react-bootstrap';
import Message from "./Message";
function MessageList(props) {
    let list = props.messageList;

    return (
        <ListGroup>
            {list.map((item) => <Message key={item._id}
            senderId={item.senderId}
            messageContent={item.messageContent}
            messageTime={item.messageTime}
            isDelivered={item.isDelivered}
            isRead={item.isRead}
            userId={props.userId}
            />)}
        </ListGroup>
    );
  }

export default MessageList;