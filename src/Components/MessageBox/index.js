import React, { useState, useRef } from "react";
import './style.css';

const MessagesContainer = ({ messages }) => {
    

    return (
        <div className="message-container">
            {messages.map((message,index) => (
                <MessageContent
                    key={index}
                    messageTitle={message.title}
                    messageParagraph={message.paragraph}
                />
            ))}
        </div>
    )
}

const MessageContent = (props) => {
    const [animMessageContent, setAnimMessageContent] = useState('messase-content animIn');
    const cardRef = useRef(null);


    const hideCardTimeout = setTimeout(() => {
        setAnimMessageContent('messase-content animOut');

        setTimeout(() => {
            if (cardRef.current) {
                cardRef.current.remove();
            }
        }, 1000);
    }, 5000);
    const forceHideCard = () => {
        clearTimeout(hideCardTimeout)
        setAnimMessageContent('messase-content animOut');

        setTimeout(() => {
            if (cardRef.current) {
                cardRef.current.remove();
            }
        }, 1000);
    }

    return (
        <div className={animMessageContent} ref={cardRef}>
            <i className="gg-close" onClick={forceHideCard}></i>
            <h3>{props.messageTitle}</h3>
            <p>{props.messageParagraph}</p>
        </div>
    )
}

export default MessagesContainer;