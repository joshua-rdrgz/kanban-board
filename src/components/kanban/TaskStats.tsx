import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TaskStatsProps {
  taskCounts: {
    todo: number;
    inProgress: number;
    complete: number;
    total: number;
    completionRate: number;
  };
}

const TaskStats: React.FC<TaskStatsProps> = ({ taskCounts }) => {
  return (
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
              {taskCounts.total}
            </p>
            <div className='mt-2 text-sm text-gray-500'>
              <span className='flex items-center gap-2'>
                <span className='inline-block w-3 h-3 rounded-full bg-purple-200'></span>
                To Do: {taskCounts.todo}
              </span>
              <span className='flex items-center gap-2 mt-1'>
                <span className='inline-block w-3 h-3 rounded-full bg-blue-200'></span>
                In Progress: {taskCounts.inProgress}
              </span>
              <span className='flex items-center gap-2 mt-1'>
                <span className='inline-block w-3 h-3 rounded-full bg-emerald-200'></span>
                Complete: {taskCounts.complete}
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
                            (taskCounts.complete / taskCounts.total) * 100 || 0
                          }%`,
                        }}
                      />
                      <div
                        className='h-full bg-blue-500 transition-all duration-300'
                        style={{
                          width: `${
                            (taskCounts.inProgress / taskCounts.total) * 100 ||
                            0
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
                        (taskCounts.complete / taskCounts.total) * 100 || 0
                      ).toFixed(1)}
                      %
                    </p>
                    <p className='flex items-center gap-2 mb-1'>
                      <span className='inline-block w-2 h-2 rounded-full bg-blue-400'></span>
                      In Progress:{' '}
                      {(
                        (taskCounts.inProgress / taskCounts.total) * 100 || 0
                      ).toFixed(1)}
                      %
                    </p>
                    <p className='flex items-center gap-2'>
                      <span className='inline-block w-2 h-2 rounded-full bg-purple-400'></span>
                      To Do:{' '}
                      {(
                        (taskCounts.todo / taskCounts.total) * 100 || 0
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
                  {taskCounts.completionRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskStats;
