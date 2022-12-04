// eslint-disable-next-line
import React from "react"
import axios, { AxiosRequestConfig } from "axios";
import { selectedCompetition, selectedApiVersion } from "../App";
import $ from "jquery";
import {
  coefficientQuarterFinal,
  coefficientSemiFinal,
  coefficientThirdPlace,
  coefficientFinal,
} from "../components/Rules";
import { Key } from "react";
import compare from 'just-compare';
import { translateTeamsName } from "./Translate";
// import { styleText } from "../components/OneMatchTable";

export interface ScoreType {
  duration: string;
  extraTime: {
    homeTeam: null;
    awayTeam: null;
  };
  fullTime: {
    homeTeam: number;
    awayTeam: number;
  };
  halfTime: {
    homeTeam: number;
    awayTeam: number;
  };
  penalties: {
    homeTeam: null;
    awayTeam: null;
  };
  winner: string;
}

export interface MatchType {
  number: number;
  key: Key;
  id: number;
  homeTeam: {
    id: number;
    name: string;
  };
  awayTeam: {
    id: number;
    name: string;
  };
  utcDate: Date;
  group?: string | undefined;
  stage?: string | undefined;
  score?: ScoreType;
  winner?: string;
  homeTeamScore?: number | undefined;
  awayTeamScore?: number | undefined;
  status: string;
  round?: string | undefined
}

export interface UsersType {
  name: string;
  bets: {
    matchId: number;
    homeTeamScore: number;
    awayTeamScore: number;
    winner: string;
    point: number;
    date: Date;
  }[];
  index: number;
  _id?: string;
  id?: string;
  finalWinner: string;
  colorTable: string;
  totalPoints: number;
}

export const isGroup = (fullMatch: MatchType) => {
  return (fullMatch.group || "").includes("GROUP")
}

const baseUrl = "https://http-nodejs-production-624f.up.railway.app"
axios.defaults.baseURL = baseUrl

export const getAllUsersAsync = async () => {
  console.log("get Users")
  let res = await axios({
    method: "GET",
    url: "/api/users",
  })
  let users = [...res.data] as UsersType[];
  let newUsers: UsersType[] = [];
  users.forEach((el) => {
    let userToAdd: UsersType = {
      name: el.name,
      bets: el.bets,
      index: el.index,
      finalWinner: el.finalWinner,
      colorTable: el.colorTable,
      totalPoints: 0,
    };
    if (el._id) {
      userToAdd.id = el._id;
    }

    newUsers.push(userToAdd);
  });
  return newUsers
};

export const getAllUsersAsync2 = async () => {
  console.log("get Users")
  let res = await axios({
    method: "GET",
    url: "/api/users",
  })
  let users = [...res.data] as UsersType[];
  let newUsers: UsersType[] = [];
  users.forEach((el) => {
    let userToAdd: UsersType = {
      name: el.name,
      bets: el.bets,
      index: el.index,
      finalWinner: el.finalWinner,
      colorTable: el.colorTable,
      totalPoints: 0,
    };
    if (el._id) {
      userToAdd.id = el._id;
    }

    newUsers.push(userToAdd);
  });
  return newUsers
};

export const renderP = (
  el: string,
  user: UsersType | null,
  fullMatch: MatchType | null
) => {
  let result = "";
  if (el === "HOME_TEAM") {
    result = translateTeamsName("H");
  } else if (el === "AWAY_TEAM") {
    result = translateTeamsName("A");
  } else if (el === "DRAW") {
    result = translateTeamsName("D");
  } else {
    result = "";
  }
  if (!user) {
    // if (
    //   fullMatch &&
    //   (fullMatch.status === "IN_PLAY" || fullMatch.status === "PAUSED")
    // ) {
    //   result = "?";
    // }
    return <span style={{}}>{result}</span>;
  } else {
    if (fullMatch) {
      let matchDate = new Date(fullMatch.utcDate);
      let now = new Date();
      let dif = matchDate.getTime() - now.getTime();
      if (result === "" && dif > 0 && fullMatch.winner === "") {
        result = "";
      } else if (dif > 0) {
        let winerByUser = (user.bets.find(x => x.matchId === fullMatch.id))?.winner

        if (fullMatch.score?.winner === null) {
          result = ""
        } else {
          result = "?";
        }
        if (winerByUser !== undefined) {
          result = "?"
        }
      }
    }
    return <span style={{}}>{result}</span>;
  }
};

