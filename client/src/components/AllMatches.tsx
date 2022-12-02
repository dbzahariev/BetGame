import React, { useEffect, useRef, useState } from "react";
import { Space, Spin } from "antd";
import { AutoRefreshInterval } from "./AutoRefresh";
import { LoadingOutlined } from "@ant-design/icons";
import OneMatchTable from "./OneMatchTable";

import {
  getAllFinalWinner,
  getPoints,
  stylingTable,
  reloadData,
  getAllUsers,
  MatchType,
  UsersType,
  isGroup,
} from "../helpers/OtherHelpers";
import ModalSettings, { showGroupsGlobal, showRound1Global, showRound2Global, showRound3Global, filterGroupGlobal } from "./ModalSettings";
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
  // const [matches, setMatches] = useState<MatchType[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<MatchType[]>([]);
  const [users, setUsers] = useState<UsersType[]>([]);
  const [loading, setLoading] = useState(false);
  // const [showRound1, setShowRound1] = useState(getDefSettings().showRound1);

  const { state } = useGlobalState();
  const matches = state.matches

  let intervalRef = useRef<any>();

  useEffect(() => {
    getAllUsers(setUsers);
    stylingTable(users)
    setFilteredMatches(matches)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (AutoRefreshInterval >= 1 && AutoRefreshInterval !== "disable") {
      intervalRef.current = setInterval(() => {
        reloadData((reloadedUsers: UsersType[]) => {
          return setUsers([...reloadedUsers])
        }, (reloadedMatches: MatchType[]) => {
          let fiteredMatches: MatchType[] = [...reloadedMatches]
          if (filterGroupGlobal !== "") {
            fiteredMatches = fiteredMatches.filter((el) => el.group === filterGroupGlobal)
          }
          setFilteredMatches(fiteredMatches)
        }, filteredMatches);
      }, AutoRefreshInterval * 1000);
    }

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [AutoRefreshInterval]);

  useEffect(() => {
    if (state.matches.length > 0) {
      reloadData((reloadedUsers: UsersType[]) => {
        return setUsers([...reloadedUsers])
      }, (reloadedMatches: MatchType[]) => {
        let fiteredMatches: MatchType[] = [...reloadedMatches]
        if (filterGroupGlobal !== "") {
          fiteredMatches = fiteredMatches.filter((el) => el.group === filterGroupGlobal)
        }
        setFilteredMatches(fiteredMatches)
      }, matches);
    }
    // eslint-disable-next-line
  }, [refresh])

  useEffect(() => {
    getAllFinalWinner(users);
  }, [users]);

  useEffect(() => {
    if (users.length > 0 && matches.length > 0) {
      setLoading(false);
      let res = getPoints(users, matches);
      res.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      setUsers(res);
    } else {
      setLoading(true);
    }
    // eslint-disable-next-line
  }, [users.length, matches.length]);

  useEffect(() => {
    if (matches.length !== 0 && users.length !== 0) {
      stylingTable(users);
    }
    // eslint-disable-next-line
  }, [filteredMatches, users])

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div>
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
            size="large"
            style={{ width: "100%", height: "100%", alignItems: "center" }}
          />
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return null;
  }
  if (filteredMatches.length === 0) {
    return null
  }

  return (
    <Space direction="vertical">
      <ModalSettings refresh={refresh} />
      <Space direction={"horizontal"}>
        <OneMatchTable
          AllMatches={getMatchesForView(filteredMatches)}
          users={users}
          result={true}
        />
      </Space>
    </Space>
  );
}
