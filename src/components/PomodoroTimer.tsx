
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 минут в секундах
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const { toast } = useToast();

  const workTime = 25 * 60;
  const breakTime = 5 * 60;
  const longBreakTime = 15 * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Время истекло
      if (isBreak) {
        // Перерыв закончился, начинаем работу
        setTimeLeft(workTime);
        setIsBreak(false);
        toast({
          title: "Перерыв окончен!",
          description: "Время вернуться к работе",
        });
      } else {
        // Рабочая сессия закончилась
        const newSessions = sessions + 1;
        setSessions(newSessions);
        
        if (newSessions % 4 === 0) {
          // Длинный перерыв каждую 4-ю сессию
          setTimeLeft(longBreakTime);
          toast({
            title: "Длинный перерыв!",
            description: "Отдохните 15 минут",
          });
        } else {
          // Короткий перерыв
          setTimeLeft(breakTime);
          toast({
            title: "Короткий перерыв!",
            description: "Отдохните 5 минут",
          });
        }
        setIsBreak(true);
      }
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isBreak, sessions, toast]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? (sessions % 4 === 0 ? longBreakTime : breakTime) : workTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isBreak ? 'Перерыв' : 'Работа'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Сессий завершено: {sessions}
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-6xl font-mono font-bold text-primary">
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex justify-center gap-4">
            <Button onClick={toggleTimer} size="lg">
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isActive ? 'Пауза' : 'Старт'}
            </Button>
            
            <Button onClick={resetTimer} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5" />
              Сброс
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Техника Pomodoro</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 25 минут работы</li>
              <li>• 5 минут короткий перерыв</li>
              <li>• 15 минут длинный перерыв каждые 4 сессии</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PomodoroTimer;
