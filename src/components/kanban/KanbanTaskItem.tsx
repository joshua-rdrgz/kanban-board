import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { KanbanTaskItemCompProps } from '@/types/kanban';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical, Pencil, Save, Trash2, X } from 'lucide-react';
import { useState, useRef } from 'react';

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
  const nodeRef = useRef<HTMLDivElement>(null);
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

export default KanbanTaskItem;
