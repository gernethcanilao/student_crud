import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import Toast from './components/Toast';
import { studentService } from './services/studentService';
import './App.css';

export default function App() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [toast, setToast] = useState(null);
  const formRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Fetch all students from backend
  const loadStudents = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const data = await studentService.getAllStudents();
      const list = Array.isArray(data) ? data : [];
      setStudents(list);

      if (isManualRefresh) {
        showToast('Student records refreshed successfully.', 'info');
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      showToast(
        err.message || 'Unable to connect to Student API. Ensure backend is running.',
        'error'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Handle Form Submission (Add or Update)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingStudent) {
        // Update existing student
        const updated = await studentService.updateStudent(editingStudent.id, formData);
        showToast(`Student #${updated.id} (${updated.firstname} ${updated.lastname}) updated successfully!`);
        setEditingStudent(null);
      } else {
        // Create new student
        const created = await studentService.createStudent(formData);
        showToast(`Student #${created.id} (${created.firstname} ${created.lastname}) registered successfully!`);
      }
      await loadStudents();
    } catch (err) {
      console.error('Save failed:', err);
      showToast(err.message || 'Failed to save student record.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDeleteStudent = async (id) => {
    setDeletingId(id);
    try {
      await studentService.deleteStudent(id);
      showToast(`Student #${id} was deleted successfully.`);
      if (editingStudent && editingStudent.id === id) {
        setEditingStudent(null);
      }
      await loadStudents();
    } catch (err) {
      console.error('Delete failed:', err);
      showToast(err.message || `Failed to delete student #${id}.`, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Trigger Edit
  const handleSelectEdit = (student) => {
    setEditingStudent(student);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        studentCount={students.length}
        onRefresh={() => loadStudents(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Hero Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Management Portal
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Create, view, update, and manage student enrollments in real time with Spring Boot backend API.
          </p>
        </div>

        {/* Modal-Free Split Layout: Form & List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Card (Sticky on desktop) */}
          <div ref={formRef} className="lg:col-span-5 lg:sticky lg:top-24">
            <StudentForm
              editingStudent={editingStudent}
              onSubmit={handleFormSubmit}
              onCancelEdit={handleCancelEdit}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right Column: Student Data Table */}
          <div className="lg:col-span-7">
            <StudentList
              students={students}
              isLoading={isLoading}
              editingStudent={editingStudent}
              onEditStudent={handleSelectEdit}
              onDeleteStudent={handleDeleteStudent}
              deletingId={deletingId}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        DA3A Student CRUD • Vite + React + Tailwind CSS • Spring Boot API
      </footer>

      {/* Feedback Toast Notification */}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
