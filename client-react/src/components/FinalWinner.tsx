import React from "react";
import { UsersType } from "../helpers/OtherHelpers";
import { translateTeamsName } from "../helpers/Translate";

export default function FinalWiner({ users, }: { users: UsersType[]; }) {
    const getOneWiner = (user: UsersType) => {
        return `${translateTeamsName(user.name)} - ${translateTeamsName(user.finalWinner)}`
    }

    const getAllUsers = (): JSX.Element => {
        return (
            <span>
                {users.sort((a, b) => b.totalPoints - a.totalPoints).map((user, index) => {
                    return (
                        <React.Fragment key={index}>
                            <span style={{ backgroundColor: `hsl(${user?.colorTable || "50"}, 100%, 92%)` }}>{getOneWiner(user)}</span>
                            {index < users.length - 1 && <span>; </span>}
                        </React.Fragment>
                    )
                })}
            </span>
        );
    };

    return (
        <div>
            <p>{translateTeamsName("Bet final winner")}: {getAllUsers()}</p>
        </div>
    )
}