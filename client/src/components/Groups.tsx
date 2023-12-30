import React, { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { Button, Space, Table } from "antd";
import { translateTeamsName } from "../helpers/Translate";
import { useParams } from "react-router-dom";
import { selectedCompetition, selectedApiVersion } from "../App";
import { MatchType } from "../helpers/OtherHelpers";
import OneMatchTable from "./OneMatchTable";
import { useGlobalState } from "../GlobalStateProvider";

type OneRow = {
  key: string;
  name: string;
  playedGames: number | string;
  won: number | string;
  draw: number | string;
  lost: number | string;
  points: number | string;
  position: number;
  goalDifference: number | string;
};

type OneGroup = {
  name: string;
  table: OneRow[];
};

export default function Groups() {
  const [groups, setGroups] = useState<OneGroup[]>([]);
  const { state } = useGlobalState()
  const matches = state.matches || []
  let params: any = useParams();

  useEffect(() => {
    if (matches.length > 0) {
      getAllStandings();
    }
    // eslint-disable-next-line
  }, [matches.length]);

  const getAllStandings = () => {
    var config: AxiosRequestConfig = {
      method: "GET",
      url: `https://api.football-data.org/${selectedApiVersion}/competitions/${selectedCompetition}/standings`,
      headers: {
        "X-Auth-Token": "c8d23279fec54671a43fcd93068762d1",
      },
    };

    axios(config)
      .then(function (response) {
        let data: any = response.data.standings;
        let allGroups = [];

        for (let i = 0; i < data.length; i++) {
          let group = data[i];
          let groupToAdd: OneGroup = {
            name: group.group as string,
            table: [],
          };
          groupToAdd.name = groupToAdd.name[groupToAdd.name.length - 1];

          for (let j = 0; j < group.table.length; j++) {
            let teams = group.table[j];
            let teamsToAdd: OneRow = {
              key: teams.team.name,
              name: translateTeamsName(teams.team.name),
              playedGames: teams.playedGames,
              won: teams.won,
              draw: teams.draw,
              lost: teams.lost,
              points: teams.points,
              position: teams.position,
              goalDifference: teams.goalDifference,
            };
            groupToAdd.table.push(teamsToAdd);
          }

          allGroups.push(groupToAdd);
        }
        setGroups(allGroups);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    let groupName = params.groupName;
    if (groupName && groupName !== "All") {
      let el = document.getElementById(groupName);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    // eslint-disable-next-line
  }, [groups]);

  const renderGroups = () => {
    const oneGroupTable = (oneGroup: OneGroup) => {
      const columns = [
        {
          title: translateTeamsName("Position"),
          dataIndex: "position",
          key: "position",
          render: (el: number) => (
            <span
              style={{
                border: `2px solid ${el.toString() === "1" || el.toString() === "2"
                  ? "#4285F4"
                  : el.toString() === "3"
                    ? "#FA7B17"
                    : "black"
                  }`,
              }}
            >
              {el}
            </span>
          ),
        },
        {
          title: translateTeamsName("Name"),
          dataIndex: "name",
          key: "name",
          width: window.screen.width * 0.2,
        },
        {
          title: translateTeamsName("PG"),
          dataIndex: "playedGames",
          key: "playedGames",
        },
        {
          title: translateTeamsName("W"),
          dataIndex: "won",
          key: "won",
        },
        {
          title: translateTeamsName("D"),
          dataIndex: "draw",
          key: "draw",
        },
        {
          title: translateTeamsName("L"),
          dataIndex: "lost",
          key: "lost",
        },
        {
          title: translateTeamsName("GD"),
          dataIndex: "goalDifference",
          key: "goalDifference",
        },
        {
          title: translateTeamsName("P"),
          dataIndex: "points",
          key: "points",
        },
      ];
      return (
        <Table
          key={`Group ${oneGroup.name}`}
          // title={() => (
          //   <p style={{ textAlign: "center" }}>{`${translateTeamsName("GROUP")} ${oneGroup.name}`}</p>
          // )}
          dataSource={oneGroup.table}
          columns={columns}
          pagination={false}
          bordered
        />
      );
    };

    const oneGroupMatches = (group: OneGroup) => {
      let filteredMatches = matches.filter((el: MatchType) => {
        return (el.group || "") === `GROUP_${group.name}`
      })

      return (
        <div style={{ padding: "0px" }}>
          <OneMatchTable
            AllMatches={filteredMatches}
            users={[]}
            result={true}
          />
        </div>)
    }

    return (
      <div>
        {groups.map((group) => {
          return (
            <div key={`Group ${group.name}`} id={`Group ${group.name}`}
              style={{ width: "760px", border: "2px solid black" }}>
              <p style={{ textAlign: "center", padding: "10px", margin: "0px", fontWeight: "bold", fontSize: "20px" }}>{`${translateTeamsName("GROUP")} ${group.name}`}</p>
              {oneGroupMatches(group)}
              <Space style={{
                display: "flex", justifyContent: "center", alignItems: "center", padding: "10px",
              }} direction={"horizontal"}>{oneGroupTable(group)}</Space>
            </div>
          );
        })}
        <Button onClick={() => window.scrollTo(0, 0)}>Начало</Button>
      </div>
    );
  };

  return <div>{renderGroups()}</div>;
}
