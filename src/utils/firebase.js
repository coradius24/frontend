"use client";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDxLydBF6YmY_2HDMqbLlRQ90a9Lx6Di-8",
  authDomain: "upspot-mvp-pwa.firebaseapp.com",
  projectId: "upspot-mvp-pwa",
  storageBucket: "upspot-mvp-pwa.appspot.com",
  messagingSenderId: "1082836086330",
  appId: "1:1082836086330:web:b9b2ae3e9acfa7f603cf03"
};


const firebaseapp = initializeApp(firebaseConfig);

export const messaging = () => getMessaging(firebaseapp);

export default firebaseapp;