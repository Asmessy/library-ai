-- Insert Admin and User
INSERT INTO Users (name, email, password, role) VALUES 
('Admin', 'admin@library.ai', '$2a$10$wE0sC2o7.sY9qR0B9Y6S7O2.Z8K9Z8K9Z8K9Z8K9Z8K9Z8K9Z8K9O', 'admin'), -- Password is 'password'
('John Doe', 'john@example.com', '$2a$10$wE0sC2o7.sY9qR0B9Y6S7O2.Z8K9Z8K9Z8K9Z8K9Z8K9Z8K9Z8K9O', 'user');

-- Insert 20 Sample Books
INSERT INTO Books (title, author, category, availability_status) VALUES
-- Technology
('Clean Code', 'Robert C. Martin', 'Technology', 'Available'),
('The Pragmatic Programmer', 'Andrew Hunt', 'Technology', 'Available'),
('Design Patterns', 'Erich Gamma', 'Technology', 'Available'),
('Introduction to Algorithms', 'Thomas H. Cormen', 'Technology', 'Available'),

-- Self Help
('Atomic Habits', 'James Clear', 'Self Help', 'Available'),
('Deep Work', 'Cal Newport', 'Self Help', 'Available'),
('The 7 Habits of Highly Effective People', 'Stephen R. Covey', 'Self Help', 'Available'),
('Thinking, Fast and Slow', 'Daniel Kahneman', 'Self Help', 'Available'),

-- Finance
('Rich Dad Poor Dad', 'Robert T. Kiyosaki', 'Finance', 'Available'),
('The Psychology of Money', 'Morgan Housel', 'Finance', 'Available'),
('Think and Grow Rich', 'Napoleon Hill', 'Finance', 'Available'),
('The Intelligent Investor', 'Benjamin Graham', 'Finance', 'Available'),

-- Fiction
('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 'Available'),
('1984', 'George Orwell', 'Fiction', 'Available'),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 'Available'),
('Pride and Prejudice', 'Jane Austen', 'Fiction', 'Available'),

-- History
('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'History', 'Available'),
('Guns, Germs, and Steel', 'Jared Diamond', 'History', 'Available'),
('A People''s History of the United States', 'Howard Zinn', 'History', 'Available'),
('The Wright Brothers', 'David McCullough', 'History', 'Available');
