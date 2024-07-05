import React from "react"
import Table from "antd/lib/table";
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import { getDefSettings, MatchType, renderP, UsersType } from "../helpers/OtherHelpers";
import { translateTeamsName } from "../helpers/Translate";
import $ from "jquery";

oneMatchTable.defaultProps = { usersColumns: undefined }

const columnWidth = 130
const columnWidthScore = 50
const columnWinnerhScore = 50

export default function oneMatchTable({
  AllMatches,
  users,
  result,
  usersColumns
}: {
  AllMatches: MatchType[];
  users: UsersType[];
  result: Boolean;
  usersColumns: any[]
}) {

  const getValue = (user: UsersType, type: "homeTeamScore" | "awayTeamScore", fullMatch: MatchType) => {
    let selectedMatch = user.bets.find((el) => el.matchId === fullMatch.id);
    if (selectedMatch) return (selectedMatch as any)[type];
    else return "";
  };

  const renderColumnForUser = (fullMatch: MatchType, user: UsersType, type: "homeTeamScore" | "awayTeamScore"): string | number => {
    let value = getValue(user, type, fullMatch);
    const matchDate = new Date(fullMatch.utcDate);
    const now = Date.now();
    const dif = matchDate.getTime() - now;
    if (dif > 0 && value.toString().length > 0) {
      return "?";
    }

    return value;
  };

  const getFullScore = (match: MatchType, type: "home" | "away"): string => {
    const regularTimeScore = match?.score?.regularTime ? match?.score?.regularTime[type]?.toString() ?? "!" : undefined;
    const fullTimeScore = match?.score?.fullTime[type]?.toString() ?? ""
    if (match.group?.startsWith("GROUP")) {
      return fullTimeScore;
    }

    let isDraw = match?.score?.regularTime && match?.score?.regularTime?.away === match.score?.regularTime?.home

    if (match.status !== "TIMED" && isDraw) {
      return `${fullTimeScore} / ${regularTimeScore}`;
    }

    return fullTimeScore;
  };

  let isEnglish = getDefSettings().isEnglish

  const getCurrentPoint = (record: MatchType, user: UsersType): string => {
    let res = "";
    const selectedBet = user.bets.find((el) => el.matchId === record.id);
    if (record.status === "TIMED") {
      res = selectedBet === undefined ? "" : "?";
    } else if (record.status === "FINISHED") {
      res = `${selectedBet?.point || 0}`;
    } else {
      res = "0";
    }

    return res;
  };

  let kk = $("#header").height() || 0
  kk += 533
  // kk *= 10

  // let kk = window.innerHeight * 0.5;
  return (
    <>
      <Table
        id="oneMatchTable"
        dataSource={AllMatches}
        pagination={false}
        scroll={{ y: `${kk}px` }}
        bordered
        style={{ width: "100%" }}
      >
        <Column
          title={translateTeamsName("N")}
          dataIndex="number"
          key="number"
          width={40}
        />
        <Column
          title={translateTeamsName("Date")}
          dataIndex="utcDate"
          key="utcDate"
          width={60}
          render={(el: any) => { return new Date(el).toLocaleDateString(isEnglish ? 'en-EN' : 'bg-BG', { day: '2-digit', month: '2-digit' }) }}
        />
        <Column
          title={translateTeamsName("Time")}
          dataIndex="utcDate"
          key="utcDate"
          width={60}
          render={(el: any) => {
            let newEl = new Date(el)
            let res = `${newEl.getHours()}.0${newEl.getUTCMinutes()}`

            return <span style={{ textWrap: "nowrap" }}>{res}</span>;
          }}
        />
        <Column
          title={translateTeamsName("Group")}
          dataIndex="group"
          key="group"
          width={90}
          render={(el: any) => {
            return <div style={!result ? { display: "flex", alignItems: "center" } : {}}>
              <span style={{ textWrap: "nowrap" }}>{translateTeamsName(el || "") || translateTeamsName("Will be decided")}</span>
            </div>
          }}
        />
        <Column
          title={translateTeamsName("Home team")}
          dataIndex="homeTeam"
          key="homeTeam"
          width={columnWidth}
          render={(el: any) => translateTeamsName(el.name) || translateTeamsName("Will be decided")}
        />
        {result ? <ColumnGroup title={translateTeamsName("Result")}>
          <Column
            title={translateTeamsName("H")}
            dataIndex="homeTeamScore"
            key="homeTeamScore"
            width={columnWinnerhScore}
            render={(_, record: MatchType) => getFullScore(record, "home")}
          />
          <Column
            title={translateTeamsName("A")}
            dataIndex="awayTeamScore"
            key="awayTeamScore"
            width={columnWinnerhScore}
            render={(_, record: MatchType) => getFullScore(record, "away")}
          />
          <Column
            title={translateTeamsName("W")}
            dataIndex="winner"
            key="winner"
            width={columnWinnerhScore}
            render={(el, match: MatchType) => renderP(el, null, match)}
          />
        </ColumnGroup>
          : <></>}
        <Column
          title={translateTeamsName("Away team")}
          dataIndex="awayTeam"
          key="awayTeam"
          width={columnWidth}
          render={(el: any) => (
            <span style={{ textWrap: "nowrap" }}>{translateTeamsName(el.name) || translateTeamsName("Will be decided")}</span>
          )}
        />
        {usersColumns ? usersColumns :
          users.map((user: UsersType) => {
            return (
              <ColumnGroup
                key={user.name}
                title={`${translateTeamsName(user.name)} (${user.totalPoints || 0})`}
              >
                <Column
                  title={translateTeamsName("H")}
                  dataIndex="homeTeamScore"
                  key="homeTeamScore"
                  width={columnWidthScore}
                  render={(_, fullMatch: MatchType) => renderColumnForUser(fullMatch, user, "homeTeamScore")}
                />
                <Column
                  title={translateTeamsName("A")}
                  dataIndex="awayTeamScore"
                  key="awayTeamScore"
                  width={columnWidthScore}
                  render={(_, fullMatch: MatchType) =>
                    renderColumnForUser(fullMatch, user, "awayTeamScore")
                  }
                />
                <Column
                  title={translateTeamsName("W")}
                  dataIndex="winner"
                  key="winner"
                  width={columnWidthScore}
                  render={(_, record: MatchType) => {
                    let selectedMatchWinner =
                      user.bets.find((el) => el.matchId === record.id)?.winner ||
                      "";
                    return renderP(selectedMatchWinner, user, record);
                  }}
                />
                <Column
                  title={translateTeamsName("P")}
                  dataIndex=""
                  key="points"
                  width={columnWidthScore}
                  render={(_, record: MatchType) =>
                    getCurrentPoint(record, user)
                  }
                />
              </ColumnGroup>
            );
          })
        }
      </Table>
    </>
  );
}
