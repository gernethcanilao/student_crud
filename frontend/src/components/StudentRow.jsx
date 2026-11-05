import React, { useState } from 'react';

export default function StudentRow({
  student,
  isEditing,
  onEdit,
  onDelete,
  isDeleting,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  const handleConfirmDelete = () => {
    onDelete(student.id);
  };

  return (
    <tr
      className={`transition-colors border-b border-slate-100 ${
        isEditing
          ? 'bg-amber-50/60 font-medium'
          : 'hover:bg-slate-50/80 bg-white'
      }`}
    >
      {/* ID */}
      <td className="px-6 py-4 whitespace-nowrap text-xs font-mono font-semibold text-slate-500">
        #{student.id}
      </td>

      {/* Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold uppercase shrink-0">
            {student.firstname ? student.firstname.charAt(0) : '?'}
            {student.lastname ? student.lastname.charAt(0) : ''}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {student.firstname} {student.lastname}
            </div>
            <div className="text-xs text-slate-400">
              Student ID: {student.id}
            </div>
          </div>
        </div>
      </td>

      {/* Course */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
          {student.course}
        </span>
      </td>

      {/* Section */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {student.section}
        </span>
      </td>

      {/* Actions (Modal-Free) */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
        {confirmDelete ? (
          <div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-rose-50 border border-rose-200 animate-fade-in">
            <span className="text-[11px] font-semibold text-rose-700 px-1.5">
              Confirm?
            </span>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-2 py-1 rounded-md bg-rose-600 text-white font-semibold hover:bg-rose-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button
              type="button"
              onClick={handleCancelDelete}
              disabled={isDeleting}
              className="px-2 py-1 rounded-md bg-white text-slate-600 border border-slate-300 font-medium hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(student)}
              title="Edit student"
              className={`px-3 py-1.5 rounded-lg font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-1 border ${
                isEditing
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>{isEditing ? 'Editing' : 'Edit'}</span>
            </button>

            <button
              type="button"
              onClick={handleDeleteClick}
              title="Delete student"
              className="px-3 py-1.5 rounded-lg font-medium text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