export const renderP2 = (el: string, plainText = false) => {
  if (el === "") {
    return el
  }

  let result = renderP(el, null, null)
  if (typeof result === "object") {
    if (result.props.children && plainText) {
      return result.props.children
    }
    return result
  }

  if (plainText) {
    return result;
  }
  return <span style={{}}>{result}</span>;
};

export const getPoints = (newUsers: UsersType[], matches: MatchType[]) => {
  const getPointsForEvent = (selectedMatch: MatchType, user: UsersType) => {
    let bet = user.bets.find((el) => el.matchId === selectedMatch.id);
    let res = 0;

    if (bet) {
      const R1 = selectedMatch.homeTeamScore;
      const P1 = bet.homeTeamScore;

      const R2 = selectedMatch.awayTeamScore;
      const P2 = bet.awayTeamScore;

      const R3 = selectedMatch.winner;
      const P3 = bet.winner;

      if (
        R1 === undefined ||
        R2 === undefined ||
        P1 === undefined ||
        P2 === undefined
      ) {
        return res;
      }

      let difSM: number | undefined = R1 - R2;

      let difBet: number | undefined = P1 - P2;

      if (R1 === P1 && R2 === P2) {
        res = 3;
      } else if (difSM === difBet) {
        res = 2;
      } else if (
        (P1 > P2 && R1 > R2) ||
        (P1 === P2 && R1 === R2) ||
        (P1 < P2 && R1 < R2)
      ) {
        res = 1;
      }

      // Plus one point for winer in current match
      if (
        isGroup(selectedMatch) &&
        selectedMatch.status === "FINISHED" &&
        R3 === P3
      ) {
        // res += 1;
      }

      if (selectedMatch.group === "QUARTER_FINAL") {
        res *= coefficientQuarterFinal;
      } else if (selectedMatch.group === "SEMI_FINAL") {
        res *= coefficientSemiFinal;
      } else if (selectedMatch.group === "THIRD_PLACE") {
        res *= coefficientThirdPlace
      } else if (selectedMatch.group === "FINAL") {
        res *= coefficientFinal;
      }

      let betDate = new Date(bet.date);
      let matchDate = new Date(selectedMatch.utcDate);
      let diffTime = betDate.getTime() - matchDate.getTime();

      if (diffTime > 0) {
        res = res / 2;
      }
    }
    return res;
  };

  let res = newUsers.slice();

  for (let i = 0; i < res.length; i++) {
    let oneUser = res[i];
    let rowUserBets = oneUser.bets.slice()
    oneUser.totalPoints = 0
    for (let j = 0; j < oneUser.bets.length; j++) {
      let oneBet = oneUser.bets[j];
      let selectedMatch = matches.find((el) => el.id === oneBet.matchId);

      if (selectedMatch) {
        // if (selectedMatch && selectedMatch.status === "FINISHED") {
        let pointsForEvent = getPointsForEvent(selectedMatch, oneUser);
        oneUser.totalPoints = (oneUser.totalPoints || 0) + pointsForEvent;
        oneBet.point = pointsForEvent;
        // } else {
        //   oneBet.point = 0;
        // }
      }
    }
    const getMatchDate = (bet: any) => {
      let res = 0;
      let selectedMatch = matches.find((el) => el.id === bet.matchId);
      if (selectedMatch) res = new Date(selectedMatch?.utcDate).getTime();
      return res;
    };
    oneUser.bets.sort((a, b) => getMatchDate(a) - getMatchDate(b));

    if (compare(rowUserBets, oneUser.bets) === false) {
      axios({
        method: "POST",
        data: { bets: oneUser.bets },
        url: `/api/update?id=${oneUser.id}`,
      })
        .then((res) => { })
        .catch((err) => console.error(err));
    }
  }

  return res;
};

export const getAllFinalWinner = (users: UsersType[]) => {
  if (users.length === 0) {
    return;
  }
  let foo: any[] = [];
  users.forEach((user) => {
    foo.push({ name: user.name, finalWinner: user.finalWinner });
  });
};

