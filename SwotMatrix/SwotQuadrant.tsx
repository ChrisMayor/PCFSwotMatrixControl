import * as React from 'react';
import { Input, Button, mergeClasses } from '@fluentui/react-components';
import { AddCircleRegular } from '@fluentui/react-icons';
import { useStyles } from './SwotMatrixControl.styles';
import {
  QuadrantKey,
  SwotItem as SwotItemData,
  QUADRANT_CONFIG,
  DragState,
} from './SwotMatrixControl.types';
import { SwotItem } from './SwotItem';

export interface ISwotQuadrantProps {
  quadrant: QuadrantKey;
  items: SwotItemData[];
  disabled?: boolean;
  newText: string;
  isDragTarget: boolean;
  dragState: DragState;
  dragOverItemId: string | null;
  hoveredItemId: string | null;
  onDragOverQuadrant: (event: React.DragEvent) => void;
  onDragLeaveQuadrant: (event: React.DragEvent) => void;
  onDropOnQuadrant: (event: React.DragEvent) => void;
  onDragStartItem: (event: React.DragEvent, itemId: string) => void;
  onDragEndItem: () => void;
  onDragOverItem: (event: React.DragEvent, itemId: string) => void;
  onDropOnItem: (event: React.DragEvent, itemId: string) => void;
  onHoverItem: (itemId: string | null) => void;
  onNewTextChange: (value: string) => void;
  onAdd: () => void;
  onRemoveItem: (itemId: string) => void;
}

export const SwotQuadrant: React.FC<ISwotQuadrantProps> = ({
  quadrant,
  items,
  disabled,
  newText,
  isDragTarget,
  dragState,
  dragOverItemId,
  hoveredItemId,
  onDragOverQuadrant,
  onDragLeaveQuadrant,
  onDropOnQuadrant,
  onDragStartItem,
  onDragEndItem,
  onDragOverItem,
  onDropOnItem,
  onHoverItem,
  onNewTextChange,
  onAdd,
  onRemoveItem,
}) => {
  const styles = useStyles();
  const config = QUADRANT_CONFIG[quadrant];

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onAdd();
    }
  };

  return (
    <div className={styles.quadrant} style={{ backgroundColor: config.bgColor }}>
      <div className={styles.quadrantHeader} style={{ backgroundColor: config.headerColor }}>
        <span>{config.label}</span>
        <span className={styles.headerBadge}>{items.length}</span>
      </div>

      <div
        className={mergeClasses(
          styles.quadrantBody,
          isDragTarget ? styles.quadrantBodyDragOver : undefined,
        )}
        onDragOver={onDragOverQuadrant}
        onDragLeave={onDragLeaveQuadrant}
        onDrop={onDropOnQuadrant}
      >
        {items.map((item) => (
          <SwotItem
            key={item.id}
            item={item}
            disabled={disabled}
            isDragging={dragState?.itemId === item.id}
            isDraggedOver={dragOverItemId === item.id && dragState?.itemId !== item.id}
            isHovered={hoveredItemId === item.id}
            onDragStart={(event) => onDragStartItem(event, item.id)}
            onDragEnd={onDragEndItem}
            onDragOver={(event) => onDragOverItem(event, item.id)}
            onDrop={(event) => onDropOnItem(event, item.id)}
            onMouseEnter={() => onHoverItem(item.id)}
            onMouseLeave={() => onHoverItem(null)}
            onRemove={() => onRemoveItem(item.id)}
          />
        ))}
      </div>

      {!disabled && (
        <div className={styles.addRow}>
          <Input
            className={styles.addInput}
            size="small"
            placeholder="Add item…"
            value={newText}
            onChange={(_, state) => onNewTextChange(state.value)}
            onKeyDown={handleInputKeyDown}
          />

          <Button
            className={styles.addBtn}
            appearance="transparent"
            size="medium"
            aria-label={`Add to ${config.label}`}
            onClick={onAdd}
            style={{ color: config.headerColor }}
            icon={<AddCircleRegular className={styles.addBtnIcon} />}
          />
        </div>
      )}
    </div>
  );
};
