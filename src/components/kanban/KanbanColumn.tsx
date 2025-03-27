import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { KanbanColumnCompProps } from '@/types/kanban';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import KanbanTaskItem from './KanbanTaskItem';

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
  const [newTask, setNewTask] = useState<string>('');

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

export default KanbanColumn;
