import { Space, Spin, Switch } from "antd";
import React, { useEffect, useRef, useState } from "react";
import AutoRefresh, { AutoRefreshInterval } from "./AutoRefresh";
import { LoadingOutlined } from "@ant-design/icons";
import OneMatchTable from "./OneMatchTable";

import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import {
  getAllFinalWinner,
  getAllMatches,
  getPoints,
  stylingTable,
  reloadData,
  getAllUsers,
  MatchType,
  UsersType,
  isGroup,
} from "../helpers/OtherHelpers";
import axios, { AxiosRequestConfig } from "axios";

export const getMatchesForView = (
  matches: MatchType[],
  showGroups: boolean
) => {
  let res = [...matches];
  if (showGroups === false) {
    res = res.filter((el) => !isGroup(el))
  }

  return res;
};

export default function AllMatches2({ refresh }: { refresh: Function }) {
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [users, setUsers] = useState<UsersType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGroups, setShowGroups] = useState(true);

  let intervalRef = useRef<any>();

  useEffect(() => {
    const data = JSON.stringify({
      "Messages": [{
        "From": { "Email": "dbzahariev@gmail.com", "Name": "Dimitar Zahariev" },
        "To": [{ "Email": "ramsess90@gmail.com", "Name": "mitaka" }],
        "Subject": "Notify for match",
        "TextPart": "Notify for match in 22.11.2022 y."
      }]
    });

    const config: AxiosRequestConfig = {
      method: 'post',
      url: 'https://api.mailjet.com/v3.1/send',
      data: data,
      // withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Credentials': true
      },
      auth: { username: 'cfdbb1155dca944f524c0af25a5fab94', password: '3d6f3db2290d8011d4f9c199f420035b' },
    };

    const kk: AxiosRequestConfig = {
      method: "GET",
      withCredentials: true,
      url: "/api/users3",
    }

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [])

  useEffect(() => {
    if (AutoRefreshInterval >= 1 && AutoRefreshInterval !== "disable") {
      intervalRef.current = setInterval(() => {
        reloadData(setMatches, getAllUsers, setUsers, users, matches);
      }, AutoRefreshInterval * 1000);
    }

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [AutoRefreshInterval]);

  useEffect(() => {
    if (matches.length === 0) {
      getAllMatches(setMatches);
    }
  }, [matches.length]);

  useEffect(() => {
    getAllUsers(setUsers);
  }, []);

  useEffect(() => {
    getAllFinalWinner(users);
    stylingTable(users);
    // eslint-disable-next-line
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
    stylingTable(users);
  }, [showGroups, users]);

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

  return (
    <>
      <AutoRefresh refresh={refresh} />
      <div>
        <Space
          direction={"horizontal"}
          style={{
            margin: 5,
            paddingTop: 10,
            width: `${window.innerWidth * 0.4}px`,
          }}
        >
          <span style={{ width: `${window.innerWidth * 0.4}px` }}>
            Показване на групова фаза
          </span>
          <Switch
            onChange={(newValue: any) => setShowGroups(newValue)}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={showGroups}
          />
        </Space>
      </div>
      {/* <div style={{ width: 4000 }}>  */}
      <div>
        <Space direction={"horizontal"}>
          <OneMatchTable
            AllMatches={getMatchesForView(matches, showGroups)}
            users={users}
          />
        </Space>
      </div>
    </>
  );
}
