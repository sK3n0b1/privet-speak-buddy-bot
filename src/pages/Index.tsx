
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, StickyNote, Target } from "lucide-react";
import PomodoroTimer from '../components/PomodoroTimer';
import TaskCalendar from '../components/TaskCalendar';
import NotesPanel from '../components/NotesPanel';
import HabitsTracker from '../components/HabitsTracker';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Тайм-менеджер
        </h1>
        
        <Tabs defaultValue="pomodoro" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="pomodoro" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pomodoro
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Календарь
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              Заметки
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Привычки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pomodoro">
            <PomodoroTimer />
          </TabsContent>

          <TabsContent value="calendar">
            <TaskCalendar />
          </TabsContent>

          <TabsContent value="notes">
            <NotesPanel />
          </TabsContent>

          <TabsContent value="habits">
            <HabitsTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
