require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const backupDatabase = () => {
  const date = new Date();
  const timestamp = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`;
  
  const backupDir = path.join(__dirname, '../backups');
  const backupPath = path.join(backupDir, `backup_${timestamp}`);

  // Create backups directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Get database name from connection string
  const dbName = process.env.MONGODB_URI.split('/').pop().split('?')[0];

  // MongoDB dump command
  const cmd = `mongodump --uri="${process.env.MONGODB_URI}" --out="${backupPath}"`;

  console.log('⏳ Starting database backup...'.yellow);
  
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Backup failed:'.red, error);
      return;
    }
    
    console.log('✅ Backup completed successfully!'.green.bold);
    console.log(`📁 Backup saved to: ${backupPath}`.cyan);
    
    // Create zip file
    const zipCmd = `cd "${backupDir}" && zip -r "backup_${timestamp}.zip" "backup_${timestamp}"`;
    
    exec(zipCmd, (zipError) => {
      if (!zipError) {
        console.log(`📦 Backup compressed: backup_${timestamp}.zip`.cyan);
        // Remove uncompressed folder
        fs.rmSync(backupPath, { recursive: true, force: true });
      }
    });
  });
};

backupDatabase();