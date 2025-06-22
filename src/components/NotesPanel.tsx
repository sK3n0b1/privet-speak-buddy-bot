
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotesPanel = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Новая заметка',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!selectedNote) return;

    const updatedNote = {
      ...selectedNote,
      title: editTitle || 'Без названия',
      content: editContent,
      updatedAt: new Date()
    };

    setNotes(notes.map(note => 
      note.id === selectedNote.id ? updatedNote : note
    ));
    setSelectedNote(updatedNote);
    setIsEditing(false);
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  const startEditing = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Список заметок */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Заметки</CardTitle>
            <Button onClick={createNewNote} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск заметок..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2 max-h-96 overflow-y-auto p-4">
            {filteredNotes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {searchTerm ? 'Заметки не найдены' : 'Нет заметок'}
              </p>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                    selectedNote?.id === note.id ? 'bg-muted border-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsEditing(false);
                  }}
                >
                  <h4 className="font-medium truncate">{note.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {note.content || 'Пустая заметка'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(note.updatedAt, "d MMM, HH:mm", { locale: ru })}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Редактор заметок */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {selectedNote ? (isEditing ? 'Редактирование' : selectedNote.title) : 'Выберите заметку'}
            </CardTitle>
            {selectedNote && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={saveNote} size="sm">
                      Сохранить
                    </Button>
                    <Button 
                      onClick={() => setIsEditing(false)} 
                      variant="outline" 
                      size="sm"
                    >
                      Отмена
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => startEditing(selectedNote)} 
                      variant="outline" 
                      size="sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => deleteNote(selectedNote.id)} 
                      variant="destructive" 
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!selectedNote ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Выберите заметку для просмотра или создайте новую</p>
            </div>
          ) : isEditing ? (
            <div className="space-y-4">
              <Input
                placeholder="Название заметки"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <Textarea
                placeholder="Содержание заметки..."
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-96 resize-none"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Создано: {format(selectedNote.createdAt, "d MMMM yyyy, HH:mm", { locale: ru })}
                {selectedNote.updatedAt.getTime() !== selectedNote.createdAt.getTime() && (
                  <span className="ml-2">
                    • Изменено: {format(selectedNote.updatedAt, "d MMMM yyyy, HH:mm", { locale: ru })}
                  </span>
                )}
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {selectedNote.content || (
                  <span className="text-muted-foreground italic">Заметка пуста</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesPanel;
