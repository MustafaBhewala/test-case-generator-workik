/**
 * User management system with validation and CRUD operations
 * Great example for testing database operations and validation logic
 */
class UserManager {
  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {string} userData.email - User email
   * @param {string} userData.name - User name
   * @param {number} userData.age - User age
   * @returns {Object} Created user with ID
   */
  createUser(userData) {
    const { email, name, age } = userData;

    // Validation
    if (!email || !this.isValidEmail(email)) {
      throw new Error('Valid email is required');
    }

    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    if (age < 0 || age > 150) {
      throw new Error('Age must be between 0 and 150');
    }

    // Check if email already exists
    if (this.findUserByEmail(email)) {
      throw new Error('User with this email already exists');
    }

    const user = {
      id: this.nextId++,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      age: parseInt(age),
      createdAt: new Date(),
      isActive: true
    };

    this.users.set(user.id, user);
    return user;
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Object|null} User object or null if not found
   */
  getUserById(id) {
    return this.users.get(id) || null;
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Object|null} User object or null if not found
   */
  findUserByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email === normalizedEmail) {
        return user;
      }
    }
    return null;
  }

  /**
   * Update user information
   * @param {number} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Object} Updated user
   */
  updateUser(id, updates) {
    const user = this.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (updates.email && updates.email !== user.email) {
      if (!this.isValidEmail(updates.email)) {
        throw new Error('Valid email is required');
      }
      if (this.findUserByEmail(updates.email)) {
        throw new Error('Email already in use');
      }
      user.email = updates.email.toLowerCase().trim();
    }

    if (updates.name !== undefined) {
      if (!updates.name || updates.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }
      user.name = updates.name.trim();
    }

    if (updates.age !== undefined) {
      if (updates.age < 0 || updates.age > 150) {
        throw new Error('Age must be between 0 and 150');
      }
      user.age = parseInt(updates.age);
    }

    user.updatedAt = new Date();
    this.users.set(id, user);
    return user;
  }

  /**
   * Deactivate user (soft delete)
   * @param {number} id - User ID
   * @returns {boolean} Success status
   */
  deactivateUser(id) {
    const user = this.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    user.isActive = false;
    user.deactivatedAt = new Date();
    return true;
  }

  /**
   * Get all active users
   * @returns {Array} Array of active users
   */
  getAllActiveUsers() {
    return Array.from(this.users.values()).filter(user => user.isActive);
  }

  /**
   * Get users by age range
   * @param {number} minAge - Minimum age
   * @param {number} maxAge - Maximum age
   * @returns {Array} Array of users in age range
   */
  getUsersByAgeRange(minAge, maxAge) {
    if (minAge > maxAge) {
      throw new Error('Minimum age cannot be greater than maximum age');
    }

    return Array.from(this.users.values())
      .filter(user => user.isActive && user.age >= minAge && user.age <= maxAge);
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get user statistics
   * @returns {Object} Statistics about users
   */
  getStatistics() {
    const allUsers = Array.from(this.users.values());
    const activeUsers = allUsers.filter(user => user.isActive);
    
    return {
      totalUsers: allUsers.length,
      activeUsers: activeUsers.length,
      inactiveUsers: allUsers.length - activeUsers.length,
      averageAge: activeUsers.length > 0 
        ? activeUsers.reduce((sum, user) => sum + user.age, 0) / activeUsers.length 
        : 0
    };
  }
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UserManager, User };
}
