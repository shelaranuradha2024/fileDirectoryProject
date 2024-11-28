import React, { useState, useEffect } from "react";
import "../styles/FileManager.css";
import Folder from "./Folder";

const FileManager = () => {
  const [directories, setDirectories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/folders")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch folders");
        }
        return response.json();
      })
      .then((data) => {
        setDirectories(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error loading directories");
        setLoading(false);
        console.error(err);
      });
  }, []);

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name");
    if (folderName) {
      const response = await fetch("http://localhost:5000/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: folderName }),
      });
      const newFolder = await response.json();
      setDirectories((prev) => [...prev, newFolder]);
    }
  };

  const handleCreateFile = async (folderId) => {
    const fileName = prompt("Enter file name");
    if (fileName) {
      const response = await fetch("http://localhost:5000/api/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderId, name: fileName }),
      });
      const newFile = await response.json();
      setDirectories((prev) =>
        prev.map((folder) =>
          folder.id === folderId
            ? { ...folder, files: [...(folder.files || []), newFile] }
            : folder
        )
      );
    }
  };

  const handleRename = async (id) => {
    const newName = prompt("Enter new folder name");
    if (newName) {
      const response = await fetch(`http://localhost:5000/api/folders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });
      const updatedFolder = await response.json();
      setDirectories((prev) =>
        prev.map((folder) =>
          folder.id === id ? { ...folder, name: updatedFolder.name } : folder
        )
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this folder?"
    );
    if (confirmDelete) {
      await fetch(`http://localhost:5000/api/folders/${id}`, { method: "DELETE" });
      setDirectories((prev) => prev.filter((folder) => folder.id !== id));
    }
  };

  const handleRenameFile = async (fileId, folderId) => {
    const newName = prompt("Enter new file name");
    if (newName) {
      const response = await fetch(`http://localhost:5000/api/files/${fileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });
      const updatedFile = await response.json();
      setDirectories((prev) =>
        prev.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                files: folder.files.map((file) =>
                  file.id === fileId ? updatedFile : file
                ),
              }
            : folder
        )
      );
    }
  };

  const handleDeleteFile = async (fileId, folderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (confirmDelete) {
      await fetch(`http://localhost:5000/api/files/${fileId}`, { method: "DELETE" });
      setDirectories((prev) =>
        prev.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                files: folder.files.filter((file) => file.id !== fileId),
              }
            : folder
        )
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="file-manager">
      <button className="create-folder" onClick={handleCreateFolder}>
        Create Folder
      </button>
      <div>
        {directories.map((dir) => (
          <Folder
            key={dir.id}
            folder={dir}
            handleRename={handleRename}
            handleDelete={handleDelete}
            handleRenameFile={handleRenameFile}
            handleDeleteFile={handleDeleteFile}
            handleCreateFile={handleCreateFile}
          />
        ))}
      </div>
    </div>
  );
};

export default FileManager;
