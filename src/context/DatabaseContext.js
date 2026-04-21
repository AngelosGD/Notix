import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const DatabaseContext = createContext()

export function DatabaseProvider({ children }) {
  const [notes, setNotes] = useState([])
  const [tasks, setTasks] = useState([])
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(false)

  // ── NOTAS ────────────────────────────────────────────────────────────────────

  const loadNotes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('deleted', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading notes:', error)
    } else {
      setNotes(data || [])
    }
    setLoading(false)
  }

  const createNote = async (noteData) => {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        title: noteData.title,
        content: noteData.content,
        folder_id: noteData.folderId || null,
        type: noteData.type || 'note',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating note:', error)
      return null
    }

    setNotes(prev => [data, ...prev])
    return data
  }

  const updateNote = async (noteId, updates) => {
    const { data, error } = await supabase
      .from('notes')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', noteId)
      .select()
      .single()

    if (error) {
      console.error('Error updating note:', error)
      return null
    }

    setNotes(prev => prev.map(note =>
      note.id === noteId ? data : note
    ))
    return data
  }

  const deleteNote = async (noteId) => {
    const { error } = await supabase
      .from('notes')
      .update({
        deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq('id', noteId)

    if (error) {
      console.error('Error deleting note:', error)
      return false
    }

    setNotes(prev => prev.filter(note => note.id !== noteId))
    return true
  }

  // ── TAREAS ───────────────────────────────────────────────────────────────────

  const loadTasks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('deleted', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading tasks:', error)
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }

  const createTask = async (taskData) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: taskData.title,
        done: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating task:', error)
      return null
    }

    setTasks(prev => [data, ...prev])
    return data
  }

  const toggleTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return null

    const { data, error } = await supabase
      .from('tasks')
      .update({ done: !task.done })
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      console.error('Error toggling task:', error)
      return null
    }

    setTasks(prev => prev.map(t =>
      t.id === taskId ? data : t
    ))
    return data
  }

  const deleteTask = async (taskId) => {
    const { error } = await supabase
      .from('tasks')
      .update({ deleted: true })
      .eq('id', taskId)

    if (error) {
      console.error('Error deleting task:', error)
      return false
    }

    setTasks(prev => prev.filter(task => task.id !== taskId))
    return true
  }

  // ── CARPETAS ─────────────────────────────────────────────────────────────────

  const loadFolders = async () => {
    const { data, error } = await supabase
      .from('folder_note_count')
      .select('*')
      .order('pinned', { ascending: false })
      .order('name')

    if (error) {
      console.error('Error loading folders:', error)
    } else {
      setFolders(data || [])
    }
  }

  const createFolder = async (folderData) => {
    const { data, error } = await supabase
      .from('folders')
      .insert({
        name: folderData.name,
        pinned: folderData.pinned || false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating folder:', error)
      return null
    }

    // Recargar carpetas para obtener el conteo actualizado
    await loadFolders()
    return data
  }

  // ── EFECTOS ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    loadNotes()
    loadTasks()
    loadFolders()
  }, [])

  const value = {
    // Estado
    notes,
    tasks,
    folders,
    loading,

    // Notas
    loadNotes,
    createNote,
    updateNote,
    deleteNote,

    // Tareas
    loadTasks,
    createTask,
    toggleTask,
    deleteTask,

    // Carpetas
    loadFolders,
    createFolder,
  }

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  )
}

export function useDatabase() {
  return useContext(DatabaseContext)
}