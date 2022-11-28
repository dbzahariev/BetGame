// eslint-disable-next-line
import React from "react"
import Table from "antd/lib/table";
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";
// import { Link } from "react-router-dom";
import { MatchType, renderP, UsersType } from "../helpers/OtherHelpers";
import { translateTeamsName } from "../helpers/Translate";

oneMatchTable.defaultProps = { usersColumns: undefined }

// export const styling = {
//   padding: "0.7em"
// }

// export const styleText = { padding: styling.padding }

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
      if (selectedMatch) return selectedMatch[type];
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
    ad: any
  ) => {
    let res = `${ad}`;
    if (ad === null || ad === undefined) {
      return "";
    }

    if (match.score?.duration !== "REGULAR") {
      res = `${ad} (${match.score?.fullTime[type]})`;
    }

    return res;
  };

  return (
    <Table
      id="oneMatchTable"
      dataSource={AllMatches}
      pagination={false}
      bordered
      expandable={{
        // expandedRowRender: (record: MatchType) => {
        //   let date = new Date(record.utcDate).toLocaleString("bg-bg");
        //   return (
        //     <>
        //       <span>{`Този мач ще се проведе на ${date}. Този мач се играе в `}</span>
        //       <Link to={`/groups/${record.group}`}>
        //         {translateTeamsName(record.group || "") || "Ще се реши"}
        //       </Link>
        //     </>
        //   );
        // },
        // rowExpandable: () => true,
        // defaultExpandedRowKeys: ["1"],
      }}
    >
      <Column
        title="Н"
        dataIndex="number"
        key="number"
        width={56}
      // fixed={true}
      />
      <Column
        title="Дата"
        dataIndex="utcDate"
        key="utcDate"
        width={columnWidth}
        render={(el: any) => {
          let newEl = new Date(el)
          let res = `${newEl.getDate()}.${newEl.getMonth() + 1}`

          return <span>{res}</span>;
        }}
      />
      <Column
        title="Час"
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
        title="Група"
        dataIndex="group"
        key="group"
        // width={100}
        render={(el: any) => {
          return <div style={!result ? { height: "2.6rem", display: "flex", alignItems: "center" } : {}}>
            <span>{translateTeamsName(el || "") || "Ще се реши"}</span>
          </div>
          // return <span>{translateTeamsName(el || "") || "Ще се реши"}</span>;
        }}
      />
      <Column
        title="Домакин"
        dataIndex="homeTeam"
        key="homeTeam"
        width={columnWidth}
        render={(el: any) => (
          <span style={{ justifyContent: "center" }}>{translateTeamsName(el.name) || "Ще се реши"}</span>
        )}
      />
      {result ? <ColumnGroup title="Резултат">
        <Column
          title="Д"
          dataIndex="homeTeamScore"
          key="homeTeamScore"
          width={100}
          render={(el: any, record: MatchType) => {
            return (
              <div
                style={{
                  width: "30px",
                }}
              >
                <span style={{}}>
                  {record.status === "IN_PLAY" || record.status === "PAUSED"
                    ? "?"
                    : `${getFullScore(record, "homeTeam", el)}`}
                </span>
              </div>
            );
          }}
        />
        <Column
          title="Г"
          dataIndex="awayTeamScore"
          key="awayTeamScore"
          width={100}
          render={(el: any, record: MatchType) => (
            <div
              style={{
                width: "30px",
              }}
            >
              <span style={{}}>
                {record.status === "IN_PLAY" || record.status === "PAUSED"
                  ? "?"
                  : `${getFullScore(record, "awayTeam", el)}`}
              </span>
            </div>
          )}
        />
        <Column
          title="П"
          dataIndex="winner"
          key="winner"
          width={40}
          render={(el, match: MatchType) => renderP(el, null, match)}
        />
      </ColumnGroup>
        : <></>}
      <Column
        title="Гост"
        dataIndex="awayTeam"
        key="awayTeam"
        width={columnWidth}
        render={(el: any) => (
          <span>{translateTeamsName(el.name) || "Ще се реши"}</span>
        )}
      />
      {usersColumns ? usersColumns :
        users.map((user: UsersType) => {
          return (
            <ColumnGroup
              key={user.name}
              title={`${user.name} (${user.totalPoints || 0})`}
            >
              <Column
                title="Д"
                dataIndex="homeTeamScore"
                key="homeTeamScore"
                width={40}
                render={(el: any, fullMatch: MatchType) =>
                  renderColumnForUser(el, fullMatch, user, "homeTeamScore")
                }
              />
              <Column
                title="Г"
                dataIndex="awayTeamScore"
                key="awayTeamScore"
                width={40}
                render={(el: any, fullMatch: MatchType) =>
                  renderColumnForUser(el, fullMatch, user, "awayTeamScore")
                }
              />
              <Column
                title="П"
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
                title="Т"
                dataIndex=""
                key="points"
                width={40}
                render={(_, record: MatchType) => {
                  const getCurrentPoints = () => {
                    let res = "";
                    let selectedMatchBet = user.bets.find(
                      (el) => el.matchId === record.id
                    );
                    if (record.status === "FINISHED") {
                      res = (selectedMatchBet?.point || 0).toString();
                    } else if (
                      record.status === "IN_PLAY" ||
                      record.status === "PAUSED"
                    ) {
                      res = "?";
                    } else {
                      let fff = user.bets.find((el) => el.matchId === record.id);
                      if (fff !== undefined) {
                        res = "?";
                      }
                    }

                    return res;
                  };

                  return getCurrentPoints();
                }}
              />
            </ColumnGroup>
          );
        })
      }
    </Table>
  );
}
