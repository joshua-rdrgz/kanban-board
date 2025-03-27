import { COLUMNS } from '@/constants/kanban';
import { useKanban } from '@/hooks/useKanban';
import { DndContext } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import TaskStats from './TaskStats';

/**
 * KanbanBoard - the main component of the application.
 */
const KanbanBoard: React.FC = () => {
  const {
    kanbanTasks,
    kanbanTaskCounts,
    hoveredColumn,
    handleAddTask,
    handleEditTask,
    handleDeleteTask,
    handleDragOver,
    handleDragEnd,
  } = useKanban();

  return (
    <div className='p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen w-full'>
      <h1 className='text-5xl font-extrabold text-center p-5 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500'>
        Kanban Board
      </h1>

      {/* Stats Section */}
      <TaskStats taskCounts={kanbanTaskCounts} />

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
