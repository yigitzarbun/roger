import React from "react";
import styles from "./styles.module.scss";
import MessagesComponent from "../../components/messages/MessagesComponent";

const Messages = () => {
  return (
    <div className={styles["messages-container"]}>
      <MessagesComponent />
    </div>
  );
};
export default Messages;
