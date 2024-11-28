import React from "react";

const File = ({ file, folderId, handleRenameFile, handleDeleteFile }) => {
  return (
    <div className="file">
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