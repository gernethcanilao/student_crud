/**
 * Resolves the backend base URL dynamically:
 * - When deployed on Render or provided via VITE_API_BASE_URL: uses the remote URL
 * - In local dev (when unset): uses relative path '' so Vite's dev proxy forwards to localhost:8080
 */
function getApiRoot() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    const withoutProto = clean.replace(/^https?:\/\//i, '');
    if (!withoutProto.includes('.') && !withoutProto.includes('localhost')) {
      clean = `https://${withoutProto}.onrender.com`;
    } else if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    return clean;
  }
  return '';
}

const BASE_URL = `${getApiRoot()}/canilao/students`;

/**
 * Handle API responses with uniform error parsing
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = typeof data === 'string' && data ? data : response.statusText || 'Request failed';
    throw new Error(errorMsg);
  }

  return data;
}

export const studentService = {
  /**
   * Fetch all students
   * @returns {Promise<Array>} List of students
   */
  async getAllStudents() {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  },

  /**
   * Fetch a single student by ID
   * @param {number|string} id
   * @returns {Promise<Object>} Student object
   */
  async getStudentById(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  },

  /**
   * Create a new student
   * @param {Object} student - { firstname, lastname, course, section }
   * @returns {Promise<Object>} Created student
   */
  async createStudent(student) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        firstname: student.firstname.trim(),
        lastname: student.lastname.trim(),
        course: student.course.trim(),
        section: student.section.trim(),
      }),
    });
    return handleResponse(response);
  },

  /**
   * Update an existing student
   * @param {number|string} id
   * @param {Object} student - { firstname, lastname, course, section }
   * @returns {Promise<Object>} Updated student
   */
  async updateStudent(id, student) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        firstname: student.firstname.trim(),
        lastname: student.lastname.trim(),
        course: student.course.trim(),
        section: student.section.trim(),
      }),
    });
    return handleResponse(response);
  },

  /**
   * Delete a student by ID
   * @param {number|string} id
   * @returns {Promise<string>} Confirmation message
   */
  async deleteStudent(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
