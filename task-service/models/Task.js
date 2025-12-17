const pool = require('../config/db');

class Task {
  /**
   * Create tasks and comments tables
   */
  static async createTable() {
    const tasksQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        project_id INTEGER NOT NULL,
        assigned_to INTEGER,
        created_by INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'todo',
        priority VARCHAR(50) DEFAULT 'medium',
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const commentsQuery = `
      CREATE TABLE IF NOT EXISTS task_comments (
        id SERIAL PRIMARY KEY,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    try {
      await pool.query(tasksQuery);
      await pool.query(commentsQuery);
      console.log('✅ Tasks tables ready');
    } catch (error) {
      console.error('❌ Error creating tasks tables:', error.message);
      throw error;
    }
  }

  /**
   * Create new task
   */
  static async create(taskData) {
    const { title, description, project_id, assigned_to, created_by, status, priority, due_date } = taskData;
    
    const query = `
      INSERT INTO tasks (title, description, project_id, assigned_to, created_by, status, priority, due_date) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      title,
      description || null,
      project_id,
      assigned_to || null,
      created_by,
      status || 'todo',
      priority || 'medium',
      due_date || null
    ]);
    
    return result.rows[0];
  }

  /**
   * Get task by ID
   */
  static async findById(id) {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get all tasks
   */
  static async findAll() {
    const query = 'SELECT * FROM tasks ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Get tasks by project
   */
  static async findByProject(projectId) {
    const query = 'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [projectId]);
    return result.rows;
  }

  /**
   * Get tasks assigned to user
   */
  static async findByAssignee(userId) {
    const query = 'SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY due_date';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Get tasks by status
   */
  static async findByStatus(status) {
    const query = 'SELECT * FROM tasks WHERE status = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [status]);
    return result.rows;
  }

  /**
   * Update task
   */
  static async update(id, updates) {
    const { title, description, assigned_to, status, priority, due_date } = updates;
    
    const query = `
      UPDATE tasks 
      SET 
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        assigned_to = COALESCE($4, assigned_to),
        status = COALESCE($5, status),
        priority = COALESCE($6, priority),
        due_date = COALESCE($7, due_date),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, title, description, assigned_to, status, priority, due_date]);
    return result.rows[0];
  }

  /**
   * Delete task
   */
  static async delete(id) {
    const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Add comment to task
   */
  static async addComment(taskId, userId, comment) {
    const query = `
      INSERT INTO task_comments (task_id, user_id, comment) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    
    const result = await pool.query(query, [taskId, userId, comment]);
    return result.rows[0];
  }

  /**
   * Get task comments
   */
  static async getComments(taskId) {
    const query = 'SELECT * FROM task_comments WHERE task_id = $1 ORDER BY created_at ASC';
    const result = await pool.query(query, [taskId]);
    return result.rows;
  }

  /**
   * Delete comment
   */
  static async deleteComment(commentId) {
    const query = 'DELETE FROM task_comments WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [commentId]);
    return result.rows[0];
  }
}

module.exports = Task;
