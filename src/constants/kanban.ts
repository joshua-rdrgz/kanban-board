import { KanbanColumn, KanbanTask } from '../types/kanban';

export const COLUMNS: KanbanColumn[] = [
  {
    id: 'TODO',
    title: 'To Do',
    color: 'bg-purple-200',
    gradientFrom: 'from-purple-50',
    gradientTo: 'to-purple-100',
    taskBg: 'bg-white',
    iconColor: 'text-purple-500',
  },
  {
    id: 'IN_PROGRESS',
    title: 'In Progress',
    color: 'bg-blue-200',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-blue-100',
    taskBg: 'bg-white',
    iconColor: 'text-blue-500',
  },
  {
    id: 'COMPLETE',
    title: 'Complete',
    color: 'bg-emerald-200',
    gradientFrom: 'from-emerald-50',
    gradientTo: 'to-emerald-100',
    taskBg: 'bg-white',
    iconColor: 'text-emerald-500',
  },
];

export const INITIAL_TASKS: KanbanTask[] = [
  { id: '1', title: 'Design UI', column: 'TODO' },
  { id: '2', title: 'Implement API', column: 'IN_PROGRESS' },
  { id: '3', title: 'Write tests', column: 'COMPLETE' },
];
