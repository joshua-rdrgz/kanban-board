import { INITIAL_TASKS } from '@/constants/kanban';
import { KanbanColumn, KanbanTask } from '@/types/kanban';
import { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { useMemo, useState } from 'react';

export function useKanban() {
  const [kanbanTasks, setKanbanTasks] = useState(INITIAL_TASKS);
  const [hoveredColumn, setHoveredColumn] = useState<KanbanColumn['id'] | null>(
    null,
  );

  const kanbanTaskCounts = useMemo(
    () => ({
      todo: kanbanTasks.filter((t) => t.column === 'TODO').length,
      inProgress: kanbanTasks.filter((t) => t.column === 'IN_PROGRESS').length,
      complete: kanbanTasks.filter((t) => t.column === 'COMPLETE').length,
      total: kanbanTasks.length,
      completionRate:
        kanbanTasks.length > 0
          ? ((kanbanTasks.filter((t) => t.column === 'COMPLETE').length +
              kanbanTasks.filter((t) => t.column === 'IN_PROGRESS').length) /
              kanbanTasks.length) *
            100
          : 0,
    }),
    [kanbanTasks],
  );

  const handleAddTask = (newTask: KanbanTask) => {
    setKanbanTasks((prev) => [...prev, newTask]);
  };

  const handleEditTask = (updatedTask: KanbanTask) => {
    setKanbanTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );
  };

  const handleDeleteTask = (id: string) => {
    setKanbanTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    const overId = over?.id as KanbanColumn['id'];
    setHoveredColumn(overId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setHoveredColumn(null);

    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as KanbanTask['id'];
    const taskColumn = over.id as KanbanColumn['id'];

    setKanbanTasks((prevTasks) =>
      prevTasks.map((pt) =>
        pt.id === taskId ? { ...pt, column: taskColumn } : pt,
      ),
    );
  };

  return {
    kanbanTasks,
    kanbanTaskCounts,
    hoveredColumn,
    handleAddTask,
    handleEditTask,
    handleDeleteTask,
    handleDragOver,
    handleDragEnd,
  };
}
