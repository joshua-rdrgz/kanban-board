/**
 * KanbanStatus - The status of a task.
 */
export type KanbanStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETE';

/**
 * KanbanTask - an individual Task on the Kanban board.
 */
export interface KanbanTask {
  id: string;
  title: string;
  column: KanbanStatus;
}

/**
 * KanbanColumn - a column to drop Tasks onto in the Kanban board.
 */
export interface KanbanColumn {
  id: KanbanStatus;
  title: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  taskBg: string;
  iconColor: string;
}

/**
 * KanbanColumnCompProps - the props of the KanbanColumn React component.
 */
export interface KanbanColumnCompProps {
  column: KanbanColumn;
  tasksToRender: KanbanTask[];
  onAddTask(task: KanbanTask): void;
  onEditTask(task: KanbanTask): void;
  onDeleteTask(taskId: KanbanTask['id']): void;
  hoveredColumn: KanbanColumn['id'] | null;
}

/**
 * KanbanTaskItemCompProps - the props of the KanbanTaskItem React component.
 */
export interface KanbanTaskItemCompProps {
  task: KanbanTask;
  onEditTask(task: KanbanTask): void;
  onDeleteTask(taskId: KanbanTask['id']): void;
  column: KanbanColumn;
}
