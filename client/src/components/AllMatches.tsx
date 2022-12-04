import React, { useEffect, useRef, useState } from "react";
import { Space } from "antd";
import { AutoRefreshInterval } from "./AutoRefresh";
import OneMatchTable from "./OneMatchTable";

import {
  getAllFinalWinner,
  getPoints,
  stylingTable,
  MatchType,
  isGroup,
  UsersType,
  getMatchesAndUsers,
} from "../helpers/OtherHelpers";
import ModalSettings, { showGroupsGlobal, showRound1Global, showRound2Global, showRound3Global } from "./ModalSettings";
import { useGlobalState } from "../GlobalStateProvider";

export const getMatchesForView = (
  matches: MatchType[],
) => {
  let res = [...matches];
  if (showGroupsGlobal === false) {
    res = res.filter((el) => !isGroup(el))
  }
  if (!showRound1Global) {
    res = res.filter((el) => {
      return (el.round !== "ROUND_1")
    })
  }
  if (!showRound2Global) {
    res = res.filter((el) => {
      return (el.round !== "ROUND_2")
    })
  }
  if (!showRound3Global) {
    res = res.filter((el) => {
      return (el.round !== "ROUND_3")
    })
  }

  return res;
};

export default function AllMatches({ refresh }: { refresh: Function }) {
  const [filteredMatches, setFilteredMatches] = useState<MatchType[]>([]);
  const { state } = useGlobalState();

  const matches = state.matches || []
  const users = state.users || []

  let intervalRef = useRef<any>();

  useEffect(() => {
    stylingTable(users)
    setFilteredMatches(matches)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    //TODO: Fix auto refresh

    if (AutoRefreshInterval >= 1 && AutoRefreshInterval !== "disable") {
      intervalRef.current = setInterval(() => {
        getMatchesAndUsers().then((newState) => {
        })
        // getAllUsersAsync().then((users) => {
        //   setState({ users })
        // })
        // getAllMatchesAsync().then((matches) => {
        //   setState({ matches })
        //   setFilteredMatches(matches)
        // })
      }, AutoRefreshInterval * 1000);
    }

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [AutoRefreshInterval]);

  useEffect(() => {
    stylingTable(users)
    if ((state.matches || []).length > 0) {
      // getAllUsersAsync().then((users) => {
      //   setState({ users })
      // })
      // getAllMatchesAsync().then((matches) => {
      //   setState({ matches })
      //   setFilteredMatches(matches)
      // })
    }
    // eslint-disable-next-line
  }, [refresh])

  useEffect(() => {
    getAllFinalWinner(users);
  }, [users]);

  const getResultedUsers = (users: UsersType[]) => {
    return getPoints(users.slice(), matches).sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
  }

  useEffect(() => {
    if (matches.length !== 0 && users.length !== 0) {
      stylingTable(users);
    }
    // eslint-disable-next-line
  }, [filteredMatches, users])

  return (
    <Space direction="vertical">
      <ModalSettings refresh={refresh} />
      <Space direction={"horizontal"}>
        <OneMatchTable
          AllMatches={getMatchesForView(filteredMatches)}
          users={getResultedUsers(users)}
          result={true}
        />
      </Space>
    </Space>
  );
}
