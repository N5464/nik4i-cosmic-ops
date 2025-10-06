/*
  # Create bunker credentials table

  1. New Tables
    - `bunker_creds`
      - `id` (text, primary key) - credential identifier
      - `password` (text) - credential password
      - `user_id` (text, default 'demigod_owner') - user identifier
      - `created_at` (timestamp) - creation timestamp

  2. Security
    - Enable RLS on `bunker_creds` table
    - Add policy for demigod_owner to manage all operations
*/

CREATE TABLE IF NOT EXISTS bunker_creds (
  id text PRIMARY KEY,
  password text NOT NULL,
  user_id text NOT NULL DEFAULT 'demigod_owner',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bunker_creds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow demigod_owner full access"
  ON bunker_creds
  FOR ALL
  TO public
  USING (user_id = 'demigod_owner')
  WITH CHECK (user_id = 'demigod_owner');