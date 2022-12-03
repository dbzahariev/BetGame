import React, { useEffect, useState } from "react";
import { Input, InputNumber, notification, Select, Space } from "antd";
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import axios from "axios";
import { useGlobalState } from "../GlobalStateProvider";
import { UsersType, MatchType, renderP2, isGroup, stylingTable } from "../helpers/OtherHelpers";
import { translateTeamsName } from "../helpers/Translate";
import OneMatchTable from "./OneMatchTable";

const { Option } = Select;


export default function AddNewBet() {
  const [users, setUsers] = useState<UsersType[]>([]);
  // const [matches, setMatches] = useState<MatchType[]>([]);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [usersNames, setUsersNames] = useState<string[]>([]);

  const { state } = useGlobalState();
  const matches = state.matches || []
  const usersFromState = state.users || []

  useEffect(() => {
    stylingTable(users, true);
  }, [matches, selectedUserName, users])

  useEffect(() => {
    getAllUsersNames()
    // eslint-disable-next-line
  }, []);

  const getAllUsersNames = () => {
    let onlyNames: string[] = []
    usersFromState.forEach(element => {
      onlyNames.push(translateTeamsName(element.name))
    });
    setUsersNames(onlyNames)
  }

  const handleChangeForSelector = (value: any) => {
    setSelectedUserName(value);
  };

  useEffect(() => {
    setUsers(usersFromState.filter((user) => user.name === selectedUserName));
    // eslint-disable-next-line
  }, [selectedUserName]);

  const checkDisabledInput = (fullMatch: MatchType, user: UsersType) => {
    const haveGest = (fullMatch: MatchType, user: UsersType) => {
      let myBet = user.bets.find((el) => el.matchId === fullMatch.id);

      let awayTeamScore = -1;
      let homeTeamScore = -1;
      let haveBet = false;
      if (myBet?.awayTeamScore !== undefined)
        awayTeamScore = myBet.awayTeamScore;
      if (myBet?.homeTeamScore !== undefined)
        homeTeamScore = myBet.homeTeamScore;

      if (awayTeamScore !== -1 && homeTeamScore !== -1) {
        haveBet = true;
      }
      return haveBet;
    };

    let result = false;
    let now = new Date();
    let matchDate = new Date(fullMatch.utcDate);
    let difference = now.getTime() - matchDate.getTime();
    let differenceMin = Math.round(difference / 1000 / 60);

    let haveBet = haveGest(fullMatch, user);

    if (differenceMin >= 0 && differenceMin <= 15 && haveBet) {
      result = true;
    }

    if (differenceMin >= 15) {
      result = true;
    }

    if (differenceMin > 0 && differenceMin < 15) {
      result = haveBet;
    }

    if (differenceMin < 0) {
      result = false;
    }

    return result;
  };

  const calcWinner = (
    homeScore: number,
    awayScore: number,
    forW: number = 0
  ) => {
    let res: string = "";
    if (homeScore > awayScore || forW === 1) {
      res = "HOME_TEAM";
    } else if (awayScore > homeScore || forW === 2) {
      res = "AWAY_TEAM";
    } else {
      res = "DRAW"
    }
    if (homeScore === -1 || awayScore === -1) {
      res = "";
    }
    return res;
  };

  const setBetsToDB = (userProp: UsersType) => {
    if (userProp) {
      let user = userProp;
      let betsToSave = [...user.bets];
      betsToSave = betsToSave.filter((bet) => bet.homeTeamScore !== -1);
      betsToSave = betsToSave.filter((bet) => bet.awayTeamScore !== -1);

      axios({
        method: "POST",
        data: { bets: betsToSave },
        withCredentials: true,
        url: `/api/update?id=${user.id}`,
      })
        .then((res) => {
          notification.open({
            message: `Залогът е записан успешно!`,
            type: "success",
          });
        })
        .catch((err) => {
          notification.open({
            message: `Грешка`,
            type: "error",
          });
          return console.error(err);
        });
    }
  };

  const handleChange = (
    el1: any,
    user: UsersType,
    fullMatch: MatchType,
    type: "homeTeamScore" | "awayTeamScore" | "winner"
  ) => {
    let newValue: string | number = el1;

    let newUsers = [...users];
    let curUser = newUsers.find((userSel) => userSel.name === user.name);

    if (!curUser) return null;

    let bet = curUser.bets.find((el) => el.matchId === fullMatch.id);

    if (newValue === null) {
      newValue = -1;
    }

    if (!bet) {
      let newBet = {
        matchId: fullMatch.id,
        homeTeamScore: -1,
        awayTeamScore: -1,
        winner: "DRAW",
        [type]: Number(newValue),
        point: 0,
        date: new Date(),
      };

      if (type === "winner") {
        let winerPred = el1.target.value.toString().toLowerCase();
        if (
          winerPred === "1" ||
          winerPred === "h" ||
          winerPred === "home" ||
          winerPred === "домакин" ||
          winerPred === "д"
        ) {
          newValue = 1;
        } else if (
          winerPred === "2" ||
          winerPred === "a" ||
          winerPred === "away" ||
          winerPred === "гост" ||
          winerPred === "г"
        ) {
          newValue = 2;
        } else {
          console.log("Грешка при въвеждане!!!", winerPred);
        }

        newBet.winner = calcWinner(
          newBet.homeTeamScore,
          newBet.awayTeamScore,
          Number(newValue)
        );
      } else {
        newBet.winner = calcWinner(newBet.homeTeamScore, newBet.awayTeamScore);
      }
      bet = newBet;

      curUser.bets.push(newBet);
    } else {
      if (type === "awayTeamScore" || type === "homeTeamScore") {
        bet[type] = Number(newValue);
      }

      if (type === "winner") {
        let winerPred = el1.target.value.toString().toLowerCase();
        if (
          winerPred === "1" ||
          winerPred === "h" ||
          winerPred === "home" ||
          winerPred === "домакин" ||
          winerPred === "д"
        ) {
          newValue = 1;
        } else if (
          winerPred === "2" ||
          winerPred === "a" ||
          winerPred === "away" ||
          winerPred === "гост" ||
          winerPred === "г"
        ) {
          newValue = 2;
        } else {
          console.log("Грешка при въвеждане!!!", winerPred);
        }

        bet.winner = calcWinner(
          bet.homeTeamScore,
          bet.awayTeamScore,
          Number(newValue)
        );
      } else {
        bet.winner = calcWinner(bet.homeTeamScore, bet.awayTeamScore);
      }
    }

    bet.date = new Date();

    setUsers(newUsers);

    setBetsToDB(user);
  };

  const getValue = (
    user: UsersType,
    type: "homeTeamScore" | "awayTeamScore",
    fullMatch: MatchType,
    isWinner: boolean
  ) => {
    let selectedMatch = user.bets.find((el) => el.matchId === fullMatch.id);

    let res: string | number = "";
    if (selectedMatch) {
      let selectedMatchType = selectedMatch[type];
      if (selectedMatchType !== -1) {
        res = selectedMatchType;
      }
    }
    if (isWinner && selectedMatch !== undefined) {
      let selectedMatchWiner = selectedMatch.winner;
      res = selectedMatchWiner;
    }

    return res;
  };

  const oneMatchTable = (AllMatches: MatchType[]) => {

    const renderColumnForUser = (
      el: any,
      fullMatch: MatchType,
      user: UsersType,
      type: "homeTeamScore" | "awayTeamScore"
    ) => {
      return (
        <InputNumber
          min={-1}
          max={10}
          disabled={checkDisabledInput(fullMatch, user)}
          placeholder=""
          defaultValue={""}
          value={getValue(user, type, fullMatch, false)}
          onChange={(el) => handleChange(el, user, fullMatch, type)}
        />
      );
    };

    const renderWinner = (user: UsersType, record: MatchType) => {
      let selectedMatchWinner =
        user.bets.find((el) => el.matchId === record.id)?.winner || "";

      const checkDisablePredWinner = (vall: any) => {
        let res = false;
        let bet = user.bets.find((el) => el.matchId === vall.id);
        if (bet !== undefined) {
          if (isGroup(record)) {
            res = true
          } else {
            if (bet.homeTeamScore === bet.awayTeamScore) {
              res = false;
            } else {
              res = true;
            }
          }
        }

        return res;
      };

      let res = renderP2(selectedMatchWinner);
      let vall: string = getValue(
        user,
        "awayTeamScore",
        record,
        true
      ).toString();
      
      vall = renderP2(vall, true).toString();

      let selectedBet = user.bets.find((el) => el.matchId === record.id)
      let isDraw = selectedBet?.awayTeamScore === selectedBet?.homeTeamScore

      if (record.group === "LAST_16" && isDraw && selectedBet?.winner === "DRAW") {
        vall = ""
      }

      res = (
        <Input
          disabled={checkDisablePredWinner(record)}
          style={{ width: 100 }}
          placeholder=""
          value={vall}
          onChange={(el) => handleChange(el, user, record, "winner")}
        />
      );
      return res;
    };

    return (
      <div>
        <div id={"newBetTable"}>
          <Space direction={"horizontal"}>
            <OneMatchTable
              AllMatches={matches.filter((match) => match.status !== "FINISHED")}
              users={users}
              result={false}
              usersColumns={users.map((user: UsersType) => {
                return (
                  <ColumnGroup key={user.name} title={user.name}>
                    <Column
                      title={translateTeamsName("Д")}
                      dataIndex="homeTeamScore"
                      key="homeTeamScore"
                      width={80}
                      render={(el: any, fullMatch: MatchType) =>
                        renderColumnForUser(el, fullMatch, user, "homeTeamScore")
                      }
                    />
                    <Column
                      title={translateTeamsName("Г")}
                      dataIndex="awayTeamScore"
                      key="awayTeamScore"
                      width={80}
                      render={(el: any, fullMatch: MatchType) =>
                        renderColumnForUser(el, fullMatch, user, "awayTeamScore")
                      }
                    />
                    <Column
                      title={translateTeamsName("П")}
                      dataIndex="winner"
                      key="winner"
                      width={40}
                      render={(_, record: MatchType) => {
                        return renderWinner(user, record);
                      }}
                    />
                  </ColumnGroup>
                );
              })}
            />
          </Space>
        </div>
      </div>)

    /*
    let columnWidth = 150;

    return (
      <Table
        dataSource={AllMatches}
        pagination={false}
        bordered
        expandable={{
          expandedRowRender: (record: MatchType) => {
            let date = new Date(record.utcDate).toLocaleString("bg-bg");
            return (
              <>
                <span>
                  {`Този мач ще се проведе на ${date}.`}
                  <br />
                  {`Този мач се играе в `}
                </span>

                <Link to={`/groups/${record.group}`}>
                  {translateTeamsName(record.group || "") || translateTeamsName("Ще се реши")}
                </Link>
              </>
            );
          },
          rowExpandable: () => true,
          defaultExpandedRowKeys: ["1"],
        }}
      >
        <Column
          title={translateTeamsName("N")}
          dataIndex="number"
          key="number"
          width={56}
          fixed={true}
        />
        <Column
          title="Домакин"
          dataIndex="homeTeam"
          key="homeTeam"
          width={columnWidth}
          render={(el: any) => {
            return <span>{translateTeamsName(el.name) || translateTeamsName("Ще се реши")}</span>;
          }}
        />
        <Column
          title="Гост"
          dataIndex="awayTeam"
          key="awayTeam"
          width={columnWidth}
          render={(el: any) => (
            <span>{translateTeamsName(el.name) || translateTeamsName("Ще се реши")}</span>
          )}
        />
        {users.map((user: UsersType) => {
          return (
            <ColumnGroup key={user.name} title={user.name}>
              <Column
                title="Д"
                dataIndex="homeTeamScore"
                key="homeTeamScore"
                width={80}
                render={(el: any, fullMatch: MatchType) =>
                  renderColumnForUser(el, fullMatch, user, "homeTeamScore")
                }
              />
              <Column
                title="Г"
                dataIndex="awayTeamScore"
                key="awayTeamScore"
                width={80}
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
                  return renderWinner(user, record);
                }}
              />
            </ColumnGroup>
          );
        })}
      </Table>
    );*/
  };

  return (
    <div>
      <Select
        defaultValue={translateTeamsName("Chose plear")}
        style={{ width: 140 }}
        onChange={handleChangeForSelector}
      >
        <Option value="">{translateTeamsName("Chose plear")}</Option>
        {usersNames.map((user) => {
          let kk = translateTeamsName(user)
          return (
            <Option key={user} value={user}>
              {kk}
            </Option>
          );
        })}
      </Select>
      <div style={{ width: 4000 }}>
        <Space direction={"horizontal"}>{oneMatchTable(matches)}</Space>
      </div>
      {/* <div>
        <Space direction={"horizontal"}>
          <OneMatchTable
            AllMatches={matches}
            users={users}
          />
        </Space>
      </div> */}
    </div>
  );
}
