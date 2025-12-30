import React from "react";
import { IconGripVertical } from "@tabler/icons-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { MediaNavItem } from "../types";
import classes from "../../styles/UserProfile.module.css";

export function SortableNavLink({
                                    item,
                                    activeId,
                                    onActivate,
                                }: {
    item: MediaNavItem;
    activeId: string;
    onActivate: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.id,
        disabled: Boolean(item.disabled),
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : undefined,
    };

    return (
        <a
            ref={setNodeRef}
            style={style}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className={classes.link}
            data-active={(!item.disabled && item.id === activeId) || undefined}
            data-disabled={item.disabled || undefined}
            href={item.link || "#"}
            onClick={(e) => {
                e.preventDefault();
                if (item.disabled) return;
                onActivate(item.id);
            }}
        >
      <span
          {...(!item.disabled ? attributes : {})}
          {...(!item.disabled ? listeners : {})}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 18,
              height: 18,
              opacity: item.disabled ? 0.35 : 0.6,
              cursor: item.disabled ? "not-allowed" : "grab",
          }}
          aria-hidden="true"
      >
        <IconGripVertical size={16} stroke={1.5} />
      </span>

            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    );
}
