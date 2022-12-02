
import React, { useEffect } from "react";
import { useGlobalState } from "../GlobalStateProvider";

export default function TestGlobalState() {
  const { state, setState } = useGlobalState();

  useEffect(() => {
    if (state === undefined) {
      return undefined
    }
    if (state.matches === undefined) {
      return undefined
    }
    console.log("state", state.matches.length)
  }, [state])

  useEffect(() => {
    setTimeout(() => {
      setState({ matches: [] })
    }, 1000)
  }, [setState])

  return <div>
    <p>hi from globalState</p>
    <p>{state?.matches?.length}</p>
  </div>
}