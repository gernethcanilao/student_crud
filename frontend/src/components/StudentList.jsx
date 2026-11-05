import React, { useState, useMemo } from 'react';
import StudentRow from './StudentRow';

export default function StudentList({
  students,
  isLoading,
  editingStudent,
  onEditStudent,
  onDeleteStudent,
  deletingId,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');

  // Extract unique courses for filter dropdown
  const uniqueCourses = useMemo(() => {
    const courses = new Set();
    students.forEach((s) => {
      if (s.course && s.course.trim()) {
        courses.add(s.course.trim().toUpperCase());
      }
    });
    return Array.from(courses).sort();
  }, [students]);

  // Filter students based on search and course filter
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (student.firstname && student.firstname.toLowerCase().includes(q)) ||
        (student.lastname && student.lastname.toLowerCase().includes(q)) ||
        (student.course && student.course.toLowerCase().includes(q)) ||
        (student.section && student.section.toLowerCase().includes(q)) ||
        String(student.id).includes(q);

      const matchesCourse =
        selectedCourse === 'ALL' ||
        (student.course && student.course.toUpperCase() === selectedCourse);

      return matchesSearch && matchesCourse;
    });
  }, [students, searchTerm, selectedCourse]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Search & Filter Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, course, section..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-white border border-slate-300 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Courses</option>
            {uniqueCourses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {(searchTerm || selectedCourse !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCourse('ALL');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 px-2 py-1 rounded cursor-pointer whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="px-6 py-3.5">ID</th>
              <th scope="col" className="px-6 py-3.5">Student</th>
              <th scope="col" className="px-6 py-3.5">Course</th>
              <th scope="col" className="px-6 py-3.5">Section</th>
              <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="border-b border-slate-100 animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 w-8 bg-slate-200 rounded"></div></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-32 bg-slate-200 rounded"></div>
                        <div className="h-3 w-16 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="h-5 w-16 bg-slate-200 rounded-md"></div></td>
                  <td className="px-6 py-4"><div className="h-5 w-12 bg-slate-200 rounded-md"></div></td>
                  <td className="px-6 py-4 text-right"><div className="h-7 w-28 bg-slate-200 rounded-lg ml-auto"></div></td>
                </tr>
              ))
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                      {students.length === 0 ? 'No Students Found' : 'No Matching Results'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {students.length === 0
                        ? 'Get started by creating your first student record in the form.'
                        : `No student matches "${searchTerm}". Try a different search term or reset filters.`}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  isEditing={editingStudent && editingStudent.id === student.id}
                  onEdit={onEditStudent}
                  onDelete={onDeleteStudent}
                  isDeleting={deletingId === student.id}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count indicator */}
      {!isLoading && (
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="font-semibold text-slate-800">{filteredStudents.length}</strong> of{' '}
            <strong className="font-semibold text-slate-800">{students.length}</strong> total records
          </span>
          {searchTerm && (
            <span className="text-slate-400">
              Filtered by: "{searchTerm}"
            </span>
          )}
        </div>
      )}
    </div>
  );
}