export const stylingTable = (users: UsersType[], isFromNewBet?: Boolean) => {
  const getSelector1 = (index: number) => {
    let res = "";
    res += `tr:nth-child(1) > th:nth-child(${index + 7}), `;
    res += `tr:nth-child(2) > th:nth-child(${4 * index}), `;
    res += `tr:nth-child(2) > th:nth-child(${4 * index + 1}), `;
    res += `tr:nth-child(2) > th:nth-child(${4 * index + 2}), `;
    res += `tr:nth-child(2) > th:nth-child(${4 * index + 3}), `;
    res += `tr:nth-child(3) > th:nth-child(${index + (index - 1)}), `;
    res += `tr:nth-child(3) > th:nth-child(${index + index})`;

    return res;
  };

  const getSelector2 = (index: number) => {
    let result = "";

    for (let i = 4 * index - 4; i < 4 * index; i++) {
      result += `td:nth-child(${10 + i}), `;
    }

    result = result.slice(0, result.length - 2);

    return result;
  };

  for (let i = 0; i < users.length; i++) {
    let selector1 = getSelector1(i + 1);
    $(selector1).css(
      "background-color",
      `hsl(${users[i].colorTable}, 100%, 92%)`
    );

    let selector2 = getSelector2(i + 1);

    $(selector2).css("border-bottom", "1px solid");
    $(selector2).css("border-left", "1px solid");
    $(selector2).css("border-right", "1px solid");
    $(selector2).css("border-color", `hsl(${users[i].colorTable}, 100%, 50%)`);
  }

  const getForBorders = () => {
    let res = { sel3: "", sel4: "", sel5: "", sel6: "", sel7: "" };

    for (let i = 10; i < 36; i += 4) {
      res.sel3 += `td:nth-child(${i}), `;
    }

    for (let i = 10; i < ((users.length * 5) + 3); i += 1) {
      res.sel4 += `tr:nth-child(1) > td:nth-child(${i}), `;
      res.sel5 += `tr:nth-child(51) > td:nth-child(${i}), `;
    }

    for (let i = 8; i < 15; i += 1) {
      res.sel6 += `thead > tr:nth-child(1) > th:nth-child(${i}), `;
    }

    for (let i = 4; i < 50; i += 4) {
      res.sel7 += `thead > tr:nth-child(2) > th:nth-child(${i}), `;
    }

    res.sel3 = res.sel3.slice(0, res.sel3.length - 2);
    res.sel4 = res.sel4.slice(0, res.sel4.length - 2);
    res.sel5 = res.sel5.slice(0, res.sel5.length - 2);
    res.sel6 = res.sel6.slice(0, res.sel6.length - 2);
    res.sel7 = res.sel7.slice(0, res.sel7.length - 2);
    return res;
  };
  let borderSize = "2px solid hsl(0, 0%, 0%)";

  $(getForBorders().sel3).css("border-left", borderSize);
  $(`td:nth-child(${37})`).css("border-right", borderSize);
  $(getForBorders().sel4).css("border-top", borderSize);
  $(getForBorders().sel5).css("border-bottom", borderSize);
  $(getForBorders().sel6).css("border-top", borderSize);
  $(getForBorders().sel6).css("border-left", borderSize);
  $(getForBorders().sel7).css("border-left", borderSize);
  $(`thead > tr:nth-child(1) > th:nth-child(${14})`).css(
    "border-right",
    borderSize
  );
  $(`thead > tr:nth-child(2) > th:nth-child(31)`).css(
    "border-right",
    borderSize
  );

  $(`table > thead`).css("position", "sticky");
  $(`table > thead`).css("position", "-webkit-sticky");


  $(
    `#root > div:nth-child(2) > div:nth-child(2) > div.ant-table-wrapper > div > div > div > div > div > table > thead`
  ).css("top", "50px");

  $(
    `#root > div:nth-child(4) > div > div > div > div > div > div > div > div > table > thead`
  ).css("position", "sticky");

  $(
    `#root > div:nth-child(4) > div > div > div > div > div > div > div > div > table > thead`
  ).css("position", "-webkit-sticky");

  $(`table > thead`).css("top", `${$("#header").height()}px`);

  $(`table > thead`).css("z-index", "1");

  $(`#root > div:nth-child(3)`).css("display", "inline");

  $(`table > thead > tr:nth-child(1) > th:nth-child(4)`).css("min-width", "90px");

  $(`table > thead > tr:nth-child(1) > th`).css("text-align", "center")

  // Гост колумн
  $(`table > thead > tr:nth-child(1) > th:nth-child(7)`).css("min-width", "100px")

  // all padding (default 16px)
  $(`.ant-table-tbody>tr>td, .ant-table-thead>tr>th, .ant-table tfoot>tr>td, .ant-table tfoot>tr>th`).css("padding", "0.7em")


  $(`table > thead > tr:nth-child(2) > th`).css("text-align", "center")

  // Center text
  $(`table > tbody > tr:nth-child(1n) > td:nth-child(6), table > tbody > tr:nth-child(1n) > td:nth-child(7), table > tbody > tr:nth-child(1n) > td:nth-child(8)`).css("text-align", "center")

  $(`#newBetTable > div > div > div > div > div > div > div > div > table > thead > tr > th:nth-child(7)`).css("height", "6.9rem")

  // New bet table
  if (users.length > 0 && isFromNewBet) {
    $(`#oneMatchTable > div > div > table > thead > tr:nth-child(1) > th:nth-child(7)`).css("background-color", `hsl(${users[0].colorTable}, 100%, 92%)`)
    $(`#oneMatchTable > div > div > table > thead > tr:nth-child(2) > th:nth-child(1)`).css("background-color", `hsl(${users[0].colorTable}, 100%, 92%)`)
    $(`#oneMatchTable > div > div > table > thead > tr:nth-child(2) > th:nth-child(2)`).css("background-color", `hsl(${users[0].colorTable}, 100%, 92%)`)
    $(`#oneMatchTable > div > div > table > thead > tr:nth-child(2) > th:nth-child(3)`).css("background-color", `hsl(${users[0].colorTable}, 100%, 92%)`)

    $(`#oneMatchTable > div > div > table > thead > tr:nth-child(1) > th:nth-child(7)`).css("border-top", "2px solid black")
    $(`#oneMatchTable > div > div > table > thead > tr:nth-child(1) > th:nth-child(7)`).css("border-right", "2px solid black")
    $(`#oneMatchTable > div > div > table > thead > tr:nth-child(1) > th:nth-child(7)`).css("border-left", "2px solid black")

    $(`#oneMatchTable > div > div > table > thead > tr:nth-child(2) > th:nth-child(1)`).css("border-left", "2px solid black")
    $(`#oneMatchTable > div > div > table > thead > tr:nth-child(2) > th:nth-child(3)`).css("border-right", "2px solid black")

    $(`#oneMatchTable > div > div > table > tbody > tr:nth-child(1) > td:nth-child(8)`).css("border-left", "0px")

    for (let i = 7; i <= 10; i++) {
      $(`#newBetTable > div > div > div > div > div > div > div > div > table > tbody > tr > td:nth-child(${i})`).css("border-bottom", "1px solid");
      $(`#newBetTable > div > div > div > div > div > div > div > div > table > tbody > tr > td:nth-child(${i})`).css("border-left", "1px solid");
      $(`#newBetTable > div > div > div > div > div > div > div > div > table > tbody > tr > td:nth-child(${i})`).css("border-right", "1px solid");
      $(`#newBetTable > div > div > div > div > div > div > div > div > table > tbody > tr > td:nth-child(${i})`).css("border-color", `hsl(${users[0].colorTable}, 100%, 50%)`);
    }

    $(`#newBetTable > div > div > div > div > div > div > div > div > table > tbody > tr > td:nth-child(7)`).css("border-left", "2px solid black")
    $(`#newBetTable > div > div > div > div > div > div > div > div > table > tbody > tr > td:nth-child(9)`).css("border-right", "2px solid black")
  }

  for (let i = 10; i < 100; i++) {
    $(`#oneMatchTable > div > div > table > tbody > tr:nth-last-child(1) > td:nth-child(${i})`).css("border-bottom", "1px solid black")
  }
};

