import * as React from "react";

import { render, screen, fireEvent } from "@testing-library/react";

import { SplitPaneContainer } from "../SplitPaneContainer";

describe("<SplitPaneContainer />", () => {
  test("should render resizable handle", () => {
    render(<SplitPaneContainer />);
    expect(screen.getAllByRole("separator")).toBeTruthy();
  });
  test("should render panel with width style set", () => {
    render(<SplitPaneContainer />);

    fireEvent.click(screen.getByRole("separator"));

    expect(screen.getAllByRole("article")[0]).toHaveStyle("width:0px");
  });
});
