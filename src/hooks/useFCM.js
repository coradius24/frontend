import { useEffect, useState } from "react";
import useFCMToken from "./useFCMToken";
import { MessagePayload, onMessage } from "firebase/messaging";
import { messaging } from "@/utils/firebase";

const useFCM = () => {
  const fcmToken = useFCMToken();
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const fcmmessaging = messaging();
      const unsubscribe = onMessage(fcmmessaging, (payload) => {
        // toast.dark(payload.notification?.title);
        console.log(payload.notification?.title)
        setMessages((messages) => [...messages, payload]);
      });
      return () => unsubscribe();
    }
  }, [fcmToken]);
  return { fcmToken, messages };
};

export default useFCM;