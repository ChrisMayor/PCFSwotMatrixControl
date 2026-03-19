import * as React from 'react';
import { useStyles } from './SwotMatrixControl.styles';
import {
  QuadrantKey,
  SwotData,
  ISwotMatrixProps,
  DragState,
  generateId,
} from './SwotMatrixControl.types';
import { SwotQuadrant } from './SwotQuadrant';

export type { QuadrantKey, SwotData, ISwotMatrixProps };

type NewTextsState = Record<QuadrantKey, string>;

const QUADRANTS: QuadrantKey[] = ['strengths', 'weaknesses', 'opportunities', 'threats'];

const createEmptyNewTexts = (): NewTextsState => ({
  strengths: '',
  weaknesses: '',
  opportunities: '',
  threats: '',
});

export const SwotMatrix: React.FC<ISwotMatrixProps> = ({ swotData, onDataChanged, disabled }) => {
  const styles = useStyles();

  const [data, setData] = React.useState<SwotData>(() => SwotData.parse(swotData));
  const [newTexts, setNewTexts] = React.useState<NewTextsState>(createEmptyNewTexts);
  const [dragState, setDragState] = React.useState<DragState>(null);
  const [dragOverQuadrant, setDragOverQuadrant] = React.useState<QuadrantKey | null>(null);
  const [dragOverItemId, setDragOverItemId] = React.useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setData(SwotData.parse(swotData));
  }, [swotData]);

  const resetDragState = React.useCallback(() => {
    setDragState(null);
    setDragOverQuadrant(null);
    setDragOverItemId(null);
  }, []);

  const updateData = React.useCallback(
    (nextData: SwotData) => {
      setData(nextData);
      onDataChanged(JSON.stringify(nextData));
    },
    [onDataChanged],
  );

  const moveItemBetweenQuadrants = React.useCallback(
    (fromQuadrant: QuadrantKey, toQuadrant: QuadrantKey, itemId: string) => {
      const item = data[fromQuadrant].find((entry) => entry.id === itemId);
      if (!item) {
        return;
      }

      updateData({
        ...data,
        [fromQuadrant]: data[fromQuadrant].filter((entry) => entry.id !== itemId),
        [toQuadrant]: [...data[toQuadrant], item],
      });
    },
    [data, updateData],
  );

  const insertItemBeforeTarget = React.useCallback(
    (
      fromQuadrant: QuadrantKey,
      toQuadrant: QuadrantKey,
      draggedItemId: string,
      targetItemId: string,
    ) => {
      const draggedItem = data[fromQuadrant].find((entry) => entry.id === draggedItemId);
      if (!draggedItem) {
        return;
      }

      const targetIndex = data[toQuadrant].findIndex((entry) => entry.id === targetItemId);
      if (targetIndex === -1) {
        return;
      }

      if (fromQuadrant === toQuadrant) {
        const reorderedItems = data[toQuadrant].filter((entry) => entry.id !== draggedItemId);
        reorderedItems.splice(targetIndex, 0, draggedItem);

        updateData({
          ...data,
          [toQuadrant]: reorderedItems,
        });

        return;
      }

      const destinationItems = [...data[toQuadrant]];
      destinationItems.splice(targetIndex, 0, draggedItem);

      updateData({
        ...data,
        [fromQuadrant]: data[fromQuadrant].filter((entry) => entry.id !== draggedItemId),
        [toQuadrant]: destinationItems,
      });
    },
    [data, updateData],
  );

  const handleDragStart = React.useCallback(
    (event: React.DragEvent, itemId: string, fromQuadrant: QuadrantKey) => {
      if (disabled) {
        return;
      }

      event.dataTransfer.effectAllowed = 'move';
      setDragState({ itemId, fromQuadrant });
    },
    [disabled],
  );

  const handleDragOverQuadrant = React.useCallback(
    (event: React.DragEvent, quadrant: QuadrantKey) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      setDragOverQuadrant(quadrant);
      setDragOverItemId(null);
    },
    [],
  );

  const handleDragOverItem = React.useCallback((event: React.DragEvent, itemId: string) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    setDragOverItemId(itemId);
  }, []);

  const handleDragLeaveQuadrant = React.useCallback((event: React.DragEvent) => {
    const currentTarget = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as Node | null;

    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      setDragOverQuadrant(null);
    }
  }, []);

  const handleDropOnQuadrant = React.useCallback(
    (event: React.DragEvent, toQuadrant: QuadrantKey) => {
      event.preventDefault();

      if (!dragState) {
        return;
      }

      if (dragState.fromQuadrant !== toQuadrant) {
        moveItemBetweenQuadrants(dragState.fromQuadrant, toQuadrant, dragState.itemId);
      }

      resetDragState();
    },
    [dragState, moveItemBetweenQuadrants, resetDragState],
  );

  const handleDropOnItem = React.useCallback(
    (event: React.DragEvent, targetItemId: string, toQuadrant: QuadrantKey) => {
      event.preventDefault();
      event.stopPropagation();

      if (!dragState || dragState.itemId === targetItemId) {
        resetDragState();
        return;
      }

      insertItemBeforeTarget(dragState.fromQuadrant, toQuadrant, dragState.itemId, targetItemId);

      resetDragState();
    },
    [dragState, insertItemBeforeTarget, resetDragState],
  );

  const handleDragEnd = React.useCallback(() => {
    resetDragState();
  }, [resetDragState]);

  const handleAdd = React.useCallback(
    (quadrant: QuadrantKey) => {
      const text = newTexts[quadrant].trim();
      if (!text) {
        return;
      }

      updateData({
        ...data,
        [quadrant]: [...data[quadrant], { id: generateId(), text }],
      });

      setNewTexts((prev) => ({
        ...prev,
        [quadrant]: '',
      }));
    },
    [data, newTexts, updateData],
  );

  const handleRemove = React.useCallback(
    (quadrant: QuadrantKey, itemId: string) => {
      updateData({
        ...data,
        [quadrant]: data[quadrant].filter((entry) => entry.id !== itemId),
      });
    },
    [data, updateData],
  );

  const handleInputChange = React.useCallback((quadrant: QuadrantKey, value: string) => {
    setNewTexts((prev) => ({
      ...prev,
      [quadrant]: value,
    }));
  }, []);

  return (
    <div className={styles.root}>
      {QUADRANTS.map((quadrant) => (
        <SwotQuadrant
          key={quadrant}
          quadrant={quadrant}
          items={data[quadrant]}
          disabled={disabled}
          newText={newTexts[quadrant]}
          isDragTarget={dragOverQuadrant === quadrant}
          dragState={dragState}
          dragOverItemId={dragOverItemId}
          hoveredItemId={hoveredItemId}
          onDragOverQuadrant={(event) => handleDragOverQuadrant(event, quadrant)}
          onDragLeaveQuadrant={handleDragLeaveQuadrant}
          onDropOnQuadrant={(event) => handleDropOnQuadrant(event, quadrant)}
          onDragStartItem={(event, itemId) => handleDragStart(event, itemId, quadrant)}
          onDragEndItem={handleDragEnd}
          onDragOverItem={handleDragOverItem}
          onDropOnItem={(event, itemId) => handleDropOnItem(event, itemId, quadrant)}
          onHoverItem={setHoveredItemId}
          onNewTextChange={(value) => handleInputChange(quadrant, value)}
          onAdd={() => handleAdd(quadrant)}
          onRemoveItem={(itemId) => handleRemove(quadrant, itemId)}
        />
      ))}
    </div>
  );
};
