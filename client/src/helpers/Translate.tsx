let teams = require("./teams.json");

export const translateTeamsName = (team: string): string => {
  let teamsToShow: string = teams[team];
  if ((team || "").toLocaleLowerCase().indexOf("group") > -1) {
    let teamNameArr = team.split("_");
    if (teamNameArr.length === 1) {
      teamNameArr = team.split(" ");
      if (teamNameArr[0] === "Group") {
        teamNameArr[0] = "GROUP"
      }
    }
    teamsToShow = `${teams[teamNameArr[0]]} ${teamNameArr[1]}`;
  }
  return teamsToShow ? teamsToShow : team;
};
