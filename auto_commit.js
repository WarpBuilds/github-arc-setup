const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Define the repository path
const repoPath = "posthog";
const frontendDir = path.join(repoPath, "frontend");
const maxRunTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const intervalTime = 1 * 60 * 1000; // 1 minutes in milliseconds

// Set up git configuration
const setupGitConfig = () => {
  console.log("Setting up git config...");
  exec(
    'git config user.name "Auto Commit Script"',
    { cwd: repoPath },
    (err) => {
      if (err) console.error("Error setting git user.name:", err);
      else console.log("Git user.name set to 'Auto Commit Script'");
    }
  );

  exec(
    'git config user.email "auto_commit@example.com"',
    { cwd: repoPath },
    (err) => {
      if (err) console.error("Error setting git user.email:", err);
      else console.log("Git user.email set to 'auto_commit@example.com'");
    }
  );
};

// Function to commit changes
const makeCommit = () => {
  const logFilePath = path.join(frontendDir, "commit_log.txt");
  console.log(`Making commit at ${new Date().toISOString()}...`);

  // Create the frontend directory if it doesn't exist
  if (!fs.existsSync(frontendDir)) {
    console.log(`Frontend directory not found. Creating ${frontendDir}...`);
    fs.mkdirSync(frontendDir);
  }

  // Write to commit_log.txt in the frontend directory
  fs.appendFileSync(
    logFilePath,
    `Auto commit in frontend at ${new Date().toISOString()}\n`
  );
  console.log("commit_log.txt updated");

  // Add, commit, and push changes
  exec(`git add ${logFilePath}`, { cwd: repoPath }, (err) => {
    if (err) return console.error("Error adding file:", err);
    console.log("File added to staging area");

    exec(
      `git commit -m "Auto commit at ${new Date().toISOString()}"`,
      { cwd: repoPath },
      (err) => {
        if (err) return console.error("Error committing changes:", err);
        console.log("Changes committed");

        exec("git push origin master", { cwd: repoPath }, (err) => {
          if (err) return console.error("Error pushing changes:", err);
          console.log("Changes pushed successfully");
        });
      }
    );
  });
};

// Run commits every 2 minutes for 2 hours
console.log("Starting commit cycle...");
setupGitConfig();
makeCommit(); // Initial commit
const interval = setInterval(makeCommit, intervalTime);

// Stop the script after 2 hours
setTimeout(() => {
  clearInterval(interval);
  console.log("Script completed after 2 hours");
}, maxRunTime);
