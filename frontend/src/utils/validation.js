/**
 * Validate student form fields
 * @param {Object} student
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateStudent(student) {
  const errors = {};

  if (!student.firstname || !student.firstname.trim()) {
    errors.firstname = 'First name is required';
  } else if (student.firstname.trim().length < 2) {
    errors.firstname = 'First name must be at least 2 characters';
  }

  if (!student.lastname || !student.lastname.trim()) {
    errors.lastname = 'Last name is required';
  } else if (student.lastname.trim().length < 2) {
    errors.lastname = 'Last name must be at least 2 characters';
  }

  if (!student.course || !student.course.trim()) {
    errors.course = 'Course is required';
  }

  if (!student.section || !student.section.trim()) {
    errors.section = 'Section is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
