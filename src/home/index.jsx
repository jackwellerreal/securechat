import React, { useEffect, useRef, useState } from "react";

import "./styles.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useCollectionData } from "react-firebase-hooks/firestore";
import CryptoJS from "crypto-js";

import { firebaseConfig } from "../../config.js";

firebase.initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
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

    const generateRandomKey = () => {
        return CryptoJS.SHA512(CryptoJS.lib.WordArray.random(32)).toString(CryptoJS.enc.Hex);
    };

    const encryptMessage = (message) => {
        return CryptoJS.AES.encrypt(message, keyValue).toString();
    };

    const decryptMessage = (message) => {
        try {
            return CryptoJS.AES.decrypt(message, keyValue).toString(
                CryptoJS.enc.Utf8
            );
        } catch {
            return null;
        }
    };

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
            localStorage.setItem("author", generateRandomKey());
        }
    }, [lsauthor]);

    useEffect(() => {
        dummy.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
            author: localStorage.getItem("author"),
            content: encryptedMessage,
            createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
            id: generateRandomKey(),
        });
    };

    return (
        <div className="main">
            <header>
                <div>
                    <div>
                        <h1>Secure Chat</h1>
                        <p>Encryption method: AES-256</p>
                    </div>
                    <button
                        className="forget"
                        onClick={() => {
                            localStorage.removeItem("author");
                            localStorage.removeItem("key");
                            window.location.reload();
                        }}
                    >
                        Reset Identity
                    </button>
                </div>
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
                            const key = generateRandomKey();
                            setKeyValue(key);
                            localStorage.setItem("key", key);
                            document.querySelector("input").value = key;
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
    const { decryptMessage, lsauthor } = props;

    const decryptedContent = decryptMessage(content);

    if (!decryptedContent) return null;

    return (
        <div
            className={`message ${
                author === lsauthor ? "self-sender" : "other-sender"
            }`}
        >
            <p className="message-content">{decryptedContent}</p>
        </div>
    );
}
