"use client";
import { useEffect, useState } from "react";
import { getToken, isSupported } from "firebase/messaging";
import useNotificationPermission from "./useNotificationPermission";
import { messaging } from "@/utils/firebase";
import notificationService from "@/services/notificationService";
import { getDeviceName } from "@/utils/utils";

const useFCMToken = () => {
  const permission = useNotificationPermission();
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const retrieveToken = async () => {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        if (permission === "granted") {
          const isFCMSupported = await isSupported();
          if (!isFCMSupported) return;
          const fcmToken = await getToken(messaging(), {
            vapidKey: 'BJ9KDN6Qmbz4MPlM657NMfvWlEKhU7zYkmP2jQm0hk73dM59oSwf3qGrLoEQxe1lQC9OGqdDjuE7oiRSAZ89R0Q',
          });
          if(fcmToken) {
            notificationService.pushTokenSync({
                token: fcmToken,
                device: getDeviceName()
            })
            // backend sync
          }
          setFcmToken(fcmToken);
        }
      }
    };
    retrieveToken();
  }, [permission]);

  return fcmToken;
};

export default useFCMToken;