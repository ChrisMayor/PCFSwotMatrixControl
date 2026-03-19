import * as React from 'react';
import { Text, Button, mergeClasses } from '@fluentui/react-components';
import { useStyles } from './SwotMatrixControl.styles';
import { SwotItem as SwotItemData } from './SwotMatrixControl.types';

export interface ISwotItemProps {
  item: SwotItemData;
  disabled?: boolean;
  isDragging: boolean;
  isDraggedOver: boolean;
  isHovered: boolean;
  onDragStart: (event: React.DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onRemove: () => void;
}

export const SwotItem: React.FC<ISwotItemProps> = ({
  item,
  disabled,
  isDragging,
  isDraggedOver,
  isHovered,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onMouseEnter,
  onMouseLeave,
  onRemove,
}) => {
  const styles = useStyles();

  return (
    <div
      className={mergeClasses(
        styles.item,
        isDragging ? styles.itemDragging : undefined,
        isDraggedOver ? styles.itemDragOver : undefined,
      )}
      draggable={!disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
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
          onClick={onRemove}
        >
          ✕
        </Button>
      )}
    </div>
  );
};
