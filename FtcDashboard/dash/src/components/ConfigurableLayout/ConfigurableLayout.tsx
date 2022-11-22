import React, { ReactElement, useState, useEffect, useRef } from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { ConfigurableView } from '../../enums/ConfigurableView';
import GraphView from '../views/GraphView/GraphView';
import FieldView from '../views/FieldView/FieldView';
import ConfigView from '../views/ConfigView/ConfigView';
import TelemetryView from '../views/TelemetryView';
import CameraView from '../views/CameraView';
import OpModeView from '../views/OpModeView';

import RadialFab from './RadialFab/RadialFab';
import RadialFabChild from './RadialFab/RadialFabChild';
import ViewPicker from './ViewPicker';

import useMouseIdleListener from '../../hooks/useMouseIdleListener';
import useUndoHistory from '../../hooks/useUndoHistory';

import { ReactComponent as AddIcon } from '../../assets/icons/add.svg';
import { ReactComponent as DeleteSweepIcon } from '../../assets/icons/delete_sweep.svg';
import { ReactComponent as DeleteXIcon } from '../../assets/icons/delete_x.svg';
import LockIconURL from '../../assets/icons/lock.svg';
import { ReactComponent as RemoveCircleIcon } from '../../assets/icons/remove_circle.svg';
import { ReactComponent as RemoveCircleOutlineIcon } from '../../assets/icons/remove_circle_outline.svg';
import CreateIconURL from '../../assets/icons/create.svg';
import LoggingView from '../views/LoggingView/LoggingView';

function maxArray(a: number[], b: number[]) {
  if (a.length !== b.length) {
    throw new Error('cannot compare arrays with different lengths');
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] > b[i]) {
      return a;
    } else if (b[i] > a[i]) {
      return b;
    }
  }
  return a;
}

function intervalsIntersect([a, b]: number[], [c, d]: number[]) {
  return Math.max(a, c) < Math.min(b, d);
}

const VIEW_MAP: { [key in ConfigurableView]: ReactElement } = {
  [ConfigurableView.FIELD_VIEW]: <FieldView />,
  [ConfigurableView.GRAPH_VIEW]: <GraphView />,
  [ConfigurableView.CONFIG_VIEW]: <ConfigView />,
  [ConfigurableView.TELEMETRY_VIEW]: <TelemetryView />,
  [ConfigurableView.CAMERA_VIEW]: <CameraView />,
  [ConfigurableView.OPMODE_VIEW]: <OpModeView />,
  [ConfigurableView.LOGGING_VIEW]: <LoggingView />,
};

const LOCAL_STORAGE_LAYOUT_KEY = 'configurableLayoutStorage';

const GRID_COL = 12;
const GRID_ROW_HEIGHT = 60;
const GRID_MARGIN = 10;
const GRID_ITEM_MIN_WIDTH = 3;
const GRID_DOT_PADDING = 10;

const ReactGridLayout = WidthProvider(RGL);

const Container = styled.div.attrs<{ isLayoutLocked: boolean }>(
  ({ isLayoutLocked }) => ({
    className: `${
      !isLayoutLocked ? 'bg-gray-100' : 'bg-white'
    } p-2 transition-colors`,
  }),
)<{ isLayoutLocked: boolean; bgGridSize: number }>`
  position: relative;

  height: calc(100vh - 52px);

  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 1em;

  background-image: ${(props) =>
    !props.isLayoutLocked
      ? `radial-gradient(#94a3b8 calc((0.5rem + ${GRID_DOT_PADDING}px) - 17px), transparent 0)`
      : ''};
  background-size: ${(props) => `${props.bgGridSize}px  ${props.bgGridSize}px`};
  background-position: ${`calc(0.5rem + ${GRID_DOT_PADDING}px) calc(0.5rem + ${GRID_DOT_PADDING}px - 5px)`};
