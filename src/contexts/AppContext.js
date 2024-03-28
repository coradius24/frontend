"use client";
import firebase from "@/utils/firebase";
import apiService from "@/services/api/apiService";
import authService from "@/services/authService";
import { showToast } from "@/utils/lib";
import { useLocalStorage } from "@/utils/useCustomHook";
import { IconWifiOff } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useReducer } from "react";
import { useNetworkState } from "react-use";
import "./no-internet.css";
import useFCM from "@/hooks/useFCM";
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoginInProgress: false,
  liveClasses: [],
  authChecked: false,
  ongoingLiveClass: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SIGN_UP_INPROGRESS":
      return { ...state, count: state.count + 1 };
    case "LOGIN_IN_PROGRESS":
      return { ...state, isLoginInProgress: true };

    case "SIGN_UP":
      return { ...state, count: state.count + 1 };

    case "LOGOUT_IN_PROGRESS": {
      return {
        ...state,
        isLogoutInProgress: true,
      };
    }
    case "LOGIN":
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user,
        isLoginInProgress: false,
        authChecked: true,
      };
    case "LOGOUT": {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLogoutInProgress: false,
      };
    }
    case "LOAD_LIVE_CLASSES": {
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          liveClasses: action.payload,
        };
      }
      return state;
    }
    case "ONGOING_LIVE_CLASSES": {
      if (action.payload) {
        return {
          ...state,
          ongoingLiveClass: { ...action.payload },
        };
      }
      return state;
    }
    default:
      return state;
  }
};

export const AppContext = createContext();
function AppContextProvider({ children }) {

  const router = useRouter();
  const { data: session } = useSession();
  const { messages, fcmToken } = useFCM();
  console.log("messages, fcmToken", messages, fcmToken)

  const [state, dispatch] = useReducer(reducer, initialState);
  const [cart, setCart] = useLocalStorage("cart", []);
  const networkState = useNetworkState();
  
  const login = async (email, password) => {
    dispatch({ type: "LOGIN_IN_PROGRESS" });
    try {
      const data = await authService.login(email, password);
      dispatch({ type: "LOGIN", payload: data });
    } catch (error) {
      dispatch({
        type: "LOGIN",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
      return Promise.reject(error);
    }
  };

  const getLoginUser = async () => {
    localStorage.setItem("access_token", getCookie("access_token"));
    try {
      const data = await authService.getCurrentUser(getCookie("access_token"));
      if (data?.status === 3) {
        showToast(
          "আপনার অ্যাকাউন্ট ডিজেবল করা হয়েছে, সহায়তার জন্য সাপোর্টে যোগাযোগ করুন!",
          "error"
        );
        setTimeout(() => {
          signOut();
        }, 2000);
        return;
      }
      if (data == null) {
        signOut();
        localStorage.removeItem("access_token");
        await apiService.get("/api/auth/logout");
      } else {
        dispatch({ type: "LOGIN", payload: { user: data } });
      }
    } catch (error) {
      if (error?.statusCode === 401) {
        signOut();
        localStorage.removeItem("access_token");
        await apiService.get("/api/auth/logout");
      }

      dispatch({
        type: "LOGIN",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
      return Promise.reject(error);
    }
  };

  const signup = async ({ email, password, fullName, mobileNumber }) => {
    dispatch({ type: "SIGN_UP_INPROGRESS" });
    try {
      const data = await authService.signup({
        email,
        password,
        fullName,
        mobileNumber,
      });
      dispatch({ type: "SIGN_UP", payload: data });
      return data;
    } catch (error) {
      dispatch({
        type: "LOGIN",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
      return Promise.reject(error);
    }
  };

  const addToCart = (course) => {
    const encodedParams = btoa(JSON.stringify({ checkoutId: course.id }));
    const existingCart = JSON.parse(localStorage.getItem("cart"));
    if (existingCart && existingCart.some((item) => item.id === course.id)) {
      router.push(`/purchase/checkout?data=${encodedParams}`);
      return;
    }

    const updatedCart = [...cart, course];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    router.push(`/purchase/checkout?data=${encodedParams}`);
  };

  const loadLiveClasses = async () => {
    const liveClasses = await apiService.get("/api/live-classes");
    dispatch({
      type: "LOAD_LIVE_CLASSES",
      payload: liveClasses,
    });
    if (Array.isArray(liveClasses)) {
      const currentOngoing = liveClasses?.find((item) => item.isOnGoing);
      if (currentOngoing) {
        addOrReplaceLiveClass(currentOngoing?.id ? currentOngoing : {});
      }
    }
  };

  const addOrReplaceLiveClass = (liveClass) => {
    let liveClasses = [...state.liveClasses];
    console.log("liveClasses", liveClasses)
    let isNewLiveClass = true;
    liveClasses.forEach((_liveClass, index) => {
      if (liveClass.courseId == _liveClass.courseId) {
        isNewLiveClass = false;
        liveClasses[index] = liveClass;
      }
    });
    console.log("isNewLiveClass", isNewLiveClass)
    if (isNewLiveClass) {
      liveClasses.unshift(liveClass);
    }
    dispatch({
      type: "LOAD_LIVE_CLASSES",
      payload: liveClasses,
    });
    console.log({ liveClass });
    dispatch({
      type: "ONGOING_LIVE_CLASSES",
      payload: liveClass,
    });
  };

  useEffect(() => {
    session && getLoginUser();
  }, [session]);

 

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        signup,
        getLoginUser,
        addToCart,
        loadLiveClasses,
        addOrReplaceLiveClass,
        setCart,
        cart,
      }}
    >
      {children}
      {networkState && networkState?.online === false && (
        <div className="no-internet-alert-wrapper ">
          <div className="no-internet-alert">
            <IconWifiOff />
            <p>ইন্টারনেট সংযোগ বিচ্ছিন্ন</p>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