export const getDefSettings = () => {
  let showGroupsFromStorage = sessionStorage.getItem("showGroups")

  let showRound1FromStorage = sessionStorage.getItem("showRound1")
  let showRound2FromStorage = sessionStorage.getItem("showRound2")
  let showRound3FromStorage = sessionStorage.getItem("showRound3")

  let isEnglishFromStorage = sessionStorage.getItem("isEnglish")
  let filterGroupFromStorage = sessionStorage.getItem("filterGroup")

  let showGroups = showGroupsFromStorage === null ? true : showGroupsFromStorage === "true" ? true : false
  let showRound1 = showRound1FromStorage === null ? true : showRound1FromStorage === "true" ? true : false
  let showRound2 = showRound2FromStorage === null ? true : showRound2FromStorage === "true" ? true : false
  let showRound3 = showRound3FromStorage === null ? true : showRound3FromStorage === "true" ? true : false

  let isEnglish = isEnglishFromStorage === null ? false : isEnglishFromStorage === "true" ? true : false
  let filterGroup = filterGroupFromStorage || ""

  return { showGroups, showRound1, showRound2, showRound3, isEnglish, filterGroup }
}

export const setDefSettings = (settings: string, value: string) => {
  sessionStorage.setItem(settings, value)
}

export const getFinalStats = (afterThat: Function) => {
  var config: AxiosRequestConfig = {
    method: "GET",
    url: `https://api.football-data.org/${selectedApiVersion}/competitions/${selectedCompetition}/matches`,
    headers: {
      "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
    },
  };

  axios(config)
    .then(function (response) {
      let data: MatchType[] = response.data.matches;
      data = data.slice(0, data.length);
      let matches: MatchType[] = [];

      let onlyFinal: MatchType | undefined = undefined;

      data.forEach((el: MatchType, index) => {
        let score = el.score;

        let calculatedScore = calcScore(el, score);

        let matchToAdd: MatchType = {
          number: index + 1,
          key: matches.length || 0,
          id: el.id,
          homeTeam: el.homeTeam,
          awayTeam: el.awayTeam,
          utcDate: el.utcDate,
          group: el.group || el.stage,
          winner: score?.winner || "",
          homeTeamScore: calculatedScore.ht,
          awayTeamScore: calculatedScore.at,
          status: el.status,
          score: el.score,
        };

        if (el.stage === "FINAL") {
          onlyFinal = matchToAdd;
        }
      });
      afterThat(onlyFinal);
    })
    .catch((error) => console.error(error));
};