`;

type GridItem = {
  id: string;
  view: ConfigurableView;
  layout: GridItemLayout;
};

type GridItemLayout = {
  x: number;
  y: number;
  w: number;
  h: number;
  minW: number;
  isDraggable: boolean;
  isResizable: boolean;
};

const HEIGHT_BREAKPOINTS = {
  MEDIUM: 730,
  TALL: 1200,
};

const DEFAULT_GRID: GridItem[] = [
  {
    id: uuidv4(),
    view: ConfigurableView.FIELD_VIEW,
    layout: {
      x: 0,
      y: 0,
      w: 4,
      h: 9,
      minW: GRID_ITEM_MIN_WIDTH,
      isDraggable: true,
      isResizable: true,
    },
  },
  {
    id: uuidv4(),
    view: ConfigurableView.GRAPH_VIEW,
    layout: {
      x: 4,
      y: 0,
      w: 4,
      h: 9,
      minW: GRID_ITEM_MIN_WIDTH,
      isDraggable: true,
      isResizable: true,
    },
  },
  {
    id: uuidv4(),
    view: ConfigurableView.CONFIG_VIEW,
    layout: {
      x: 8,
      y: 0,
      w: 4,
      h: 7,
      minW: GRID_ITEM_MIN_WIDTH,
      isDraggable: true,
      isResizable: true,
    },
  },
  {
    id: uuidv4(),
    view: ConfigurableView.TELEMETRY_VIEW,
    layout: {
      x: 8,
      y: 7,
      w: 4,
      h: 2,
      minW: GRID_ITEM_MIN_WIDTH,
      isDraggable: true,
      isResizable: true,
    },
  },
];

const DEFAULT_GRID_MEDIUM: GridItem[] = [
  {
    id: uuidv4(),
    view: ConfigurableView.FIELD_VIEW,
    layout: {
      x: 0,
      y: 0,
      w: 4,
      h: 13,
      minW: GRID_ITEM_MIN_WIDTH,
      isDraggable: true,
      isResizable: true,
    },
  },
  {
    id: uuidv4(),
    view: ConfigurableView.GRAPH_VIEW,
    layout: {
      x: 4,
      y: 0,
      w: 4,
      h: 13,
      minW: GRID_ITEM_MIN_WIDTH,
      isDraggable: true,
      isResizable: true,
    },
  },
  {
    id: uuidv4(),
    view: ConfigurableView.CONFIG_VIEW,
    layout: {
      x: 8,
      y: 0,
      w: 4,
      h: 11,
      minW: GRID_ITEM_MIN_WIDTH,
      isDraggable: true,
      isResizable: true,
    },
  },
  {
    id: uuidv4(),
    view: ConfigurableView.TELEMETRY_VIEW,
    layout: {
      x: 8,
      y: 11,
      w: 4,
      h: 2,
      minW: GRID_ITEM_MIN_WIDTH,
      isDraggable: true,
      isResizable: true,
    },
  },
];

const DEFAULT_GRID_TALL: GridItem[] = [
  {
    id: uuidv4(),
    view: ConfigurableView.FIELD_VIEW,
    layout: {
      x: 0,
      y: 0,
      w: 4,
      h: 18,
      minW: GRID_ITEM_MIN_WIDTH,
      isDraggable: true,
      isResizable: true,
    },
  },
  {
    id: uuidv4(),
    view: ConfigurableView.GRAPH_VIEW,
    layout: {
      x: 4,
      y: 0,
      w: 4,
      h: 18,
      minW: GRID_ITEM_MIN_WIDTH,
      isDraggable: true,
      isResizable: true,
    },
  },
  {
    id: uuidv4(),
    view: ConfigurableView.CONFIG_VIEW,
    layout: {
      x: 8,
      y: 0,
      w: 4,
      h: 14,
      minW: GRID_ITEM_MIN_WIDTH,
      isDraggable: true,
      isResizable: true,
    },
  },
  {
    id: uuidv4(),
    view: ConfigurableView.TELEMETRY_VIEW,
    layout: {
      x: 8,
      y: 11,
      w: 4,
      h: 4,
      minW: GRID_ITEM_MIN_WIDTH,
      isDraggable: true,
      isResizable: true,
    },
  },
];

export default function ConfigurableLayout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);

  const [isLayoutLocked, setIsLayoutLocked] = useState(true);
  const [isInDeleteMode, setIsInDeleteMode] = useState(false);
  const [isShowingViewPicker, setIsShowingViewPicker] = useState(false);

  const [gridBgSize, setGridBgSize] = useState(40);

  const [
    gridItems,
    {
      initialize: initializeGrid,
      append: setGrid,
      undo: undoGrid,
      redo: redoGrid,
    },
  ] = useUndoHistory<GridItem[]>([]);

  const isFabIdle = useMouseIdleListener({
    bottom: '0',
    right: '0',
    width: '14em',
    height: '13em',
  });

  useEffect(() => {
    const containerResizerObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        if (gridWrapperRef.current) {
          for (const entry of entries) {
            if (entry.target === gridWrapperRef.current) {
              const width =
                gridWrapperRef.current.clientWidth - 2 * GRID_DOT_PADDING;
              setGridBgSize(
                width / ((GRID_COL / 4) * Math.floor(width / 300) + 1) / 3,
              );
            }
          }
        }
      },
    );

    if (gridWrapperRef.current !== null)
      containerResizerObserver.observe(gridWrapperRef.current);

    return () => {
      containerResizerObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const initialLayoutStorageValue = window.localStorage.getItem(
      LOCAL_STORAGE_LAYOUT_KEY,
    );

    const newGridItems = (() => {
      if (initialLayoutStorageValue !== null) {
        return JSON.parse(initialLayoutStorageValue) as GridItem[];
      } else {
        // This assumes that containerRef isn't null on render
        // This works completely fine now as containerRef is set
        // Right now refs are guaranteed to be set before componentDidMount
        // https://stackoverflow.com/a/50019873/3360147
        // However, I don't know if this works with concurrent mode
        // Refs aren't very safe in concurrent mode
        // This project doesn't use concurrent mode since it's in beta
        // Check back here if concurrent mode is ever enabled
        // Solution then is to use something like useCallback similar to the useDelayedTooltip hook
        const height = containerRef.current?.clientHeight;

        if (height) {
          if (height > HEIGHT_BREAKPOINTS.TALL) {
            return DEFAULT_GRID_TALL;
          } else if (height > HEIGHT_BREAKPOINTS.MEDIUM) {
            return DEFAULT_GRID_MEDIUM;
          } else {
            return DEFAULT_GRID;
          }
        } else {
          return DEFAULT_GRID;
        }
      }
    })();

    newGridItems.forEach((e) => {
      e.layout.isResizable = false;
      e.layout.isDraggable = false;
    });

    initializeGrid(newGridItems);
  }, [initializeGrid]);

  useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => {
      if (!isLayoutLocked) {
        if (navigator.platform.indexOf('Mac') > -1) {
          if (e.metaKey && e.key === 'z') {
            if (e.shiftKey) {
              redoGrid();
            } else {
              undoGrid();
            }
          } else {
            if (e.ctrlKey && e.key === 'z') {
              undoGrid();
            } else if (e.ctrlKey && e.key === 'y') {
              redoGrid();
            }
          }
        }
      }
    };

    document.addEventListener('keydown', keyDownListener);

    return () => {
      document.removeEventListener('keydown', keyDownListener);
    };
  }, [isLayoutLocked, undoGrid, redoGrid]);

  useEffect(() => {
    window.localStorage.setItem(
      LOCAL_STORAGE_LAYOUT_KEY,
      JSON.stringify([...gridItems]),
    );
  }, [gridItems]);

  const addItem = (item: ConfigurableView) => {
    const ITEM_WIDTH = 4;
    const ITEM_HEIGHT = 4;

    // find the bottom, right grid item and tentatively place the new item to its right with bottoms aligned
    let [newItemBotMin, newItemLeft] = gridItems
      .map((e) => [e.layout.y + e.layout.h, e.layout.x + e.layout.w])
      .reduce(maxArray, [0, 0]);

    // if this placement puts the new item off the screen, push it to the row below
    if (newItemLeft + ITEM_WIDTH > GRID_COL) {
      newItemLeft = 0;
      newItemBotMin += ITEM_HEIGHT;
    }

    // find the minimum top for the new item to avoid intersecting items above
    const newItemTopMin = gridItems
      .filter((e) =>
        intervalsIntersect(
          [newItemLeft, newItemLeft + ITEM_WIDTH],
          [e.layout.x, e.layout.x + e.layout.w],
        ),
      )
      .map((e) => e.layout.y + e.layout.h)
      .reduce((bottom, acc) => Math.max(bottom, acc), 0);

    // adjust the original new item bottom if necessary given the minimum top
    const newItemTop = Math.max(newItemBotMin - ITEM_HEIGHT, newItemTopMin);

    setGrid([
      ...gridItems,
      {
        id: uuidv4(),
        view: item,
        layout: {
          x: newItemLeft,
          y: newItemTop,
          w: ITEM_WIDTH,
          h: ITEM_HEIGHT,
          minW: GRID_ITEM_MIN_WIDTH,
          isDraggable: !isLayoutLocked,
          isResizable: !isLayoutLocked,
        },
      },
    ]);
  };

  const removeItem = (id: string) => {
    setGrid(gridItems.filter((e) => e.id !== id));
  };

  const clickFAB = () => {
    const toBeLocked = !isLayoutLocked;

    setIsLayoutLocked(toBeLocked);
    setGrid(
      gridItems.map((i) => {
        i.layout = {
          ...i.layout,
          isResizable: !toBeLocked,
          isDraggable: !toBeLocked,
        };
        return i;
      }),
    );

    if (toBeLocked) {
      setIsShowingViewPicker(false);
      setIsInDeleteMode(false);
    }
  };

  const onLayoutChange = (layout: Layout[]) => {
    const newGrid = gridItems.map((e) => {
      const newLayoutValue = layout.find((item) => item.i === e.id);
      if (newLayoutValue != null) {
        const newLayout = {
          x: newLayoutValue.x,
          y: newLayoutValue.y,
          w: newLayoutValue.w,
          h: newLayoutValue.h,
          minW: newLayoutValue.minW ?? GRID_ITEM_MIN_WIDTH,
          isDraggable: newLayoutValue.isDraggable ?? true,
          isResizable: newLayoutValue.isResizable ?? true,
        };

        e = { ...e, layout: newLayout };
      }

      return e;
    });

    setGrid(newGrid);
  };

  return (
    <Container
      ref={containerRef}
      isLayoutLocked={isLayoutLocked}
      bgGridSize={gridBgSize}
    >
      {gridItems.length === 0 && (
        <div
          className={`text-center mt-16 p-12 transition-colors ${
            isLayoutLocked ? 'bg-white' : 'bg-gray-100'
          }`}
        >
          <h3 className="text-2xl">Your custom layout is empty!</h3>
          <p className="mt-3 text-gray-600">
            Press the floating pencil icon near the bottom right
            <br />
            and then click the green plus button to create your own layouts!
          </p>
        </div>
      )}
      <div ref={gridWrapperRef}>
        <ReactGridLayout
          className="layout"
          cols={GRID_COL}
          resizeHandles={['se']}
          draggableHandle=".grab-handle"
          compactType={null}
          rowHeight={
            isLayoutLocked ? GRID_ROW_HEIGHT + GRID_MARGIN : GRID_ROW_HEIGHT
          }
          layout={gridItems.map((item) => ({ i: item.id, ...item.layout }))}
          onLayoutChange={onLayoutChange}
          margin={isLayoutLocked ? [0, 0] : [GRID_MARGIN, GRID_MARGIN]}
        >
          {gridItems.map((item) => (
            <div key={item.id}>
              {React.cloneElement(VIEW_MAP[item.view], {
                isDraggable: item.layout.isDraggable,
                isUnlocked: !isLayoutLocked,
              })}
              <div
                className={`absolute top-0 left-0 w-full h-full bg-yellow-300 bg-opacity-50 flex-center rounded transition ${
                  isInDeleteMode
                    ? 'pointer-events opacity-100'
                    : 'pointer-events-none opacity-0'
                }`}
              >
                <button
                  className="p-4 bg-opacity-50 border-4 border-yellow-600 rounded-full opacity-50 focus:outline-none focus:ring focus:ring-yellow-800"
                  onClick={() => {
                    removeItem(item.id);
                  }}
                  disabled={!isInDeleteMode}
                >
                  <DeleteXIcon className="w-20 h-20 text-yellow-600" />
                </button>
              </div>
            </div>
          ))}
        </ReactGridLayout>
      </div>
      <RadialFab
        width="4em"
        height="4em"
        bottom="2em"
        right="3.5em"
        isOpen={!isLayoutLocked}
        isShowing={!(isFabIdle && isLayoutLocked)}
        clickEvent={clickFAB}
        icon={!isLayoutLocked ? LockIconURL : CreateIconURL}
        customClassName={`${
          !isLayoutLocked
            ? `bg-gray-500 focus:ring-4 focus:ring-gray-600 shadow-md shadow-gray-900/30 hover:shadow-lg hover:shadow-gray-900/50`
            : `bg-red-500 focus:ring-4 focus:ring-red-600 shadow-md shadow-red-500/40 hover:shadow-lg hover:shadow-red-500/60`
        }`}
      >
        <RadialFabChild
          customClass="w-12 h-12 bg-green-500 border border-green-600 shadow-md shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/50 focus:ring focus:ring-green-600"
          angle={(-80 * Math.PI) / 180}
          openMargin="5em"
          fineAdjustIconX="2%"
          fineAdjustIconY="2%"
          toolTipText="Add Item"
          clickEvent={() => setIsShowingViewPicker(!isShowingViewPicker)}
        >
          <AddIcon className="w-6 h-6 text-white" />
        </RadialFabChild>
        <RadialFabChild
          customClass={`w-12 h-12 border shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/50 focus:ring ${
            isInDeleteMode
              ? 'bg-orange-500 border-yellow-600 focus:ring-amber-300'
              : 'bg-amber-500 border-amber-600 focus:ring-orange-300'
          }`}
          angle={(-135 * Math.PI) / 180}
          openMargin="5em"
          fineAdjustIconX="0"
          fineAdjustIconY="0"
          toolTipText="Delete Item"
          clickEvent={() => setIsInDeleteMode(!isInDeleteMode)}
        >
          {isInDeleteMode ? (
            <RemoveCircleOutlineIcon className="w-5 h-5" />
          ) : (
            <RemoveCircleIcon className="w-5 h-5" />
          )}
        </RadialFabChild>
        <RadialFabChild
          customClass="w-12 h-12 bg-indigo-500 border border-indigo-600 shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/50 focus:ring focus:ring-indigo-300"
          angle={(170 * Math.PI) / 180}
          openMargin="5em"
          fineAdjustIconX="8%"
          fineAdjustIconY="-2%"
          toolTipText="Clear Layout"
          clickEvent={() => setGrid([])}
        >
          <DeleteSweepIcon className="w-5 h-5" />
        </RadialFabChild>
      </RadialFab>
      <ViewPicker
        isOpen={isShowingViewPicker}
        bottom="13em"
        right="1.5em"
        clickEvent={addItem}
      />
    </Container>
  );
}
