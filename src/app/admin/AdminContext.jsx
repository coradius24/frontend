"use client";

import Providers from "@/app/(student-portal)/Providers";
import AppContextProvider from "@/contexts/AppContext";

const { createContext, useReducer, useContext } = require("react");

const initialState = {
  isSidebarCollapsed: false,
  isSidebarHovered: false,
  isMobileSidebar: false,
  features: {},
};

const AdminContext = createContext(initialState);

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_SIDEBAR_COLLAPSED":
      return {
        ...state,
        isSidebarCollapsed: payload,
      };

    case "SET_SIDEBAR_HOVER":
      return {
        ...state,
        isSidebarHovered: payload,
      };

    case "SET_MOBILE_SIDEBAR":
      return {
        ...state,
        isMobileSidebar: payload,
      };
    case "LOAD_FEATURES":
      return {
        ...state,
        features: payload,
      };

    default:
      return state;
  }
};

const AdminContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setSidebarCollapsed = (isCollapsed) => {
    dispatch({
      type: "SET_SIDEBAR_COLLAPSED",
      payload: isCollapsed,
    });
  };
  const setSidebarHover = (isSidebarHovered) => {
    dispatch({
      type: "SET_SIDEBAR_HOVER",
      payload: isSidebarHovered,
    });
  };

  const toggleSidebar = () => {
    dispatch({
      type: "SET_SIDEBAR_COLLAPSED",
      payload: !state.isSidebarCollapsed,
    });
  };

  const setMobileSidebar = (isMobileSidebar) => {
    dispatch({
      type: "SET_MOBILE_SIDEBAR",
      payload: isMobileSidebar,
    });
  };

  const toggleMobileSidebar = () => {
    dispatch({
      type: "SET_MOBILE_SIDEBAR",
      payload: !state.isMobileSidebar,
    });
  };

  const loadFeatures = (payload) => {
    dispatch({
      type: "LOAD_FEATURES",
      payload,
    });
  };

  function isFeatureAvailable(featureId, moduleName) {
    return state?.features?.[moduleName]?.find((fe) => fe.id == featureId);
  }

  return (
    <AdminContext.Provider
      value={{
        ...state,
        setSidebarCollapsed,
        setSidebarHover,
        setMobileSidebar,
        toggleMobileSidebar,
        toggleSidebar,
        loadFeatures,
        isFeatureAvailable,
      }}
    >
      <Providers>
        <AppContextProvider>{children}</AppContextProvider>
      </Providers>
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);

export default AdminContextProvider;
