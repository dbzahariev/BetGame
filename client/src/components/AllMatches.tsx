import React, { useEffect, useRef, useState } from "react";
import { Space, Spin } from "antd";
import { AutoRefreshInterval } from "./AutoRefresh";
import OneMatchTable from "./OneMatchTable";

import {
  getAllFinalWinner,
  getPoints,
  stylingTable,
  MatchType,
  isGroup,
  UsersType,
  isGroupName,
  matchesNotState,
  usersNotState,
  setMatchNotState,
  setusersNotState,
  getAllMatchesAsyncFetch,
  getAllUsersAsync,
} from "../helpers/OtherHelpers";
import ModalSettings, { showGroupsGlobal, showRound1Global, showRound2Global, showRound3Global } from "./ModalSettings";
import { LoadingOutlined } from "@ant-design/icons";
import FinalWiner from "./FinalWinner";

export const getMatchesForView = (
  matches: MatchType[],
) => {
  if (matches.length === 0) return []

  const getFinalScore = (match: MatchType, team: "home" | "away") => {
    return (match?.score?.fullTime as any)[team]// || undefined
  }

  let res = [...matches];
  if (showGroupsGlobal === false) {
    res = res.filter((el) => !isGroup(el))
  }
  else {
    res = res.filter((el) => isGroupName(el))
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
  res = res.map((match) => {
    match.awayTeamScore = getFinalScore(match, "away")
    match.homeTeamScore = getFinalScore(match, "home")
    return { ...match }
  })

  return res;
};

export default function AllMatches({ refresh }: { refresh: Function }) {
  const [filteredMatches, setFilteredMatches] = useState<MatchType[]>([]);
  const [isInit, setIsint] = useState(-1)

  const matches = matchesNotState
  const users = usersNotState

  let intervalRef = useRef<any>();

  useEffect(() => {
    stylingTable(usersNotState)
    setFilteredMatches(matchesNotState)
  }, [users, matches, isInit])

  useEffect(() => {
    if (+AutoRefreshInterval >= 1 && AutoRefreshInterval !== "disable" && AutoRefreshInterval !== "init") {
      intervalRef.current = setInterval(() => {
        fetchDate()
      }, AutoRefreshInterval * 1000);
    }

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [AutoRefreshInterval]);

  // const reloadDate = () => {
  //   fetchDate().then((date) => {
  //     setMatchNotState(date.matches)
  //     setusersNotState(date.users)
  //     setIsint(isInit + 1)
  //   }).catch(console.error)
  //   //   getMatchesAndUsers().then((newState) => {
  //   //     if (!justCompare(newState.matches, matchesNotState)) {
  //   //       setMatchNotState(newState.matches)
  //   //       setusersNotState(newState.usesers)
  //   //     }
  //   //   })
  //   //   stylingTable(usersNotState)
  // }

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

  useEffect(() => {
    if (isInit !== -1) {
      refresh()
    }
    // eslint-disable-next-line 
  }, [isInit])

  useEffect(() => {
    fetchDate()
    // eslint-disable-next-line
  }, [])

  const fetchDate = async () => {
    setMatchNotState(await getAllMatchesAsyncFetch())
    setusersNotState(await getAllUsersAsync())
    setIsint(isInit + 1)
  }

  let stateMatches = matchesNotState.length
  if (!stateMatches) {
    return <div>
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
        size="large"
        style={{ padding: "10px", width: "100%", height: "50px", alignItems: "center" }}
      /></div>
  }
  return (
    <Space direction="vertical">
      <ModalSettings refresh={() => setIsint(isInit + 1)} />
      <Space direction={"vertical"}>
        <FinalWiner users={users}></FinalWiner>
        <OneMatchTable
          AllMatches={getMatchesForView(filteredMatches)}
          users={getResultedUsers(users)}
          result={true}
        />
      </Space>
    </Space>
  );
}
