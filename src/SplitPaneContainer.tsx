import * as React from "react";

import { useDimensions } from "./useDimensions";
import { SplitPane } from "./SplitPane";

import classes from "./SplitPaneContainer.module.css";

interface Point {
  x: number;
  y: number;
}

enum ActionTypes {
  Offset = "Offset",
  PinPoint = "PinPoint",
  DragStart = "DragStart",
  DragEnd = "DragEnd"
}

interface OffsetAction {
  type: ActionTypes.Offset;
  payload: Point;
}

interface DragStartAction {
  type: ActionTypes.DragStart;
}

interface DragEndAction {
  type: ActionTypes.DragEnd;
}

interface PinPointAction {
  type: ActionTypes.PinPoint;
  payload: Point;
}

type SplitPanelAction =
  | OffsetAction
  | DragStartAction
  | DragEndAction
  | PinPointAction;

type SplitPanelState = {
  offsetPoint: Point;
  prevOffsetPoint: Point;
  pinPoint: Point;
  dragging: boolean;
};

function reducer(
  state: SplitPanelState,
  action: SplitPanelAction
): SplitPanelState {
  switch (action.type) {
    case ActionTypes.Offset:
      return {
        ...state,
        offsetPoint: action.payload
      };
    case ActionTypes.PinPoint:
      return {
        ...state,
        pinPoint: action.payload,
        prevOffsetPoint: {
          x: state.offsetPoint.x,
          y: state.offsetPoint.y
        }
      };
    case ActionTypes.DragStart:
      return {
        ...state,
        dragging: true
      };
    case ActionTypes.DragEnd:
      return {
        ...state,
        dragging: false
      };
    default:
      throw new Error();
  }
}

const initialState: SplitPanelState = {
  offsetPoint: { x: 0, y: 0 },
  prevOffsetPoint: { x: 0, y: 0 },
  pinPoint: { x: 0, y: 0 },
  dragging: false
};

export const SplitPaneContainer = () => {
  const [ref, dim] = useDimensions();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const panelWidths = React.useMemo(() => {
    const widthA = dim.width * 0.5 + state.offsetPoint.x;
    const widthB = dim.width * 0.5 - state.offsetPoint.x;
    return [widthA, widthB];
  }, [dim.width, state.offsetPoint]);

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const point: Point = {
        x: event.clientX - dim.x,
        y: event.clientY - dim.y
      };

      dispatch({
        type: ActionTypes.PinPoint,
        payload: point
      });

      dispatch({
        type: ActionTypes.DragStart
      });
    },
    [dispatch, dim.x, dim.y]
  );

  const handleMouseMove = React.useCallback(
    (event: MouseEvent) => {
      if (!state.dragging) {
        return null;
      }

      const point: Point = {
        x: event.clientX - dim.x,
        y: event.clientY - dim.y
      };

      const offsetPoint: Point = {
        x: state.prevOffsetPoint.x + point.x - state.pinPoint.x,
        y: 0
      };

      dispatch({
        type: ActionTypes.Offset,
        payload: offsetPoint
      });
    },
    [dim.x, dim.y, state.pinPoint, state.prevOffsetPoint, state.dragging]
  );

  const handleMouseUp = React.useCallback(
    (event: MouseEvent) => {
      if (state.dragging) {
        dispatch({
          type: ActionTypes.DragEnd
        });
      }
    },
    [state.dragging]
  );

  React.useEffect(() => {
    if (state.dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [state.dragging]);

  return (
    <div ref={ref} className={classes.container}>
      <SplitPane width={panelWidths[0]}>
        <h1>Lorem ipsum1</h1>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo.
        </p>
      </SplitPane>
      <div
        role="separator"
        onMouseDown={handleMouseDown}
        className={classes.handle}
      >
        <div className={classes.track}></div>
      </div>
      <SplitPane width={panelWidths[1]}>
        <h1>Lorem ipsum</h1>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo.
        </p>
        <ul>
          <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
          <li>Aliquam tincidunt mauris eu risus.</li>
          <li>Vestibulum auctor dapibus neque.</li>
        </ul>
      </SplitPane>
    </div>
  );
};
