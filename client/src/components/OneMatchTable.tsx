import React from "react"
import Table from "antd/lib/table";
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import { getDefSettings, MatchType, renderP, UsersType } from "../helpers/OtherHelpers";
import { translateTeamsName } from "../helpers/Translate";

oneMatchTable.defaultProps = { usersColumns: undefined }

const columnWidth = 50;

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
    const teamScore: string = match[`${type}TeamScore`]?.toString() ?? "";
    const fullTimeScore: string = match?.score?.fullTime[type]?.toString() ?? "";

    if (match.round === "ROUND_-1") {
      return fullTimeScore;
    }

    if (match.status !== "TIMED") {
      return `${teamScore} (${fullTimeScore})`;
    }

    return teamScore;
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
                  {`${getFullScore(record, "home")}`}
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
                {`${getFullScore(record, "away")}`}
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
                render={(_, fullMatch: MatchType) =>
                  renderColumnForUser(fullMatch, user, "homeTeamScore")
                }
              />
              <Column
                title={translateTeamsName("A")}
                dataIndex="awayTeamScore"
                key="awayTeamScore"
                width={40}
                render={(_, fullMatch: MatchType) =>
                  renderColumnForUser(fullMatch, user, "awayTeamScore")
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
                render={(_, record: MatchType) =>
                  getCurrentPoint(record, user)
                }
              />
            </ColumnGroup>
          );
        })
      }
    </Table>
  );
}
