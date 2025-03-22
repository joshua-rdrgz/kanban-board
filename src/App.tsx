import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { GripVertical, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';

/**
 * KanbanStatus - The status of a task.
 */
type KanbanStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETE';

/**
 * KanbanTask - an individual Task on the Kanban board.
 */
interface KanbanTask {
  id: string;
  title: string;
  column: KanbanStatus;
}

/**
 * KanbanColumn - a column to drop Tasks onto in the Kanban board.
 */
interface KanbanColumn {
  id: KanbanStatus;
  title: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  taskBg: string;
  iconColor: string;
}

const COLUMNS: KanbanColumn[] = [
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

const INITIAL_TASKS: KanbanTask[] = [
  { id: '1', title: 'Design UI', column: 'TODO' },
  { id: '2', title: 'Implement API', column: 'IN_PROGRESS' },
  { id: '3', title: 'Write tests', column: 'COMPLETE' },
];

/**
 * KanbanColumnCompProps - the props of the KanbanColumn React component.
 */
interface KanbanColumnCompProps {
  column: KanbanColumn;
  tasksToRender: KanbanTask[];
  onAddTask(task: KanbanTask): void;
  onEditTask(task: KanbanTask): void;
  onDeleteTask(taskId: KanbanTask['id']): void;
  hoveredColumn: KanbanColumn['id'] | null;
}

/**
 * KanbanColumn - the component rendering an individual
 * Kanban column.
 */
const KanbanColumn: React.FC<KanbanColumnCompProps> = ({
  column,
  tasksToRender,
  onAddTask,
  onEditTask,
  onDeleteTask,
  hoveredColumn,
}) => {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [newTask, setNewTask] = useState<KanbanTask['title']>('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    onAddTask({
      id: Date.now().toString(),
      title: newTask,
      column: 'TODO',
    });
    setNewTask('');
  };

  const columnStyle =
    hoveredColumn === column.id ? 'border-2 border-dashed border-blue-500' : '';

  const columnBtnHoverStyle =
    column.color === 'bg-purple-200'
      ? 'hover:bg-purple-200'
      : column.color === 'bg-blue-200'
        ? 'hover:bg-blue-200'
        : 'hover:bg-emerald-200';

  return (
    <Card
      ref={setNodeRef}
      className={`bg-gradient-to-b ${column.gradientFrom} ${column.gradientTo} ${columnStyle} rounded-xl overflow-hidden shadow-sm`}
    >
      <CardHeader className='flex flex-row items-center justify-between pt-5 border-gray-100'>
        <CardTitle className='text-xl flex items-center gap-2 font-bold'>
          <span className={`w-3 h-3 rounded-full ${column.color}`} />
          {column.title}
        </CardTitle>
        <span
          className={`${column.color} px-3 py-1 rounded-full text-sm font-medium`}
        >
          {tasksToRender.length}
        </span>
      </CardHeader>

      <CardContent className='p-4'>
        {column.id === 'TODO' && (
          <div className='mb-4 flex gap-2'>
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder='Add a task...'
              className='rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-300'
            />
            <Button
              variant='outline'
              size='icon'
              className={columnBtnHoverStyle}
              onClick={handleAddTask}
            >
              <Plus className={`w-4 h-4 ${column.iconColor}`} />
            </Button>
          </div>
        )}

        <div className='space-y-2 max-h-[500px] overflow-y-auto'>
          {tasksToRender.map((task) => (
            <KanbanTaskItem
              key={task.id}
              task={task}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              column={column}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * KanbanTaskItemCompProps - the props of the KanbanTaskItem React component.
 */
interface KanbanTaskItemCompProps {
  task: KanbanTask;
  onEditTask(task: KanbanTask): void;
  onDeleteTask(taskId: KanbanTask['id']): void;
  column: KanbanColumn;
}

/**
 * KanbanTaskItem - the component rendering an individual
 * Kanban task item.
 */
const KanbanTaskItem: React.FC<KanbanTaskItemCompProps> = ({
  task,
  onEditTask,
  onDeleteTask,
  column,
}) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const [isEditingTask, setIsEditingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState(task.title);

  const setRefs = (element: HTMLDivElement | null) => {
    nodeRef.current = element;
    setNodeRef(element);
  };

  const colorBase = column.color.split('-')[1];
  const btnHoverClassName =
    colorBase === 'purple'
      ? 'hover:bg-purple-200 hover:text-purple-600'
      : colorBase === 'blue'
        ? 'hover:bg-blue-200 hover:text-blue-600'
        : 'hover:bg-emerald-200 hover:text-emerald-600';

  const cardStyle = transform
    ? {
        position: 'absolute' as const,
        width: nodeRef.current?.offsetWidth
          ? `${nodeRef.current.offsetWidth}px`
          : 'calc(100% - 24px)',
        transform: `translate(${transform.x}px, ${transform.y}px) rotate(-5deg)`,
        transformOrigin: 'left center',
        zIndex: 50,
      }
    : undefined;

  return (
    <Card
      ref={setRefs}
      className={`w-full shadow-sm rounded-lg ${column.taskBg} border-0 hover:shadow`}
      style={cardStyle}
    >
      <CardContent className='p-2 flex items-center'>
        {isEditingTask ? (
          <div className='w-full flex flex-wrap gap-2 items-center'>
            <Input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className='rounded-md focus:ring-2 focus:ring-blue-300'
              autoFocus
            />
            <div className='w-full flex justify-center gap-2 mt-2'>
              <Button
                variant='outline'
                className={cn('cursor-pointer', btnHoverClassName)}
                size='sm'
                onClick={() => {
                  onEditTask({ ...task, title: taskTitle });
                  setIsEditingTask(false);
                }}
              >
                <Save className='w-4 h-4 mr-1' />
                Save
              </Button>
              <Button
                variant='outline'
                className='cursor-pointer hover:bg-red-50 hover:text-red-600'
                size='sm'
                onClick={() => {
                  setTaskTitle(task.title);
                  setIsEditingTask(false);
                }}
              >
                <X className='w-4 h-4 mr-1' />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`cursor-grab mr-2 ${column.iconColor} opacity-70 hover:opacity-100`}
              {...listeners}
              {...attributes}
            >
              <GripVertical strokeWidth={1.5} />
            </div>
            <div className='w-full flex justify-between items-center flex-wrap gap-2'>
              <span className='font-medium flex-grow'>{task.title}</span>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  className={cn('cursor-pointer', btnHoverClassName)}
                  size='sm'
                  onClick={() => setIsEditingTask(true)}
                >
                  <Pencil className='w-4 h-4' />
                </Button>
                <Button
                  variant='outline'
                  className='cursor-pointer hover:bg-red-50 hover:text-red-600'
                  size='sm'
                  onClick={() => onDeleteTask(task.id)}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * KanbanBoard - the main component of the application.
 */
const KanbanBoard: React.FC = () => {
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

  return (
    <div className='p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen w-full'>
      <h1 className='text-5xl font-extrabold text-center p-5 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500'>
        Kanban Board
      </h1>

      {/* Stats Section */}
      <div>
        <h2 className='text-3xl font-bold mb-4 text-gray-800'>Task Stats</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-10'>
          <Card className='overflow-hidden border-0 shadow-md rounded-xl bg-white p-0'>
            <CardHeader className='bg-gradient-to-r from-purple-50 to-blue-50 pb-2 pt-6'>
              <CardTitle className='text-xl text-gray-700 font-bold'>
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-4 pb-6'>
              <p className='text-4xl font-bold text-gray-800'>
                {kanbanTaskCounts.total}
              </p>
              <div className='mt-2 text-sm text-gray-500'>
                <span className='flex items-center gap-2'>
                  <span className='inline-block w-3 h-3 rounded-full bg-purple-200'></span>
                  To Do: {kanbanTaskCounts.todo}
                </span>
                <span className='flex items-center gap-2 mt-1'>
                  <span className='inline-block w-3 h-3 rounded-full bg-blue-200'></span>
                  In Progress: {kanbanTaskCounts.inProgress}
                </span>
                <span className='flex items-center gap-2 mt-1'>
                  <span className='inline-block w-3 h-3 rounded-full bg-emerald-200'></span>
                  Complete: {kanbanTaskCounts.complete}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-md rounded-xl bg-white overflow-hidden p-0'>
            <CardHeader className='bg-gradient-to-r from-blue-50 to-emerald-50 pb-2 pt-6'>
              <CardTitle className='text-xl text-gray-700 font-bold'>
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-4 pb-6'>
              <div className='flex flex-col gap-4'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='w-full h-3 bg-gray-100 rounded-full overflow-hidden flex cursor-help'>
                        <div
                          className='h-full bg-emerald-500 transition-all duration-300'
                          style={{
                            width: `${
                              (kanbanTaskCounts.complete /
                                kanbanTaskCounts.total) *
                                100 || 0
                            }%`,
                          }}
                        />
                        <div
                          className='h-full bg-blue-500 transition-all duration-300'
                          style={{
                            width: `${
                              (kanbanTaskCounts.inProgress /
                                kanbanTaskCounts.total) *
                                100 || 0
                            }%`,
                          }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className='bg-gray-800 border-0 p-3 shadow-xl text-gray-100'>
                      <p className='flex items-center gap-2 mb-1'>
                        <span className='inline-block w-2 h-2 rounded-full bg-emerald-400'></span>
                        Complete:{' '}
                        {(
                          (kanbanTaskCounts.complete / kanbanTaskCounts.total) *
                            100 || 0
                        ).toFixed(1)}
                        %
                      </p>
                      <p className='flex items-center gap-2 mb-1'>
                        <span className='inline-block w-2 h-2 rounded-full bg-blue-400'></span>
                        In Progress:{' '}
                        {(
                          (kanbanTaskCounts.inProgress /
                            kanbanTaskCounts.total) *
                            100 || 0
                        ).toFixed(1)}
                        %
                      </p>
                      <p className='flex items-center gap-2'>
                        <span className='inline-block w-2 h-2 rounded-full bg-purple-400'></span>
                        To Do:{' '}
                        {(
                          (kanbanTaskCounts.todo / kanbanTaskCounts.total) *
                            100 || 0
                        ).toFixed(1)}
                        %
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className='flex justify-between items-center'>
                  <span className='font-medium text-gray-700'>
                    Overall Completion
                  </span>
                  <span className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600'>
                    {kanbanTaskCounts.completionRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Kanban Board */}
      <div>
        <h2 className='text-3xl font-bold mb-4 text-gray-800'>Task Board</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <DndContext onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                tasksToRender={kanbanTasks.filter(
                  (kt) => kt.column === column.id,
                )}
                hoveredColumn={hoveredColumn}
              />
            ))}
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
