import React from "react";
import "./chatbody.css";
import moment from "moment";
import PropTypes from "prop-types";
import { generateItems } from "../../utils/generateItems";

const ChatBody = ({ messages, user, senderId, lastMessageRef }) => {
  const items = generateItems(messages);

  return (
    <div className="msg-container">
      {items.map((item, index) => {
        if (item.type === "day") {
          const today = moment().startOf("day");
          const yesterday = moment().subtract(1, "days").startOf("day");
          let dateLabel;
          const messageDate = moment(item.date);

          if (messageDate.isSame(today, "day")) {
            dateLabel = "Today";
          } else if (messageDate.isSame(yesterday, "day")) {
            dateLabel = "Yesterday";
          } else {
            dateLabel = messageDate.format("MMMM D, YYYY");
          }

          return (
            <div key={item.id} className="date-separator">
              {dateLabel}
            </div>
          );
        }

        return (
          <div
            key={item.id}
            className={`message ${
              item.sender === senderId ? "sent" : "received"
            }`}
            ref={index === items.length - 1 ? lastMessageRef : null}
          >
            <div className="message-content">{item.text}</div>
            <div className="message-timestamp">
              {moment(item.created_at).format("h:mm A")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

ChatBody.propTypes = {
  messages: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  senderId: PropTypes.string.isRequired,
  lastMessageRef: PropTypes.object.isRequired,
};

export default ChatBody;
