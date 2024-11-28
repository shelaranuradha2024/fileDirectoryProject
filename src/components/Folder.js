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
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // Track folder expansion state

  // Toggle expand/collapse
  const toggleExpandCollapse = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="folder">
      <h3>
        {/* "+" and "-" button for expand/collapse */}
        <button className="toggle" onClick={toggleExpandCollapse}>
          {isExpanded ? "-" : "+"}
        </button>
        {folder.name}

        {/* Rename and Delete buttons */}
        <div className="folder-buttons">
          <button className="rename" onClick={() => handleRename(folder.id)}>
            Rename
          </button>
          <button className="delete" onClick={() => handleDelete(folder.id)}>
            Delete
          </button>
        </div>
      </h3>

      {/* Create File button (aligned horizontally with other buttons) */}
      <div className="folder-buttons">
        <button className="create-file" onClick={() => handleCreateFile(folder.id)}>
          Create File
        </button>
      </div>

      {/* Render folder contents if expanded */}
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
              />
            ))
          ) : (
            <p>No files in this folder</p>
          )}

          {/* Render subfolders recursively if they exist */}
          {folder.children && folder.children.length > 0 && (
            <div className="subfolders">
              {folder.children.map((subfolder) => (
                <Folder
                  key={subfolder.id}
                  folder={subfolder}
                  handleRename={handleRename}
                  handleDelete={handleDelete}
                  handleRenameFile={handleRenameFile}
                  handleDeleteFile={handleDeleteFile}
                  handleCreateFile={handleCreateFile}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Folder;
