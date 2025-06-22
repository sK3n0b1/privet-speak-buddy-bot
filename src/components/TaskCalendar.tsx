
import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Task {
  id: string;
  date: Date;
  title: string;
  description: string;
  completed: boolean;
}

const TaskCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const addTask = () => {
    if (!selectedDate || !newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      date: selectedDate,
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.date.toDateString() === date.toDateString()
    );
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Календарь</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={ru}
            className="rounded-md border"
          />
          
          {selectedDate && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold">
                {format(selectedDate, "d MMMM yyyy", { locale: ru })}
              </h3>
              <p className="text-sm text-muted-foreground">
                Задач на день: {selectedDateTasks.length}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Задачи на {selectedDate ? format(selectedDate, "d MMMM", { locale: ru }) : 'выбранный день'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Название задачи"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <Textarea
              placeholder="Описание задачи (необязательно)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <Button onClick={addTask} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Добавить задачу
            </Button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedDateTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Нет задач на выбранный день
              </p>
            ) : (
              selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 border rounded-lg ${
                    task.completed ? 'bg-muted line-through' : 'bg-background'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 
                        className="font-medium cursor-pointer"
                        onClick={() => toggleTask(task.id)}
                      >
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={task.completed ? "secondary" : "default"}>
                        {task.completed ? "Выполнено" : "В работе"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCalendar;
