import React, { useState } from 'react';
import { tasksList } from '../../data/portfolioData';
import { CheckSquare, Clock } from 'lucide-react';
import type { TaskItem } from '../../types';

export const TaskView: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>(tasksList);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Completed' ? 'Todo' : 'Completed' }
          : t
      )
    );
  };

  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
            Developer Tasks & Goals
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Active sprints, learning goals, and fitness routines.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const isDone = task.status === 'Completed';
          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={"p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group " +
                (isDone
                  ? 'bg-neutral-50 border-neutral-200 opacity-60'
                  : 'bg-white border-neutral-200 shadow-2xs hover:shadow-soft')
              }
            >
              <div className="flex items-center gap-3">
                <div
                  className={"w-5 h-5 rounded-md flex items-center justify-center border transition-colors " +
                    (isDone
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-neutral-300 group-hover:border-[#DF886F]')
                  }
                >
                  {isDone && <CheckSquare size={13} />}
                </div>
                <div>
                  <h4
                    className={"font-bold text-xs sm:text-sm text-neutral-900 " +
                      (isDone ? 'line-through text-neutral-400' : '')
                    }
                  >
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                      {task.category}
                    </span>
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Clock size={10} /> {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={"text-[10px] font-bold px-2.5 py-0.5 rounded-full " +
                  (task.priority === 'High'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-amber-50 text-amber-600')
                }
              >
                {task.priority} Priority
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
