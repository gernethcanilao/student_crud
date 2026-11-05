import React, { useState, useEffect } from 'react';
import { validateStudent } from '../utils/validation';

export default function StudentForm({ editingStudent, onSubmit, onCancelEdit, isSubmitting }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    course: '',
    section: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        firstname: editingStudent.firstname || '',
        lastname: editingStudent.lastname || '',
        course: editingStudent.course || '',
        section: editingStudent.section || '',
      });
      setErrors({});
    } else {
      setFormData({
        firstname: '',
        lastname: '',
        course: '',
        section: '',
      });
      setErrors({});
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateStudent(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  const handleReset = () => {
    if (editingStudent) {
      onCancelEdit();
    } else {
      setFormData({ firstname: '', lastname: '', course: '', section: '' });
      setErrors({});
    }
  };

  const isEditMode = Boolean(editingStudent);

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm overflow-hidden ${
      isEditMode ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
    }`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b flex items-center justify-between ${
        isEditMode ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50/70 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
            isEditMode ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white'
          }`}>
            {isEditMode ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {isEditMode ? `Edit Student #${editingStudent.id}` : 'Enroll New Student'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditMode
                ? 'Update student details and save changes'
                : 'Fill in the information below to register a student'}
            </p>
          </div>
        </div>

        {isEditMode && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Editing Mode
          </span>
        )}
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstname" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              First Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="e.g. John"
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 ${
                errors.firstname
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              } disabled:bg-slate-50 disabled:text-slate-500`}
            />
            {errors.firstname && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.firstname}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastname" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Last Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="e.g. Doe"
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 ${
                errors.lastname
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              } disabled:bg-slate-50 disabled:text-slate-500`}
            />
            {errors.lastname && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.lastname}</p>
            )}
          </div>

          {/* Course */}
          <div>
            <label htmlFor="course" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Course / Degree <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="course"
              name="course"
              list="course-suggestions"
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g. BSCS, BSIT, BSIS"
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 ${
                errors.course
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              } disabled:bg-slate-50 disabled:text-slate-500`}
            />
            <datalist id="course-suggestions">
              <option value="BSCS" />
              <option value="BSIT" />
              <option value="BSIS" />
              <option value="BSCpE" />
            </datalist>
            {errors.course && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.course}</p>
            )}
          </div>

          {/* Section */}
          <div>
            <label htmlFor="section" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Section <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="e.g. 3A, 3B, 4A"
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 ${
                errors.section
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              } disabled:bg-slate-50 disabled:text-slate-500`}
            />
            {errors.section && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.section}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isEditMode ? 'Cancel Edit' : 'Clear Form'}
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl text-white shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50 ${
              isEditMode
                ? 'bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-amber-200'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-200'
            }`}
          >
            {isSubmitting && (
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            )}
            <span>
              {isSubmitting
                ? (isEditMode ? 'Updating...' : 'Adding...')
                : (isEditMode ? 'Update Student' : 'Add Student')}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
