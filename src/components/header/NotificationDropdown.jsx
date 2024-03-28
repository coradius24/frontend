"use client";
import liveIcon from "@/assets/img/live.svg";
import useApp from "@/hooks/useApp";
import authService from "@/services/authService";
import notificationService from "@/services/notificationService";
import { checkLang, dateWithTime } from "@/utils/lib";
import { getCookie } from "cookies-next";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiFillBell } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineNotifications } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { Manager } from "socket.io-client";
import "./notification-dropdown.css";
import { sanitizeAndTruncateString } from "@/utils/utils";
let wasSocketEstablished = false;

function NotificationDropdown() {
  const {
    user,
    addOrReplaceLiveClass,
    loadLiveClasses,
    liveClasses,
    ongoingLiveClass,
  } = useApp();
  const containerRef = useRef(null);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [notificationData, setNotificationData] = useState({
    notifications: [],
    total: 0,
    new: 0,
    nextCursor: null,
    isLoading: true,
  });
  const audioPlayer = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isOpen) {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  function playAudio() {
    audioPlayer.current.play();
  }
  const handleExpand = async () => {
    if (!isOpen) {
      notificationService.updateNotificationSeen(notificationData.total).then();
      setNotificationData((prev) => ({
        ...prev,
        new: 0,
        totalSeenCount: prev.total,
      }));
    }
    setIsOpen(!isOpen);
  };

  const loadMoreNotification = async (cursor) => {
    if (!cursor || notificationData.isLoading) return;
    setNotificationData((prev) => ({
      ...prev,
      isLoading: true,
    }));
    const oldNotifications = await notificationService.getPreviousNotifications(
      cursor
    );
    setNotificationData((prev) => ({
      ...prev,
      notifications: [
        ...prev.notifications,
        ...(oldNotifications?.results || []),
      ],
      nextCursor: oldNotifications.nextCursor,
      isLoading: false,
    }));
  };

  const handleSocketConnection = async () => {
    if (wasSocketEstablished) return;
    wasSocketEstablished = true;

    const previousNotifications =
      await notificationService.getPreviousNotifications();
    const newNotificationCount =
      previousNotifications.totalCount - previousNotifications.totalSeenCount;
    setNotificationData({
      notifications: previousNotifications.results,
      total: previousNotifications.totalCount,
      new: newNotificationCount > 0 ? newNotificationCount : 0,
      nextCursor: previousNotifications.nextCursor,
    });

    const manager = new Manager("wss://api.upspotacademy.com", {
      reconnectionDelayMax: 10000,
      // path: "/notifications",
      extraHeaders: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });

    const socket = manager.socket("/notifications", {});

    socket.on("connect", () => {
      socket.on("notification", async (data) => {
        setNotificationData((prev) => ({
          ...prev,
          notifications: [data, ...prev.notifications],
          total: prev.total + 1,
          new: prev.new + 1,
        }));

        if (data.linkOrId === "#accountDisabled") {
          const updateUserData = await authService.getCurrentUser(
            getCookie("access_token")
          );
          if (updateUserData.status === 3) {
            signOut();
          }
        }
        // if (Notification.permission === 'granted') {
        //   // Display push notification on mobile devices
        //   if ('PushManager' in window) {
        //     const registration = await navigator.serviceWorker.getRegistration();
        //     console.log("registration", registration)
        //     if (registration) {
        //       registration.showNotification(data.message, {
        //         body: data.body,
        //         icon: '/icon-192x192.png',
        //       });
        //     }
        //   }
        // } else if (Notification.permission !== 'denied') {
        //   // Request notification permission
        //   const permission = await Notification.requestPermission();
        //   if (permission === 'granted') {
        //     // Display push notification on mobile devices after permission is granted
        //     if ('PushManager' in window) {
        //       const registration = await navigator.serviceWorker.getRegistration();
        //       if (registration) {
        //         registration.showNotification('WebSocket Notification', {
        //           body: data.message,
        //           icon: '/icon.png',
        //         });
        //       }
        //     }
        //   }
        // }
        // console.log({ data , "data");
        playAudio();
      });

      socket.on("liveClassUpdates", (data) => {
        console.log("liveClassUpdates", data)
        if (data.isOnGoing) {
          playAudio();
        }
        addOrReplaceLiveClass(data);
      });
    });
  };

  useEffect(() => {
    loadLiveClasses();
    handleSocketConnection();
    const timer = setTimeout(() => handleSocketConnection(), 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);


  // demo service worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/upsot-service-worker.js', { scope: '/' })
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);



  const handleMessageClick = (linkOrId) => {
    if (!linkOrId) return;
    if (Number(linkOrId)) {
      const page =
        Number.parseInt(
          notificationData?.notifications
            ?.filter((n) => n.notificationType == "notice")
            ?.findIndex((n) => n.linkOrId == linkOrId) / 5
        ) + 1;
      router.push(`/notices/?page=${page}&view=${linkOrId}`);
    } else {
      router.push(linkOrId);
    }
  };

  return (
    <>
      <div className="notification-dropdown" ref={containerRef}>
        <ul className="notification-dropdown-menu">
          <li className="dropdown-user-info">
            <div
              onClick={handleExpand}
              className="flex bag-icon position-relative"
            >
              <span data-tooltip-id="my-tooltip" data-tooltip-place="bottom">
                {" "}
                <MdOutlineNotifications size={26} />
              </span>

              {notificationData.new > 0 && (
                <span className="number cart-count notification__count position-absolute">
                  {notificationData.new}
                </span>
              )}
            </div>
            <div
              style={isOpen ? { display: "block" } : { display: "none" }}
              className={`tooltip-container  `}
            >
              <Tooltip id="my-tooltip" isOpen={isOpen}>
                <div>
                  <div className="expanded-notifications">
                    <div className="title">নোটিফিকেশন</div>
                    <div className="content">
                      {notificationData?.notifications?.map((notification) => (
                        <div
                          className={`flex ${
                            notification?.linkOrId
                              ? "clickable-notification"
                              : ""
                          }`}
                          onClick={() =>
                            handleMessageClick(notification?.linkOrId)
                          }
                          key={notification.id + Math.random()}
                        >
                          <div className="img">
                            {notification.notificationType === "notice" ? (
                              <span>
                                <Image
                                  alt="Notice"
                                  width="20"
                                  height={16}
                                  src={"/megaphone.png"}
                                />
                              </span>
                            ) : (
                              <span>
                                <AiFillBell color="#19891C" size={22} />
                              </span>
                            )}
                          </div>
                          <div className="message">
                            <p
                              className="notification-title"
                              data-lang={checkLang(notification.message)}
                            >
                              {notification.message}
                            </p>
                            {notification.body && (
                              <p className="notification-body">
                                {sanitizeAndTruncateString(notification.body, 150)}
                              </p>
                            )}
                            <span className="date">
                              {dateWithTime(notification.deliveryTime)}
                            </span>
                          </div>
                        </div>
                      ))}
                      {notificationData?.nextCursor && (
                        <div>
                          <button
                            onClick={() =>
                              loadMoreNotification(notificationData?.nextCursor)
                            }
                            className="btn block btn-info"
                          >
                            {notificationData.isLoading
                              ? "Loading..."
                              : "Load more..."}
                          </button>
                        </div>
                      )}
                      {notificationData.isLoading &&
                        notificationData?.notifications?.length === 0 && (
                          <p>লোডিং...</p>
                        )}
                      {!notificationData.isLoading &&
                        notificationData.notifications?.length === 0 && (
                          <div className="no-data">
                            <Image
                              width="100"
                              height="100"
                              src="/no-notification.png"
                              alt="No Notification"
                              style={{
                                margin: '30px auto',
                              }}
                            />

                            <p style={{
                              marginBottom: "30px"
                            }}>কোনো নোটিফিকেশন পাওয়া যায়নি !</p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </Tooltip>
            </div>
          </li>
        </ul>
        <audio
          ref={audioPlayer}
          src={
            "https://uploads.codesandbox.io/uploads/user/7f9e13d2-3bd6-418d-a05e-c989b824b268/PWHR-notification-sound.mp3"
          }
        />
      </div>
      {ongoingLiveClass.isOnGoing && (
        <div className="live-class-alert">
          <Image src={liveIcon} alt="live-class-alert" />
          <div className="cursor-pointer">
            <p>এখন লাইভ ক্লাস চলছে</p>
            <button
              className="btn cursor-pointer"
              onClick={() =>
                window.open(ongoingLiveClass.zoomMeetingLink, "_blank")
              }
            >
              জয়েন করুন <FaArrowRight className="inline" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default NotificationDropdown;