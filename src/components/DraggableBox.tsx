import { Rect, Transformer } from 'react-konva';
import { useEffect, useRef } from 'react';
import type { RemovalBox } from '../types/editor';

interface Props {
  box: RemovalBox;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (newAttrs: RemovalBox) => void;
}

export default function DraggableBox({ box, isSelected, onSelect, onChange }: Props) {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        onClick={() => onSelect(box.id)}
        onTap={() => onSelect(box.id)}
        ref={shapeRef}
        {...box}
        draggable
        fill="rgba(239, 68, 68, 0.2)"
        stroke="#ef4444"
        strokeWidth={2}
        onDragEnd={(e) => {
          onChange({
            ...box,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale and update width/height
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...box,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}
