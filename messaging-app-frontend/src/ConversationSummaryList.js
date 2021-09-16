import ConversationSummary from "./ConversationSummary";

function ConversationSummaryList(props) {
    let list = props.list;
    //TODO: not all conversationSummaries need to be re-rendered only the one pertaining to the new notification
    return (
        <>
            {list.map((item) => <ConversationSummary key={item._id}
                currentUserId={props.user._id} 
                participants={item.participants}
                lastMessageId={item.lastMessageId}
                conversationId={item.conversationId}
                callbackOnClickConversation={props.callbackOnClickConversation}
                newNotification={props.newNotification}
                newMessage={props.newMessage}
                />)}
        </>
    );
  }

export default ConversationSummaryList;