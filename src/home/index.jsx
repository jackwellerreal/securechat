import React, { useEffect, useRef, useState } from "react";
import "./styles.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
    apiKey: "AIzaSyCLNd34eS1dNXM09_-TMmqwUkL9qQmltts",
    authDomain: "proxchat-44b31.firebaseapp.com",
    projectId: "proxchat-44b31",
    storageBucket: "proxchat-44b31.appspot.com",
    messagingSenderId: "183492985298",
    appId: "1:183492985298:web:eaa8d2378c02e15a77c80b",
});

const firestore = firebase.firestore();

const randomUsername = () => {
    const firstWords = [
        "Cool",
        "Fast",
        "Smart",
        "Clever",
        "Happy",
        "Lucky",
        "Sunny",
        "Gentle",
        "Brave",
        "Crazy",
    ];
    const secondWords = [
        "Dragon",
        "Tiger",
        "Bear",
        "Wolf",
        "Eagle",
        "Lion",
        "Shark",
        "Snake",
        "Fox",
        "Hawk",
    ];
    const thirdWords = [
        "Master",
        "Warrior",
        "Ninja",
        "Wizard",
        "Joker",
        "Hero",
        "Champion",
        "Legend",
        "Hunter",
        "Samurai",
    ];

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (localStorage.getItem("username")) {
        return localStorage.getItem("username");
    }

    const firstIndex = getRandomInt(0, firstWords.length - 1);
    const secondIndex = getRandomInt(0, secondWords.length - 1);
    const thirdIndex = getRandomInt(0, thirdWords.length - 1);

    const username = `${firstWords[firstIndex]}${secondWords[secondIndex]}${thirdWords[thirdIndex]}`;
    localStorage.setItem("username", username);
    return username;
};

export function Home() {
    const [position, setPosition] = useState({
        latitude: null,
        longitude: null,
    });
    const [username, setUsername] = useState(randomUsername());
    const [formValue, setFormValue] = useState("");

    const dummy = useRef();

    const messageRef = firestore.collection("messages");
    const query = messageRef.orderBy("createdTimestamp").limit(50);
    const [messages] = useCollectionData(query, { idField: "id" });

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setPosition({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            });
        } else {
            console.log("Geolocation is not available in your browser.");
        }

        setUsername(randomUsername());
    }, []);

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

        await messageRef.add({
            author: localStorage.getItem("username"),
            content: message,
            createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
            location: new firebase.firestore.GeoPoint(
                position.latitude,
                position.longitude
            ),
            id: Math.floor(Math.random() * 1000000),
        });
    };

    return (
        <div className="main">
            <header>
                <h1>Showing messages in a 50 meter radius</h1>
                <p>
                    Your current position is:{" "}
                    <strong>
                        <a
                            href={`https://www.google.com/maps?q=${position.latitude},${position.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {position.latitude}, {position.longitude}
                        </a>
                    </strong>
                </p>
                <p>
                    You are known as{" "}
                    <strong className="username">{username}</strong>
                </p>
                <p>If you want to remain anonymous, don't share your name.</p>
            </header>
            <div className="content">
                {messages &&
                    messages.map((msg) => (
                        <MessageLayout key={msg.id} message={msg} />
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

function MessageLayout(props, key) {
    let { content, author } = props.message;

    return (
        <div
            className={`message ${
                author === localStorage.getItem("username")
                    ? "self-sender"
                    : "other-sender"
            }`}
            id={key}
        >
            {author !== localStorage.getItem("username") && (
                <p className="message-sender">{author}</p>
            )}
            <p className="message-content">{content}</p>
        </div>
    );
}
