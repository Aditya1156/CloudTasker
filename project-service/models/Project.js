const pool = require('../config/db');

class Project {
  /**
   * Create projects table
   */
  static async createTable() {
    const projectsQuery = `
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        owner_id INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const membersQuery = `
      CREATE TABLE IF NOT EXISTS project_members (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL,
        role VARCHAR(50) DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    try {
      await pool.query(projectsQuery);
      await pool.query(membersQuery);
      console.log('✅ Projects tables ready');
    } catch (error) {
      console.error('❌ Error creating projects tables:', error.message);
      throw error;
    }
  }

  /**
   * Create new project
   */
  static async create(projectData) {
    const { name, description, owner_id, status, start_date, end_date } = projectData;
    
    const query = `
      INSERT INTO projects (name, description, owner_id, status, start_date, end_date) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      name, 
      description || null, 
      owner_id, 
      status || 'active',
      start_date || null,
      end_date || null
    ]);
    
    return result.rows[0];
  }

  /**
   * Get project by ID
   */
  static async findById(id) {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get all projects
   */
  static async findAll() {
    const query = 'SELECT * FROM projects ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Get projects by owner
   */
  static async findByOwner(ownerId) {
    const query = 'SELECT * FROM projects WHERE owner_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [ownerId]);
    return result.rows;
  }

  /**
   * Update project
   */
  static async update(id, updates) {
    const { name, description, status, start_date, end_date } = updates;
    
    const query = `
      UPDATE projects 
      SET 
        name = COALESCE($2, name),
        description = COALESCE($3, description),
        status = COALESCE($4, status),
        start_date = COALESCE($5, start_date),
        end_date = COALESCE($6, end_date),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, name, description, status, start_date, end_date]);
    return result.rows[0];
  }

  /**
   * Delete project
   */
  static async delete(id) {
    const query = 'DELETE FROM projects WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Add member to project
   */
  static async addMember(projectId, userId, role = 'member') {
    const query = `
      INSERT INTO project_members (project_id, user_id, role) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    
    const result = await pool.query(query, [projectId, userId, role]);
    return result.rows[0];
  }

  /**
   * Get project members
   */
  static async getMembers(projectId) {
    const query = 'SELECT * FROM project_members WHERE project_id = $1 ORDER BY joined_at';
    const result = await pool.query(query, [projectId]);
    return result.rows;
  }

  /**
   * Remove member from project
   */
  static async removeMember(projectId, userId) {
    const query = 'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2 RETURNING *';
    const result = await pool.query(query, [projectId, userId]);
    return result.rows[0];
  }

  /**
   * Get projects where user is a member
   */
  static async findByMember(userId) {
    const query = `
      SELECT p.*, pm.role as member_role 
      FROM projects p
      INNER JOIN project_members pm ON p.id = pm.project_id
      WHERE pm.user_id = $1
      ORDER BY p.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = Project;
