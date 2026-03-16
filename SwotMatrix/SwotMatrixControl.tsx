import * as React from 'react';
import { Text, Input, Button, mergeClasses } from '@fluentui/react-components';
import { AddCircleRegular } from '@fluentui/react-icons';
import { useStyles } from './SwotMatrixControl.styles';
import {
  QuadrantKey,
  SwotData,
  ISwotMatrixProps,
  QUADRANT_CONFIG,
  parseSwotData,
  generateId,
} from './SwotMatrixControl.types';

export type { QuadrantKey, SwotData, ISwotMatrixProps };

type DragState = {
  itemId: string;
  fromQuadrant: QuadrantKey;
} | null;

type NewTextsState = Record<QuadrantKey, string>;

const QUADRANTS: QuadrantKey[] = ['strengths', 'weaknesses', 'opportunities', 'threats'];

const createEmptyNewTexts = (): NewTextsState => ({
  strengths: '',
  weaknesses: '',
  opportunities: '',
  threats: '',
});

export const SwotMatrix: React.FC<ISwotMatrixProps> = ({
  swotData,
  onDataChanged,
  disabled,
}) => {
  const styles = useStyles();

  const [data, setData] = React.useState<SwotData>(() => parseSwotData(swotData));
  const [newTexts, setNewTexts] = React.useState<NewTextsState>(createEmptyNewTexts);
  const [dragState, setDragState] = React.useState<DragState>(null);
  const [dragOverQuadrant, setDragOverQuadrant] = React.useState<QuadrantKey | null>(null);
  const [dragOverItemId, setDragOverItemId] = React.useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setData(parseSwotData(swotData));
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
      const item = data[fromQuadrant].find(entry => entry.id === itemId);
      if (!item) {
        return;
      }

      updateData({
        ...data,
        [fromQuadrant]: data[fromQuadrant].filter(entry => entry.id !== itemId),
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
      const draggedItem = data[fromQuadrant].find(entry => entry.id === draggedItemId);
      if (!draggedItem) {
        return;
      }

      const targetIndex = data[toQuadrant].findIndex(entry => entry.id === targetItemId);
      if (targetIndex === -1) {
        return;
      }

      if (fromQuadrant === toQuadrant) {
        const reorderedItems = data[toQuadrant].filter(entry => entry.id !== draggedItemId);
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
        [fromQuadrant]: data[fromQuadrant].filter(entry => entry.id !== draggedItemId),
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

      insertItemBeforeTarget(
        dragState.fromQuadrant,
        toQuadrant,
        dragState.itemId,
        targetItemId,
      );

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

      setNewTexts(prev => ({
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
        [quadrant]: data[quadrant].filter(entry => entry.id !== itemId),
      });
    },
    [data, updateData],
  );

  const handleInputChange = React.useCallback(
    (quadrant: QuadrantKey, value: string) => {
      setNewTexts(prev => ({
        ...prev,
        [quadrant]: value,
      }));
    },
    [],
  );

  const handleInputKeyDown = React.useCallback(
    (event: React.KeyboardEvent, quadrant: QuadrantKey) => {
      if (event.key === 'Enter') {
        handleAdd(quadrant);
      }
    },
    [handleAdd],
  );

  return (
    <div className={styles.root}>
      {QUADRANTS.map(quadrant => {
        const config = QUADRANT_CONFIG[quadrant];
        const items = data[quadrant];
        const isDragTarget = dragOverQuadrant === quadrant;

        return (
          <div
            key={quadrant}
            className={styles.quadrant}
            style={{ backgroundColor: config.bgColor }}
          >
            <div
              className={styles.quadrantHeader}
              style={{ backgroundColor: config.headerColor }}
            >
              <span>{config.label}</span>
              <span className={styles.headerBadge}>{items.length}</span>
            </div>

            <div
              className={mergeClasses(
                styles.quadrantBody,
                isDragTarget ? styles.quadrantBodyDragOver : undefined,
              )}
              onDragOver={event => handleDragOverQuadrant(event, quadrant)}
              onDragLeave={handleDragLeaveQuadrant}
              onDrop={event => handleDropOnQuadrant(event, quadrant)}
            >
              {items.map(item => {
                const isDragging = dragState?.itemId === item.id;
                const isDraggedOver = dragOverItemId === item.id && dragState?.itemId !== item.id;
                const isHovered = hoveredItemId === item.id;

                return (
                  <div
                    key={item.id}
                    className={mergeClasses(
                      styles.item,
                      isDragging ? styles.itemDragging : undefined,
                      isDraggedOver ? styles.itemDragOver : undefined,
                    )}
                    draggable={!disabled}
                    onMouseEnter={() => setHoveredItemId(item.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    onDragStart={event => handleDragStart(event, item.id, quadrant)}
                    onDragEnd={handleDragEnd}
                    onDragOver={event => handleDragOverItem(event, item.id)}
                    onDrop={event => handleDropOnItem(event, item.id, quadrant)}
                  >
                    <span className={styles.dragHandle} aria-hidden>
                      ⠿
                    </span>

                    <Text className={styles.itemText}>{item.text}</Text>

                    {!disabled && (
                      <Button
                        className={styles.removeBtn}
                        style={{ opacity: isHovered ? 1 : 0 }}
                        appearance="subtle"
                        size="small"
                        aria-label={`Remove ${item.text}`}
                        onClick={() => handleRemove(quadrant, item.id)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {!disabled && (
              <div className={styles.addRow}>
                <Input
                  className={styles.addInput}
                  size="small"
                  placeholder="Add item…"
                  value={newTexts[quadrant]}
                  onChange={(_, state) => handleInputChange(quadrant, state.value)}
                  onKeyDown={event => handleInputKeyDown(event, quadrant)}
                />

                <Button
                  className={styles.addBtn}
                  appearance="transparent"
                  size="medium"
                  aria-label={`Add to ${config.label}`}
                  onClick={() => handleAdd(quadrant)}
                  style={{ color: config.headerColor }}
                  icon={<AddCircleRegular className={styles.addBtnIcon} />}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};