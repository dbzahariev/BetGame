import { Spin } from "antd";
import React, { createContext, useState, useContext, Dispatch, SetStateAction, useEffect } from "react";
import { getAllMatchesAsyncFetch, getAllUsersAsync, matchesNotState, MatchType, setMatchNotState, setusersNotState, usersNotState, UsersType } from "./helpers/OtherHelpers";

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
  const [foo, setFoo] = useState(0)

  const fetchDate = async () => {
    let matches = await getAllMatchesAsyncFetch()
    let users = await getAllUsersAsync()
    setFoo(foo + 1)
    return { matches, users }
  }

  useEffect(() => {
    setTimeout(() => {
      fetchDate().then((date) => {
        console.log("set matches", date.matches)
        setMatchNotState(date.matches)
        setusersNotState(date.users)
        setFoo(foo + 1)
      }).catch(console.error)
    }, 1)
    // eslint-disable-next-line
  }, [])

  let stateMatches = matchesNotState.length
  if (!stateMatches) {
    setTimeout(() => {
      fetchDate().then((date) => {
        setMatchNotState(date.matches)
        setusersNotState(date.users)
      }).catch(console.error)
    }, 6000)
    console.log("not found matches")
    return <div>
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
        size="large"
        style={{ padding: "10px",  alignItems: "center" }}
      /></div>
  }

  let statUsers = usersNotState.length
  if (!statUsers) {
    setTimeout(() => {
      fetchDate().then((date) => {
        setMatchNotState(date.matches)
        setusersNotState(date.users)
      }).catch(console.error)
    }, 100);
    console.log("not found users")
    return <div>
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
        size="large"
        style={{ padding: "10px",alignItems: "center" }}
      /></div>
  }

  return (
    // <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    // </GlobalStateContext.Provider>
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