import { useEffect, useRef, useState } from "react";
import gitInfo from "./gitInfo.json";

const GitInfo = () => {
  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        bottom: 0,
        background: "white",
        color: "black",
        fontSize: 13,
        lineHeight: 1.2,
      }}
    >
      Under construction
      <br />
      <a href="https://github.com/constraint-systems/portal" target="_blank">
        {gitInfo.lastCommit}
      </a>
    </div>
  );
};

export default GitInfo;
