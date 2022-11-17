import axios, { AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";
import { selectedCompetition, selectedApiVersion } from "../../App";
import { calcScore, MatchType } from "../../helpers/OtherHelpers";
import OneMatchInScheme from "./OneMatchInScheme";
import Separator from "./separator.svg";

export default function Scheme() {
  const [matches, setMatches] = useState<MatchType[]>([]);

  useEffect(() => {
    getAllMatches();
  }, []);

  const getAllMatches = () => {
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
        data = data.slice(0, data.length)
        let matches: MatchType[] = [];

        data.forEach((el: any, index) => {
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
          if ((matchToAdd.group || "").indexOf("Group") === -1) {
            matches.push(matchToAdd);
          }
        });

        setMatches(matches);
      })
      .catch((error) => console.error(error));
  };

  if (matches.length === 0) {
    return null;
  }

  const renderLast16 = () => {
    let matchesIn16 = matches.filter((match) => match.group === "LAST_16");

    return (
      <div>
        <OneMatchInScheme match={matchesIn16[0]} /> {/* 1 */}
        <OneMatchInScheme match={matchesIn16[1]} /> {/* 2 */}
        <OneMatchInScheme match={matchesIn16[4]} /> {/* 3 */}
        <OneMatchInScheme match={matchesIn16[5]} /> {/* 4 */}
        <OneMatchInScheme match={matchesIn16[2]} /> {/* 5 */}
        <OneMatchInScheme match={matchesIn16[3]} /> {/* 6 */}
        <OneMatchInScheme match={matchesIn16[6]} /> {/* 7 */}
        <OneMatchInScheme match={matchesIn16[7]} /> {/* 8 */}
      </div>
    );
  };

  const renderLast8 = () => {
    let matchesIn8 = matches.filter((match) => (match.group === "QUARTER_FINAL") || (match.group === "QUARTER_FINALS"));

    return (
      <div>
        <div style={{ marginTop: "18.8%" }}>
          <OneMatchInScheme match={matchesIn8[1]} /> {/* 1 */}
        </div>
        <div style={{ marginTop: "38%" }}>
          <OneMatchInScheme match={matchesIn8[0]} /> {/* 2 */}
        </div>
        <div style={{ marginTop: "38%" }}>
          <OneMatchInScheme match={matchesIn8[3]} /> {/* 3 */}
        </div>
        <div style={{ marginTop: "38%" }}>
          <OneMatchInScheme match={matchesIn8[2]} /> {/* 4 */}
        </div>
      </div>
    );
  };

  const renderLast4 = () => {
    let matchesIn8 = matches.filter((match) => (match.group === "SEMI_FINAL") || (match.group === "SEMI_FINALS"));

    return (
      <div>
        <div style={{ marginTop: "55.5%" }}>
          <OneMatchInScheme match={matchesIn8[0]} /> {/* 1 */}
        </div>
        <div style={{ marginTop: "112.5%" }}>
          <OneMatchInScheme match={matchesIn8[1]} /> {/* 2 */}
        </div>
      </div>
    );
  };

  const renderLast2 = () => {
    let matchesIn24 = matches.filter((match) => match.group === "FINAL");

    return (
      <div style={{ height: "680px" }}>
        <div style={{ marginTop: "129%" }}>
          <OneMatchInScheme match={matchesIn24[0]} /> {/* 1 */}
        </div>
      </div>
    );
  };

  const returnSeparator16 = () => {
    let width = "60px";
    let height = "83px";
    return (
      <div
        style={{
          marginTop: "10.3%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src={Separator}
          alt="Separator"
          style={{ height: height, width: width, objectFit: "fill" }}
        />
        <img
          style={{
            marginTop: "80px",
            height: height,
            width: width,
            objectFit: "fill",
          }}
          src={Separator}
          alt="Separator"
        />
        <img
          style={{
            marginTop: "80px",
            height: height,
            width: width,
            objectFit: "fill",
          }}
          src={Separator}
          alt="Separator"
        />
        <img
          style={{
            marginTop: "80px",
            height: height,
            width: width,
            objectFit: "fill",
          }}
          src={Separator}
          alt="Separator"
        />
      </div>
    );
  };

  const returnSeparator8 = () => {
    return (
      <div
        style={{
          marginTop: "18.5%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src={Separator}
          alt="Separator"
          style={{ height: "164.5px", width: "120px", objectFit: "cover" }}
        />
        <img
          src={Separator}
          alt="Separator"
          style={{
            marginTop: "161.1px",
            height: "164.5px",
            width: "120px",
            objectFit: "cover",
          }}
        />
      </div>
    );
  };

  const returnSeparator4 = () => {
    return (
      <div
        style={{
          marginTop: "34.5%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src={Separator}
          alt="Separator"
          style={{ height: "330px", objectFit: "unset" }}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        margin: 10,
        width: "500px",
        display: "flex",
      }}
    >
      {renderLast16()}
      {returnSeparator16()}
      {renderLast8()}
      {returnSeparator8()}
      {renderLast4()}
      {returnSeparator4()}
      {renderLast2()}
    </div>
  );
}
