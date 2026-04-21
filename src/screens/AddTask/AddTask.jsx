// src/screens/AddTask/AddTask.jsx
import React, { useState } from 'react';
import AddTaskModal from './AddTaskModal';
import { useDatabase } from '../../context/DatabaseContext';
import { useTheme } from '../../context/ThemeContext';

const UPCOMING_COUNT = 3;

export default function AddTask({ navigation }) {
  const { tasks, createTask, toggleTask, deleteTask } = useDatabase();
  const { accent } = useTheme();
  const [filter, setFilter] = useState('Todas'); // 'Todas' | 'Activas' | 'Hechas'
  const [search, setSearch] = useState('');

  // ── Formatear tareas para el componente ──────────────────────────────────────
  const formattedTasks = tasks.map(task => ({
    id: task.id,
    title: task.title,
    subtitle: `Creada ${new Date(task.created_at).toLocaleDateString()}`,
    tag: null,
    tagColor: null,
    borderColor: task.done ? '#3D3D3D' : accent,
    completed: task.done,
  }));

  const filteredTasks = formattedTasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    if (filter === 'Activas') return !t.completed && matchesSearch;
    if (filter === 'Hechas') return t.completed && matchesSearch;
    return matchesSearch;
  });

  const handleToggleTask = async (id) => {
    await toggleTask(id);
  };

  const handleAddTask = async (newTask) => {
    await createTask({ title: newTask.title });
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
  };

  return (
    <AddTaskModal
      tasks={filteredTasks}
      filter={filter}
      search={search}
      upcomingCount={UPCOMING_COUNT}
      onFilterChange={setFilter}
      onSearchChange={setSearch}
      onToggleTask={handleToggleTask}
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
      navigation={navigation}
    />
  );
}