export const calcScore = (match: MatchType, score: any) => {
  let res: {
    ht: number | undefined;
    at: number | undefined;
  } = { ht: undefined, at: undefined };

  let ht = score?.fullTime?.homeTeam;
  let at = score?.fullTime?.awayTeam;
  if (ht !== null) {
    res.ht = score?.fullTime?.homeTeam;
  }
  if (at !== null) {
    res.at = score?.fullTime?.awayTeam;
  }

  if (res.ht !== undefined) {
    res.ht -= match.score?.extraTime.homeTeam || 0;
  }
  if (res.at !== undefined) {
    res.at -= match.score?.extraTime.awayTeam || 0;
  }

  if (res.ht !== undefined) {
    res.ht -= match.score?.penalties.homeTeam || 0;
  }
  if (res.at !== undefined) {
    res.at -= match.score?.penalties.awayTeam || 0;
  }

  return res;
};

export const calcRound = (match: MatchType) => {
  let round1 = {
    startDate: new Date("2022-11-20").getTime(),
    endDate: new Date("2022-11-24").getTime()
  }
  let round2 = {
    startDate: new Date("2022-11-25").getTime(),
    endDate: new Date("2022-11-28").getTime()
  }
  let round3 = {
    startDate: new Date("2022-11-29").getTime(),
    endDate: new Date("2022-12-02").getTime()
  }

  let matchDate = new Date((match.utcDate).toString().slice(0, 10)).getTime()
  let matchRound: number = -1
  if (matchDate >= round1.startDate && matchDate <= round1.endDate) {
    matchRound = 1
  } else if (matchDate >= round2.startDate && matchDate <= round2.endDate) {
    matchRound = 2
  } else if (matchDate >= round3.startDate && matchDate <= round3.endDate) {
    matchRound = 3
  }

  return `ROUND_${matchRound}`
}

export const getAllMatchesAsync = async () => {
  console.log("get from APi")
  var config: AxiosRequestConfig = {
    method: "GET",
    url: `https://api.football-data.org/${selectedApiVersion}/competitions/${selectedCompetition}/matches`,
    headers: {
      "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
    },
  };

  let response = await axios(config)

  let data: MatchType[] = response.data.matches;
  data = data.slice(0, data.length);
  let matches: MatchType[] = [];

  data.forEach((el: MatchType, index) => {
    let score = el.score;

    let calculatedScore = calcScore(el, score);

    let calculatedRound = calcRound(el)

    let matchToAdd: MatchType = {
      number: index + 1,
      key: matches.length || 0,
      id: el.id,
      homeTeam: el.homeTeam,
      awayTeam: el.awayTeam,
      utcDate: el.utcDate,
      group: el.group || el.stage,
      winner: score?.winner || "",
      homeTeamScore: calculatedScore.ht,
      awayTeamScore: calculatedScore.at,
      status: el.status,
      score: el.score,
      round: calculatedRound
    };
    matches.push(matchToAdd);
  });
  return matches
}

export const getAllTeams = (setTeams: Function) => {
  var config: AxiosRequestConfig = {
    method: "GET",
    url: `https://api.football-data.org/${selectedApiVersion}/competitions/${selectedCompetition}/teams`,
    headers: {
      "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
    },
  };

  axios(config)
    .then(function (response) {
      let data: any[] = response.data.teams
      let teams: { name: string, flag: string }[] = data.map((el: any) => ({ name: el.name, flag: el.crestUrl }))
      setTeams(teams);
    })
    .catch((error) => console.error(error));
};
