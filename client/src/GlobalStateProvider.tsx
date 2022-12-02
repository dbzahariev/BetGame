import { Spin } from "antd";
import React, { createContext, useState, useContext, Dispatch, SetStateAction, useEffect } from "react";
import { getAllMatchesAsync, getAllUsersAsync, MatchType, UsersType } from "./helpers/OtherHelpers";

import { LoadingOutlined } from "@ant-design/icons";

export interface GlobalStateInterface {
  matches: MatchType[],
  users: UsersType[],
}

const GlobalStateContext = createContext({
  state: {} as Partial<GlobalStateInterface>,
  setState: {} as Dispatch<Partial<SetStateAction<GlobalStateInterface>>>,
});

const GlobalStateProvider = ({
  children,
  value = {} as GlobalStateInterface,
}: {
  children: React.ReactNode;
  value?: GlobalStateInterface;
}) => {
  const [state, setState] = useState<Partial<GlobalStateInterface>>(value);

  const fetchDate = async () => {
    let matches = await getAllMatchesAsync()
    let users = await getAllUsersAsync()
    return { matches, users }
  }

  useEffect(() => {
    setTimeout(() => {
      fetchDate().then((date) => {
        setState({ matches: date.matches, users: date.users })
      }).catch(console.error)
    }, 1)
  }, [])

  let stateMatches = state?.matches?.length
  if (!stateMatches) {
    setTimeout(() => {
      fetchDate().then((date) => {
        setState({ matches: date.matches, users: date.users })
      }).catch(console.error)
    }, 6000) // 60000
    return <div>
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
        size="large"
        style={{ padding: "10px", width: "100%", height: "100%", alignItems: "center" }}
      /></div>
  }

  let statUsers = state?.users?.length
  if (!statUsers) {
    setTimeout(() => {
      fetchDate().then((date) => {
        setState({ matches: date.matches, users: date.users })
      }).catch(console.error)
    }, 100);
    return <div>
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
        size="large"
        style={{ padding: "10px", width: "100%", height: "100%", alignItems: "center" }}
      /></div>
  }

  if (state.matches === undefined) {
    return <div><p>hhhhhhh</p></div>
  }
  if (state.users === undefined) {
    return <div><p>hhh</p></div>
  }

  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateContext");
  }
  return context;
};

export { GlobalStateProvider, useGlobalState };