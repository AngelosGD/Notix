-- Remove authentication dependencies
-- Make user_id nullable and remove foreign key constraints

-- Notes table
ALTER TABLE notes DROP CONSTRAINT notes_user_id_fkey;
ALTER TABLE notes ALTER COLUMN user_id DROP NOT NULL;

-- Tasks table
ALTER TABLE tasks DROP CONSTRAINT tasks_user_id_fkey;
ALTER TABLE tasks ALTER COLUMN user_id DROP NOT NULL;

-- Folders table
ALTER TABLE folders DROP CONSTRAINT folders_user_id_fkey;
ALTER TABLE folders ALTER COLUMN user_id DROP NOT NULL;

-- Drop RLS policies that require authentication
DROP POLICY IF EXISTS "Users can view own notes" ON notes;
DROP POLICY IF EXISTS "Users can insert own notes" ON notes;
DROP POLICY IF EXISTS "Users can update own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON notes;

DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

DROP POLICY IF EXISTS "Users can view own folders" ON folders;
DROP POLICY IF EXISTS "Users can insert own folders" ON folders;
DROP POLICY IF EXISTS "Users can update own folders" ON folders;
DROP POLICY IF EXISTS "Users can delete own folders" ON folders;

-- Enable RLS but allow all operations for anonymous users
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for anonymous access
CREATE POLICY "Allow all operations on notes" ON notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on folders" ON folders FOR ALL USING (true) WITH CHECK (true);