
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, X, Target } from "lucide-react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";

interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

interface HabitRecord {
  habitId: string;
  date: Date;
  completed: boolean;
}

const HabitsTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<HabitRecord[]>([]);
  const [newHabitName, setNewHabitName] = useState('');

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

  const addHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      color: colors[habits.length % colors.length],
      createdAt: new Date()
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const toggleHabit = (habitId: string, date: Date) => {
    const existingRecord = records.find(r => 
      r.habitId === habitId && isSameDay(r.date, date)
    );

    if (existingRecord) {
      setRecords(records.map(r => 
        r.habitId === habitId && isSameDay(r.date, date)
          ? { ...r, completed: !r.completed }
          : r
      ));
    } else {
      setRecords([...records, {
        habitId,
        date,
        completed: true
      }]);
    }
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(h => h.id !== habitId));
    setRecords(records.filter(r => r.habitId !== habitId));
  };

  const getWeekDays = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const isHabitCompleted = (habitId: string, date: Date) => {
    const record = records.find(r => 
      r.habitId === habitId && isSameDay(r.date, date)
    );
    return record?.completed || false;
  };

  const getHabitStreak = (habitId: string) => {
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      if (isHabitCompleted(habitId, currentDate)) {
        streak++;
        currentDate = addDays(currentDate, -1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const weekDays = getWeekDays();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Трекер привычек
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Название новой привычки"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            />
            <Button onClick={addHabit}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {habits.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              Добавьте свою первую привычку для отслеживания
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Неделя: {format(weekDays[0], "d MMM", { locale: ru })} - {format(weekDays[6], "d MMM", { locale: ru })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2 min-w-48">Привычка</th>
                    {weekDays.map((day, index) => (
                      <th key={index} className="text-center p-2 min-w-16">
                        <div className="text-sm font-medium">
                          {format(day, "EEE", { locale: ru })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(day, "d")}
                        </div>
                      </th>
                    ))}
                    <th className="text-center p-2">Серия</th>
                    <th className="text-center p-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {habits.map((habit) => (
                    <tr key={habit.id} className="border-t">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${habit.color}`} />
                          <span className="font-medium">{habit.name}</span>
                        </div>
                      </td>
                      {weekDays.map((day, dayIndex) => {
                        const completed = isHabitCompleted(habit.id, day);
                        return (
                          <td key={dayIndex} className="p-2 text-center">
                            <Button
                              variant={completed ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => toggleHabit(habit.id, day)}
                            >
                              {completed ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <div className="w-4 h-4" />
                              )}
                            </Button>
                          </td>
                        );
                      })}
                      <td className="p-2 text-center">
                        <Badge variant="secondary">
                          {getHabitStreak(habit.id)} дней
                        </Badge>
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHabit(habit.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HabitsTracker;
