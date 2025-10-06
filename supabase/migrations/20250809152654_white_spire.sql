/*
  # BlackWire Messages Table

  1. New Tables
    - `blackwire_messages`
      - `id` (bigint, primary key, auto-increment)
      - `created_at` (timestamp with time zone, default now())
      - `user_id` (text, default 'demigod_owner')
      - `session_id` (text, required for grouping chat sessions)
      - `sender` (text, 'user' or 'agent')
      - `message_content` (text, the actual chat message)
      - `is_saved` (boolean, default false, tracks explicitly saved messages)

  2. Security
    - Enable RLS on `blackwire_messages` table
    - Add policies for demigod_owner to insert, select, update, and delete
*/

CREATE TABLE IF NOT EXISTS blackwire_messages (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id text DEFAULT 'demigod_owner' NOT NULL,
  session_id text NOT NULL,
  sender text NOT NULL CHECK (sender IN ('user', 'agent')),
  message_content text NOT NULL,
  is_saved boolean DEFAULT false NOT NULL
);

ALTER TABLE blackwire_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow demigod_owner full access to blackwire_messages"
  ON blackwire_messages
  FOR ALL
  TO public
  USING (user_id = 'demigod_owner')
  WITH CHECK (user_id = 'demigod_owner');

-- Create index for better performance on session queries
CREATE INDEX IF NOT EXISTS idx_blackwire_messages_session_id ON blackwire_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_blackwire_messages_created_at ON blackwire_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blackwire_messages_is_saved ON blackwire_messages(is_saved) WHERE is_saved = true;