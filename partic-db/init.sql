USE partic;

-- Create a table for suggestions
CREATE TABLE parkingtickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticketNumber VARCHAR(50) NOT NULL,
  entryTime VARCHAR(250) NOT NULL,
  exitTime VARCHAR(250),
  cost DECIMAL(10, 2),
  balance DECIMAL(10, 2),
  paymentStatus BOOLEAN
);

-- Create a table for user accounts
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  passwordHash CHAR(60) NOT NULL
);

-- Insert a basic user
INSERT INTO users (username, passwordHash)
VALUES ('zfranke@live.com', '$2y$10$lG6R0e6LhLRTBeMhvcv3buoosheXO5PPL.r0hru0DnudX5aROvPqi');