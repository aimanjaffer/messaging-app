import Contact from './Contact';
const ContactsList = (props) => {
    //console.log(props.user);
    let contactList = props.user.contacts;
    return (
        <>
        {contactList.map((item) => <Contact key={item} 
        id={item} 
        user={props.user}
        callbackOnClickConversation={props.callbackOnClickConversation}
        reloadConversationSummary={props.reloadConversationSummary}
        convoList={props.convoList}/>)}
        </>
    );
}


export default ContactsList;