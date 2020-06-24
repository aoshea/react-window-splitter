import React from "react";

import { Dimension, UseDimensions } from "./types";

const defaultDim: Dimension = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

export function useDimensions(): UseDimensions {
  const [dim, setDim] = React.useState(defaultDim);

  const ref = React.useCallback(ref => {
    if (ref) {
      const rect = ref.getBoundingClientRect();
      setDim({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      });
    }
    return null;
  }, []);

  return [ref, dim];
}
