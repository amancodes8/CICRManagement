/**
 * Type Definitions and Constants
 * 
 * Central location for all type definitions, interfaces, and constants
 * used throughout the application. While JavaScript doesn't have native
 * types, this file serves as documentation and provides JSDoc types.
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} email - User email address
 * @property {string} name - Full name
 * @property {string} role - User role (admin, member, lead)
 * @property {string} [avatar] - Avatar URL
 * @property {string} [phone] - Phone number
 * @property {string} [department] - Department/Team
 * @property {string} createdAt - Account creation date
 * @property {string} [bio] - User biography
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Unique project identifier
 * @property {string} name - Project name
 * @property {string} description - Project description
 * @property {string} status - Project status (active, completed, on-hold)
 * @property {string} [thumbnail] - Project thumbnail URL
 * @property {string} lead - Project lead user ID
 * @property {string[]} members - Array of member user IDs
 * @property {string} startDate - Project start date
 * @property {string} [endDate] - Project end date
 * @property {number} progress - Project completion percentage (0-100)
 * @property {string[]} [tags] - Project tags
 */

/**
 * @typedef {Object} Meeting
 * @property {string} id - Unique meeting identifier
 * @property {string} title - Meeting title
 * @property {string} description - Meeting description
 * @property {string} date - Meeting date and time
 * @property {string} location - Meeting location or platform
 * @property {string} organizer - Organizer user ID
 * @property {string[]} attendees - Array of attendee user IDs
 * @property {string} status - Meeting status (scheduled, completed, cancelled)
 * @property {string} [meetingLink] - Virtual meeting link
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalProjects - Total number of projects
 * @property {number} activeProjects - Number of active projects
 * @property {number} totalMembers - Total club members
 * @property {number} upcomingMeetings - Number of upcoming meetings
 */

/**
 * @typedef {Object} Announcement
 * @property {string} id - Unique announcement identifier
 * @property {string} title - Announcement title
 * @property {string} content - Announcement content
 * @property {string} author - Author user ID
 * @property {string} createdAt - Creation date
 * @property {string} priority - Priority level (high, medium, low)
 */

/**
 * @typedef {Object} AuthState
 * @property {User | null} user - Current authenticated user
 * @property {boolean} isLoading - Loading state
 * @property {boolean} isAuthenticated - Authentication status
 */

// API Response Types
/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Request success status
 * @property {any} data - Response data
 * @property {string} [message] - Response message
 * @property {string} [error] - Error message if failed
 */

// Form Types
/**
 * @typedef {Object} LoginForm
 * @property {string} email - User email
 * @property {string} password - User password
 */

/**
 * @typedef {Object} RegisterForm
 * @property {string} name - Full name
 * @property {string} email - Email address
 * @property {string} password - Password
 * @property {string} confirmPassword - Password confirmation
 * @property {string} [department] - Department/Team
 */

// Constants
export const USER_ROLES = {
  ADMIN: 'admin',
  LEAD: 'lead',
  MEMBER: 'member',
};

export const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ON_HOLD: 'on-hold',
};

export const MEETING_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PROJECTS: '/projects',
  MEETINGS: '/meetings',
  ADMIN: '/admin',
  AUTH: '/auth',
};