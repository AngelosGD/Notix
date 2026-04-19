// src/screens/AddTask/AddTask.jsx
import React, { useState } from 'react';
import AddTaskModal from './AddTaskModal';

const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Comprar despensa',
    subtitle: 'Hoy · Personal',
    tag: 'URGENTE',
    tagColor: '#FF4444',
    borderColor: '#FF4444',
    completed: false,
  },
  {
    id: '2',
    title: 'Revisar pull request',
    subtitle: 'Hoy · Trabajo',
    tag: 'TRABAJO',
    tagColor: '#6C63FF',
    borderColor: '#F5C518',
    completed: false,
  },
  {
    id: '3',
    title: 'Correo enviado',
    subtitle: 'Completado 14:30',
    tag: null,
    tagColor: null,
    borderColor: '#3D3D3D',
    completed: true,
  },
];

const UPCOMING_COUNT = 3;

export default function AddTask() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState('Todas'); // 'Todas' | 'Activas' | 'Hechas'
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    if (filter === 'Activas') return !t.completed && matchesSearch;
    if (filter === 'Hechas') return t.completed && matchesSearch;
    return matchesSearch;
  });

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (newTask) => {
    setTasks((prev) => [
      ...prev,
      { ...newTask, id: Date.now().toString(), completed: false },
    ]);
  };

  return (
    <AddTaskModal
      tasks={filteredTasks}
      filter={filter}
      search={search}
      upcomingCount={UPCOMING_COUNT}
      onFilterChange={setFilter}
      onSearchChange={setSearch}
      onToggleTask={toggleTask}
      onAddTask={addTask}
    />
  );
}