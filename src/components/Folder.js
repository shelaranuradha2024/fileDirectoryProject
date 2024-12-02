import React, { useState } from "react";
import File from "./File";
import "../styles/Folder.css";

const Folder = ({
  folder,
  handleRename,
  handleDelete,
  handleRenameFile,
  handleDeleteFile,
  handleCreateFile,
  handleDragStart,
  handleDrop,
  handleDragOver,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle expand/collapse
  const toggleExpandCollapse = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="folder"
      onDragOver={handleDragOver} // Allow drop only for files
      onDrop={(e) => handleDrop(e, folder.id)} // Drop handler for files only
    >
      <h3>
        <button className="toggle" onClick={toggleExpandCollapse}>
          {isExpanded ? "-" : "+"}
        </button>
        {folder.name}

        <div className="folder-buttons">
          <button className="rename" onClick={() => handleRename(folder.id)}>
            Rename
          </button>
          <button className="delete" onClick={() => handleDelete(folder.id)}>
            Delete
          </button>
        </div>
      </h3>

      <div className="folder-buttons">
        <button className="create-file" onClick={() => handleCreateFile(folder.id)}>
          Create File
        </button>
      </div>

      {isExpanded && (
        <div className="folder-contents">
          {folder.files && folder.files.length > 0 ? (
            folder.files.map((file) => (
              <File
                key={file.id}
                file={file}
                folderId={folder.id}
                handleRenameFile={handleRenameFile}
                handleDeleteFile={handleDeleteFile}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
              />
            ))
          ) : (
            <p>No files in this folder</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Folder;
