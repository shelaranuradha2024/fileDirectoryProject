import React from "react";
import "../styles/File.css";

const File = ({ file, folderId, handleRenameFile, handleDeleteFile, handleDragStart }) => {
  return (
    <div
      className="file"
      draggable
      onDragStart={(e) => handleDragStart(e, { ...file, folderId }, "file")}
    >
      <span>{file.name}</span>
      <div className="file-actions">
        <button className="rename" onClick={() => handleRenameFile(file.id, folderId)}>
          Rename
        </button>
        <button className="delete" onClick={() => handleDeleteFile(file.id, folderId)}>
        Delete
      </button>
    </div>
  </div>
);
};

export default File;
