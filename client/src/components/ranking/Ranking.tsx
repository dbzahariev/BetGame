import React, { useEffect, useState } from "react";
import {
  MatchType,
  ScoreType,
  stylingTable,
  UsersType,
  getPoints
} from "../../helpers/OtherHelpers";
import OneMatchTable from "../OneMatchTable";
import rankingImg4 from "./rankingImg_4_ranks.svg";
import rankingImg5 from "./rankingImg_5_ranks.svg";
import rankingImg6 from "./rankingImg_6_ranks.svg";
import rankingImg7 from "./rankingImg_7_ranks.svg";
import rankingImg8 from "./rankingImg_8_ranks.svg";
import rankingImg9 from "./rankingImg_9_ranks.svg";
import rankingImg10 from "./rankingImg_10_ranks.svg";
import backup2022 from "./Backup2022.json";
import backup2020 from "./Backup2020.json";
import backup2018 from "./Backup2018.json";
import backup2016 from "./Backup2016.json";
import { Select, Space, Switch } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { translateTeamsName } from "../../helpers/Translate";
import { useGlobalState } from "../../GlobalStateProvider";

const { Option } = Select;

const years = [
  { value: "2024", name: { eng: "Euro 2024", bg: "Евро 2024" } },
  { value: "2022", name: { eng: "World 2022", bg: "Световно 2022" } },
  { value: "2020", name: { eng: "Euro 2020", bg: "Евро 2020" } },
  { value: "2018", name: { eng: "World 2018", bg: "Световно 2018" } },
  { value: "2016", name: { eng: "Euro 2016", bg: "Евро 2016" } },
];

export default function Ranking() {
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [users, setUsers] = useState<UsersType[]>([]);
  const [showGroups, setShowGroups] = useState(true);
  const [competitionValue, setCompetitionValue] = useState<string>("2024");
  const [backupCurrentYear, setBackupCurrentYear] = useState<{
    matches: any[];
    users: any[];
  }>({ matches: [], users: [] })
  const { state } = useGlobalState()

  useEffect(() => {
    genBackupCurrentYear()
  }, [])

  useEffect(() => {
    getMatches();
    getUsers();
  }, [competitionValue, showGroups, backupCurrentYear])

  useEffect(() => {
    stylingTable(users);
  }, [users]);

  const getSelectedBackup = () => {
    if (competitionValue === "2022") return backup2022;
    if (competitionValue === "2020") return backup2020;
    if (competitionValue === "2018") return backup2018;
    if (competitionValue === "2016") return backup2016;

    return backupCurrentYear
  };

  const genBackupCurrentYear = () => {
    setBackupCurrentYear({ matches: state.matches ?? [], users: getPoints(state.users ?? [], state.matches ?? []) })
  }

  const getMatches = () => {
    const selectedBackup = getSelectedBackup();
    const matchesFromBackup: MatchType[] = selectedBackup.matches
      .map((el: any) => ({
        number: el.number,
        key: el.key,
        id: el.id,
        homeTeam: el.homeTeam,
        awayTeam: el.awayTeam,
        utcDate: new Date(el.utcDate),
        status: el.status,
        score: el.score as ScoreType,
        homeTeamScore: el.homeTeamScore,
        awayTeamScore: el.awayTeamScore,
        group: el.group,
      }))
      .filter((matchToAdd) => !(showGroups === false && matchToAdd?.group?.toLowerCase().indexOf("group") === 0));

    setMatches(matchesFromBackup);
  };

  const getUsers = () => {
    const selectedBackup = getSelectedBackup();
    const usersFromBackup: UsersType[] = selectedBackup.users.map((el) => ({
      name: el.name,
      bets: el.bets as any[],
      index: el.index,
      finalWinner: el.finalWinner,
      colorTable: el.colorTable,
      totalPoints: el.totalPoints,
    }));

    setUsers(usersFromBackup);
  };

  const getPaddingLeft = (index: number) => {
    const defaultPadding = "9%";

    if (index === 3 || index === 4) {
      let res = index === 3 ? defaultPadding : "38%";
      if (users.length === 5) {
        res = index === 3 ? "26%" : "75%";
      }
      return res;
    }

    return defaultPadding;
  };


  const getRankingImg = () => {
    if (users.length === 4) {
      return rankingImg4;
    }
    if (users.length === 5) {
      return rankingImg5;
    }
    if (users.length === 6) {
      return rankingImg6;
    }
    if (users.length === 7) {
      return rankingImg7;
    }
    if (users.length === 8) {
      return rankingImg8;
    }
    if (users.length === 9) {
      return rankingImg9;
    }
    if (users.length === 10) {
      return rankingImg10;
    }
  };

  const getSortedUsers = () => {
    let res = users
      .sort((a, b) => a.index - b.index)
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return res;
  };

  const oneHuman = (user: UsersType, color2: string) => {
    if (user === undefined) {
      return null;
    }
    return (
      <p
        style={{ color: color2, fontSize: "15px", whiteSpace: "nowrap" }}
      >{`${user.name} (${user.totalPoints})`}</p>
    );
  };

  const ranking = () => {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: `${784 * 0.6}px`,
          height: `${487 * 0.6}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            paddingLeft: "25%",
            paddingTop: "10%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[1], "#1F88C9")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "50%",
            top: 0,
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[0], "#9EB644")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "73%",
            paddingTop: "17%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[2], "#E24786")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: getPaddingLeft(3),
            paddingTop: "68%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[3], "#FFB800")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: getPaddingLeft(4),
            paddingTop: "68%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[4], "#FFB800")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "62%",
            paddingTop: "68%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[5], "#FFB800")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "87%",
            paddingTop: "68%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[6], "#FFB800")}
        </div>

        <img
          src={getRankingImg()}
          alt="Separator"
          style={{
            marginTop: "6%",
            justifyContent: "center",
            display: "flex",
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div >
    );
  };

  const handleChangeForSelector = (value: any) => {
    setCompetitionValue(value);
  };

  if (users.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        padding: "1%",
      }}
    >
      <Select
        style={{
          marginLeft: 20,
          width: "240px",
          marginTop: 10,
          marginBottom: 10,
        }}
        value={competitionValue}
        onChange={handleChangeForSelector}
      >
        {/* <Option value="">Избери година</Option> */}
        {years.map((year) => {
          return (
            <Option key={year.value} value={year.value}>
              {year.name.bg}
            </Option>
          );
        })}
      </Select>
      {ranking()}
      <div style={{ marginTop: "50px" }}>
        <Space
          direction={"horizontal"}
          style={{
            margin: 5,
            paddingTop: 10,
            width: `${window.innerWidth * 0.4}px`,
          }}
        >
          <span style={{ width: `${window.innerWidth * 0.4}px` }}>
            {translateTeamsName("Show group phase")}
          </span>
          <Switch
            onChange={(newValue: any) => setShowGroups(newValue)}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={showGroups}
          />
        </Space>
        <OneMatchTable
          AllMatches={matches}
          users={users}
          result={true}
        />
      </div>
    </div>
  );
}
