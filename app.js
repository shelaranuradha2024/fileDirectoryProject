const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = 5000;

// PostgreSQL connection settings
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'Anuradha#24',
  database: 'fileDirectory',
});

app.use(cors()); // To allow frontend to access the API
app.use(express.json()); // To parse JSON requests

// Root route to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Fetch the list of folders and files
app.get('/api/folders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM folders WHERE parent_folder_id IS NULL');
    const folders = result.rows;

    // Fetch subfolders and files for each folder
    for (const folder of folders) {
      const subfoldersResult = await pool.query('SELECT * FROM folders WHERE parent_folder_id = $1', [folder.id]);
      folder.children = subfoldersResult.rows;

      const filesResult = await pool.query('SELECT * FROM files WHERE folder_id = $1', [folder.id]);
      folder.files = filesResult.rows;

      for (const subfolder of folder.children) {
        const subfolderFiles = await pool.query('SELECT * FROM files WHERE folder_id = $1', [subfolder.id]);
        subfolder.files = subfolderFiles.rows;
      }
    }

    res.json(folders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching folders');
  }
});

// Create a new folder
app.post('/api/folders', async (req, res) => {
  const { name, parent_folder_id } = req.body;
  try {
    const result = await pool.query('INSERT INTO folders (name, parent_folder_id) VALUES ($1, $2) RETURNING *', [name, parent_folder_id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating folder');
  }
});

// Rename a folder
app.put('/api/folders/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query('UPDATE folders SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Folder not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error renaming folder');
  }
});

// Delete a folder
app.delete('/api/folders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM folders WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Folder not found');
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting folder');
  }
});

// Create a new file in a folder
app.post('/api/files', async (req, res) => {
  const { name, folderId } = req.body;
  try {
    const result = await pool.query('INSERT INTO files (name, folder_id) VALUES ($1, $2) RETURNING *', [name, folderId]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating file');
  }
});

// Rename a file
app.put('/api/files/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query('UPDATE files SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    if (result.rowCount === 0) {
      return res.status(404).send('File not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error renaming file:', err);
    res.status(500).send('Error renaming file');
  }
});

// Delete a file
app.delete('/api/files/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM files WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('File not found');
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting file');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
