import * as React from "react";

import classes from "./SplitPaneContainer.module.css";

interface SplitPaneProps {
  width: number;
  children: React.ReactNode;
}

export const SplitPane = (props: SplitPaneProps) => {
  return (
    <div role="article" style={{ width: props.width }} className={classes.pane}>
      {props.children}
    </div>
  );
};
