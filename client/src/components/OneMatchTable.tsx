import React from "react"
import Table from "antd/lib/table";
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import { getDefSettings, MatchType, renderP, UsersType } from "../helpers/OtherHelpers";
import { translateTeamsName } from "../helpers/Translate";

oneMatchTable.defaultProps = { usersColumns: undefined }

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
  let columnWidth = 50;

  const renderColumnForUser = (
    el: any,
    fullMatch: MatchType,
    user: UsersType,
    type: "homeTeamScore" | "awayTeamScore"
  ) => {
    const getValue = (
      user: UsersType,
      type: "homeTeamScore" | "awayTeamScore",
      fullMatch: MatchType
    ) => {
      let selectedMatch = user.bets.find((el) => el.matchId === fullMatch.id);
      if (selectedMatch) return (selectedMatch as any)[type];
      else return "";
    };

    let dd = getValue(user, type, fullMatch);
    let matchDate = new Date(fullMatch.utcDate);
    let now = new Date();
    let dif = matchDate.getTime() - now.getTime();
    if (dif > 0 && dd.toString().length > 0) {
      dd = "?";
    }
    return dd;
  };

  const getFullScore = (
    match: MatchType,
    type: "homeTeam" | "awayTeam",
  ) => {
    let ad = (match[`${type}Score`] ?? "").toString()
    if (match.round === "ROUND_-1") {
      ad = ""
    }
    let res = `${ad ?? ""}`;

    let type2 = type === "homeTeam" ? "home" : "away"

    if (match.status !== "TIMED") {
      res = `${ad ?? ""} (${(match.score?.fullTime as any)[type2]})`;
    }
    return res;
  };

  for (let index = 0; index < AllMatches.length; index++) {
    const element = AllMatches[index];
    if (["FINISHED", "SCHEDULED"].includes(element.status) === false) {
      // $(findRow(element.number.toString()) || <></>).css("background-color", "#fffd8a")
    }
  }

  let isEnglish = getDefSettings().isEnglish

  const getCurrentPoint = (record: MatchType, user: UsersType) => {
    let res = "";
    let selectedMatchBet = user.bets.find((el) => el.matchId === record.id);
    let selectedBet = user.bets.find((el) => el.matchId === record.id);
    if (record.status === "FINISHED") {
      res = `${selectedMatchBet?.point || 0}`
    }
    if (selectedBet !== undefined && res === "") {
      res = "?"
    }

    if (record.status === "SCHEDULED" && selectedMatchBet !== undefined) {
      res = "?"
    }

    return res;
  }

  return (
    <Table
      id="oneMatchTable"
      dataSource={AllMatches}
      pagination={false}
      bordered
    >

      <Column
        title={translateTeamsName("N")}
        dataIndex="number"
        key="number"
        width={56}
      />
      <Column
        title={translateTeamsName("Date")}
        dataIndex="utcDate"
        key="utcDate"
        width={columnWidth}
        render={(el: any) => {
          const res = new Date(el).toLocaleDateString(isEnglish ? 'en-EN' : 'bg-BG', { day: '2-digit', month: '2-digit' });

          return <span>{res}</span>;
        }}
      />
      <Column
        title={translateTeamsName("Time")}
        dataIndex="utcDate"
        key="utcDate"
        width={columnWidth}
        render={(el: any) => {
          let newEl = new Date(el)
          let res = `${newEl.getHours()}.0${newEl.getUTCMinutes()}`

          return <span style={{}}>{res}</span>;
        }}
      />
      <Column
        title={translateTeamsName("Group")}
        dataIndex="group"
        key="group"
        render={(el: any) => {
          return <div style={!result ? { height: "2.6rem", display: "flex", alignItems: "center" } : {}}>
            <span>{translateTeamsName(el || "") || translateTeamsName("Will be decided")}</span>
          </div>
        }}
      />
      <Column
        title={translateTeamsName("Home team")}
        dataIndex="homeTeam"
        key="homeTeam"
        width={columnWidth}
        render={(el: any) => (
          <span style={{ justifyContent: "center" }}>{translateTeamsName(el.name) || translateTeamsName("Will be decided")}</span>
        )}
      />
      {result ? <ColumnGroup title={translateTeamsName("Result")}>
        <Column
          title={translateTeamsName("H")}
          dataIndex="homeTeamScore"
          key="homeTeamScore"
          width={100}
          render={(_, record: MatchType) => {
            return (
              <div
                style={{
                  width: "30px",
                }}
              >
                <span>
                  {`${getFullScore(record, "homeTeam")}`}
                </span>
              </div>
            );
          }}
        />
        <Column
          title={translateTeamsName("A")}
          dataIndex="awayTeamScore"
          key="awayTeamScore"
          width={100}
          render={(_, record: MatchType) => (
            <div
              style={{
                width: "30px",
              }}
            >
              <span>
                {`${getFullScore(record, "awayTeam")}`}
              </span>
            </div>
          )}
        />
        <Column
          title={translateTeamsName("W")}
          dataIndex="winner"
          key="winner"
          width={40}
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
          <span>{translateTeamsName(el.name) || translateTeamsName("Will be decided")}</span>
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
                width={40}
                render={(el: any, fullMatch: MatchType) =>
                  renderColumnForUser(el, fullMatch, user, "homeTeamScore")
                }
              />
              <Column
                title={translateTeamsName("A")}
                dataIndex="awayTeamScore"
                key="awayTeamScore"
                width={40}
                render={(el: any, fullMatch: MatchType) =>
                  renderColumnForUser(el, fullMatch, user, "awayTeamScore")
                }
              />
              <Column
                title={translateTeamsName("W")}
                dataIndex="winner"
                key="winner"
                width={40}
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
                width={40}
                render={(_, record: MatchType) => {
                  return getCurrentPoint(record, user)
                }}
              />
            </ColumnGroup>
          );
        })
      }
    </Table>
  );
}
