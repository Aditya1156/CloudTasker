const pool = require('../config/db');

class UserProfile {
  /**
   * Create user_profiles table
   */
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL,
        bio TEXT,
        avatar_url VARCHAR(255),
        phone VARCHAR(20),
        location VARCHAR(100),
        role VARCHAR(50) DEFAULT 'user',
        department VARCHAR(100),
        skills TEXT[],
        updated_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    try {
      await pool.query(query);
      console.log('✅ User profiles table ready');
    } catch (error) {
      console.error('❌ Error creating user_profiles table:', error.message);
      throw error;
    }
  }

  /**
   * Create user profile
   */
  static async create(userId, profileData) {
    const { bio, avatar_url, phone, location, role, department, skills } = profileData;
    
    const query = `
      INSERT INTO user_profiles (user_id, bio, avatar_url, phone, location, role, department, skills) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      userId, 
      bio || null, 
      avatar_url || null, 
      phone || null, 
      location || null, 
      role || 'user',
      department || null,
      skills || []
    ]);
    
    return result.rows[0];
  }

  /**
   * Get profile by user ID
   */
  static async findByUserId(userId) {
    const query = 'SELECT * FROM user_profiles WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Update profile
   */
  static async update(userId, updates) {
    const { bio, avatar_url, phone, location, role, department, skills } = updates;
    
    const query = `
      UPDATE user_profiles 
      SET 
        bio = COALESCE($2, bio),
        avatar_url = COALESCE($3, avatar_url),
        phone = COALESCE($4, phone),
        location = COALESCE($5, location),
        role = COALESCE($6, role),
        department = COALESCE($7, department),
        skills = COALESCE($8, skills),
        updated_at = NOW()
      WHERE user_id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      userId,
      bio,
      avatar_url,
      phone,
      location,
      role,
      department,
      skills
    ]);
    
    return result.rows[0];
  }

  /**
   * Delete profile
   */
  static async delete(userId) {
    const query = 'DELETE FROM user_profiles WHERE user_id = $1 RETURNING *';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Get all profiles
   */
  static async findAll() {
    const query = 'SELECT * FROM user_profiles ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Search profiles by role
   */
  static async findByRole(role) {
    const query = 'SELECT * FROM user_profiles WHERE role = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [role]);
    return result.rows;
  }
}

module.exports = UserProfile;
