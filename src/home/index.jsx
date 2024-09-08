import React, { useEffect, useRef, useState } from "react";
import "./styles.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useCollectionData } from "react-firebase-hooks/firestore";
import CryptoJS from "crypto-js";

firebase.initializeApp({
    apiKey: "AIzaSyCLNd34eS1dNXM09_-TMmqwUkL9qQmltts",
    authDomain: "proxchat-44b31.firebaseapp.com",
    projectId: "proxchat-44b31",
    storageBucket: "proxchat-44b31.appspot.com",
    messagingSenderId: "183492985298",
    appId: "1:183492985298:web:eaa8d2378c02e15a77c80b",
});

const firestore = firebase.firestore();

export function Home() {
    const [formValue, setFormValue] = useState("");
    const [keyValue, setKeyValue] = useState("");
    const dummy = useRef();

    const lskey = localStorage.getItem("key");
    const lsauthor = localStorage.getItem("author");

    const messageRef = firestore.collection("messages");
    const query = messageRef.orderBy("createdTimestamp");
    const [messages] = useCollectionData(query, { idField: "id" });

    useEffect(() => {
        if (lskey) {
            setKeyValue(lskey);
            document.querySelector("input").value = lskey;
        } else {
            setKeyValue("");
        }
    }, [lskey]);

    useEffect(() => {
        if (!lsauthor) {
            localStorage.setItem("author", Math.floor(Math.random() * 1000000));
        }
    }, [lsauthor]);

    useEffect(() => {
        dummy.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const encryptMessage = (message) => {
        return CryptoJS.AES.encrypt(message, keyValue).toString();
    };

    const decryptMessage = (cipherText, key) => {
        const bytes = CryptoJS.AES.decrypt(cipherText, keyValue);
        return bytes.toString(CryptoJS.enc.Utf8);
    };

    const createMessage = async (e) => {
        e.preventDefault();
        let message = formValue;
        setFormValue("");

        if (message.length > 50) {
            message = message.substring(0, 50);
        } else if (message.length === 0) {
            return;
        }

        const encryptedMessage = encryptMessage(message);

        await messageRef.add({
            author: parseInt(localStorage.getItem("author")),
            content: encryptedMessage,
            createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
            id: Math.floor(Math.random() * 1000000),
        });
    };

    return (
        <div className="main">
            <header>
                <h1>Secure Chat</h1>
                <p>Encryption method: AES-256</p>
                <div>
                    <input
                        type="password"
                        placeholder="Enter your shared key"
                        onChange={(e) => {
                            setKeyValue(e.target.value);
                            localStorage.setItem("key", e.target.value);
                        }}
                        maxLength={64}
                    />
                    <button
                        onClick={() => {
                            if (
                                document.querySelector("input").type === "text"
                            ) {
                                document.querySelector("input").type =
                                    "password";
                            } else {
                                document.querySelector("input").type = "text";
                            }
                        }}
                    >
                        👁️
                    </button>
                    <button
                        onClick={() => {
                            let key = CryptoJS.lib.WordArray.random(
                                32
                            ).toString(CryptoJS.enc.Hex);
                            setKeyValue(key);
                            localStorage.setItem("key", key);
                            document.querySelector("input").value = key;
                            console.log(key);
                        }}
                    >
                        Generate Key
                    </button>
                </div>
            </header>
            <div className="content">
                {messages &&
                    messages.map((msg) => (
                        <MessageLayout
                            message={msg}
                            decryptMessage={decryptMessage}
                            lsauthor={lsauthor}
                            key={msg.id}
                        />
                    ))}

                <div ref={dummy}></div>
            </div>
            <form className="message-form" onSubmit={createMessage}>
                <input
                    type="text"
                    placeholder="Type a message"
                    value={formValue}
                    maxLength="100"
                    onChange={(e) => setFormValue(e.target.value)}
                />
            </form>
        </div>
    );
}

function MessageLayout(props) {
    let { content, author } = props.message;
    const { decryptMessage, lsauthor, key } = props;

    const decryptedContent = decryptMessage(content);

    if (!decryptedContent) return null;

    return (
        <div
            className={`message ${
                author === parseInt(lsauthor) ? "self-sender" : "other-sender"
            }`}
            id={key}
        >
            <p className="message-content">{decryptedContent}</p>
        </div>
    );
}
