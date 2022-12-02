import { Spin } from "antd";
import React, { createContext, useState, useContext, Dispatch, SetStateAction, useEffect } from "react";
import { getAllMatches3, MatchType } from "./helpers/OtherHelpers";

import { LoadingOutlined } from "@ant-design/icons";

export interface GlobalStateInterface {
  matches: MatchType[]
}

const GlobalStateContext = createContext({
  state: {} as GlobalStateInterface,
  setState: {} as Dispatch<SetStateAction<GlobalStateInterface>>,
});

const GlobalStateProvider = ({
  children,
  value = {} as GlobalStateInterface,
}: {
  children: React.ReactNode;
  value?: GlobalStateInterface;
}) => {
  const [state, setState] = useState(value);

  useEffect(() => {
    getAllMatches3().then((el) => {
      setState({ matches: el })
    }).catch(
      () => {
        return <div><p>Eror 500</p></div>
      }
    );
  }, [])

  let kk = state?.matches?.length
  if (!kk) {
    setTimeout(() => {
      getAllMatches3().then((el) => {
        setState({ matches: el })
      }).catch(
        () => {
          return <div><p>Eror 500</p></div>
        }
      );
    }, 60000);
    return <div>
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
        size="large"
        style={{ width: "100%", height: "100%", alignItems: "center" }}
      /></div>
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