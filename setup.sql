-- AGM-HRMS Supabase Schema Setup

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Seed Departments
INSERT INTO departments (id, name) VALUES 
(1, 'CSE'),
(2, 'ECE'),
(3, 'MECH'),
(4, 'CIVIL'),
(5, 'IT')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Staff Table (Handles all user records and balances)
CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL DEFAULT 'staff123', -- Plaintext for demo compatibility/migration, in production hashed
    role VARCHAR(20) NOT NULL CHECK (role IN ('staff', 'hod', 'principal', 'admin')),
    department_id INT REFERENCES departments(id),
    department VARCHAR(50), -- Denormalized department name for easy client consumption
    designation VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    casual_balance INT NOT NULL DEFAULT 15,
    sick_balance INT NOT NULL DEFAULT 10,
    academic_balance INT NOT NULL DEFAULT 5,
    duty_balance INT NOT NULL DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Staff/Users
INSERT INTO staff (id, name, employee_id, email, password, role, department_id, department, designation, phone, join_date, casual_balance, sick_balance, academic_balance, duty_balance) VALUES
(1, 'Admin User', 'AGM-ADMIN-01', 'admin@agmcet.ac.in', 'admin123', 'admin', NULL, NULL, 'System Administrator', NULL, '2020-01-01', 15, 10, 5, 3),
(2, 'Prof. S. Arumugam', 'AGM-PRIN-01', 'principal@agmcet.ac.in', 'principal123', 'principal', NULL, NULL, 'Principal', NULL, '2010-01-01', 15, 10, 5, 3),
(3, 'Dr. Meera Rajan', 'AGM-HOD-01', 'hod.cse@agmcet.ac.in', 'hod123', 'hod', 1, 'CSE', 'HOD - CSE', '9876543215', '2015-06-01', 15, 10, 5, 3),
(4, 'Dr. Rajesh Kumar', 'AGM-HOD-02', 'hod.ece@agmcet.ac.in', 'hod123', 'hod', 2, 'ECE', 'HOD - ECE', '9876543216', '2016-01-01', 15, 10, 5, 3),
(5, 'John Doe', 'AGM-CSE-001', 'john@agmcet.ac.in', 'staff123', 'staff', 1, 'CSE', 'Assistant Professor', '9876543210', '2020-06-01', 12, 10, 5, 3),
(6, 'Priya Sharma', 'AGM-CSE-002', 'priya@agmcet.ac.in', 'staff123', 'staff', 1, 'CSE', 'Assistant Professor', '9876543211', '2019-07-01', 15, 10, 5, 3),
(7, 'Ravi Kumar', 'AGM-ECE-001', 'ravi@agmcet.ac.in', 'staff123', 'staff', 2, 'ECE', 'Associate Professor', '9876543212', '2018-06-01', 8, 10, 5, 3),
(8, 'Arun Menon', 'AGM-CSE-003', 'arun@agmcet.ac.in', 'staff123', 'staff', 1, 'CSE', 'Assistant Professor', '9876543213', '2021-01-01', 6, 10, 5, 3),
(9, 'Sunita Nair', 'AGM-MECH-001', 'sunita@agmcet.ac.in', 'staff123', 'staff', 3, 'MECH', 'Assistant Professor', '9876543214', '2022-08-01', 14, 10, 5, 3)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    employee_id = EXCLUDED.employee_id,
    email = EXCLUDED.email,
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    department_id = EXCLUDED.department_id,
    department = EXCLUDED.department,
    designation = EXCLUDED.designation,
    phone = EXCLUDED.phone,
    join_date = EXCLUDED.join_date,
    casual_balance = EXCLUDED.casual_balance,
    sick_balance = EXCLUDED.sick_balance,
    academic_balance = EXCLUDED.academic_balance,
    duty_balance = EXCLUDED.duty_balance;

-- Adjust standard serial sequence for staff table
SELECT setval(pg_get_serial_sequence('staff', 'id'), coalesce(max(id), 1)) FROM staff;

-- 3. Leaves Table
CREATE TABLE IF NOT EXISTS leaves (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES staff(id) ON DELETE CASCADE,
    user_name VARCHAR(100),
    department VARCHAR(50),
    department_id INT REFERENCES departments(id),
    leave_type VARCHAR(20) NOT NULL CHECK (leave_type IN ('casual', 'sick', 'academic', 'duty')),
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    days INT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('pending_adjustment', 'pending_hod', 'pending_principal', 'approved', 'rejected')),
    hod_remarks TEXT,
    principal_remarks TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    has_adjustment BOOLEAN NOT NULL DEFAULT FALSE
);

-- Seed Leaves
INSERT INTO leaves (id, user_id, user_name, department, department_id, leave_type, from_date, to_date, days, reason, status, hod_remarks, principal_remarks, applied_at, has_adjustment) VALUES
(1, 5, 'John Doe', 'CSE', 1, 'casual', '2025-06-10', '2025-06-12', 3, 'Family function', 'approved', 'Approved', 'Approved', '2025-06-05T00:00:00Z', TRUE),
(2, 5, 'John Doe', 'CSE', 1, 'sick', '2025-07-05', '2025-07-07', 3, 'Fever and rest', 'pending_hod', NULL, NULL, '2025-07-01T00:00:00Z', TRUE),
(3, 6, 'Priya Sharma', 'CSE', 1, 'academic', '2025-06-20', '2025-06-21', 2, 'Conference attendance', 'pending_principal', 'Recommended', NULL, '2025-06-15T00:00:00Z', FALSE),
(4, 7, 'Ravi Kumar', 'ECE', 2, 'casual', '2025-06-18', '2025-06-19', 2, 'Personal work', 'pending_hod', NULL, NULL, '2025-06-12T00:00:00Z', TRUE),
(5, 8, 'Arun Menon', 'CSE', 1, 'duty', '2025-05-22', '2025-05-22', 1, 'External exam duty', 'rejected', 'Not sanctioned', 'Rejected', '2025-05-18T00:00:00Z', FALSE),
(6, 9, 'Sunita Nair', 'MECH', 3, 'sick', '2025-07-10', '2025-07-12', 3, 'Medical procedure', 'pending_principal', 'Approved', NULL, '2025-07-08T00:00:00Z', FALSE)
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    user_name = EXCLUDED.user_name,
    department = EXCLUDED.department,
    department_id = EXCLUDED.department_id,
    leave_type = EXCLUDED.leave_type,
    from_date = EXCLUDED.from_date,
    to_date = EXCLUDED.to_date,
    days = EXCLUDED.days,
    reason = EXCLUDED.reason,
    status = EXCLUDED.status,
    hod_remarks = EXCLUDED.hod_remarks,
    principal_remarks = EXCLUDED.principal_remarks,
    applied_at = EXCLUDED.applied_at,
    has_adjustment = EXCLUDED.has_adjustment;

SELECT setval(pg_get_serial_sequence('leaves', 'id'), coalesce(max(id), 1)) FROM leaves;

-- 4. Adjustments Table
CREATE TABLE IF NOT EXISTS adjustments (
    id SERIAL PRIMARY KEY,
    leave_id INT REFERENCES leaves(id) ON DELETE CASCADE,
    requester_id INT REFERENCES staff(id) ON DELETE CASCADE,
    requester_name VARCHAR(100),
    adjuster_id INT REFERENCES staff(id) ON DELETE CASCADE,
    adjuster_name VARCHAR(100),
    period VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
    responded_at TIMESTAMP WITH TIME ZONE
);

-- Seed Adjustments
INSERT INTO adjustments (id, leave_id, requester_id, requester_name, adjuster_id, adjuster_name, period, subject, date, status, responded_at) VALUES
(1, 1, 5, 'John Doe', 6, 'Priya Sharma', '3rd Period', 'Data Structures', '2025-06-10', 'accepted', '2025-06-06T00:00:00Z'),
(2, 2, 5, 'John Doe', 8, 'Arun Menon', '2nd Period', 'Algorithms', '2025-07-05', 'pending', NULL),
(3, 4, 7, 'Ravi Kumar', 9, 'Sunita Nair', '1st Period', 'Networks', '2025-06-18', 'accepted', '2025-06-13T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
    leave_id = EXCLUDED.leave_id,
    requester_id = EXCLUDED.requester_id,
    requester_name = EXCLUDED.requester_name,
    adjuster_id = EXCLUDED.adjuster_id,
    adjuster_name = EXCLUDED.adjuster_name,
    period = EXCLUDED.period,
    subject = EXCLUDED.subject,
    date = EXCLUDED.date,
    status = EXCLUDED.status,
    responded_at = EXCLUDED.responded_at;

SELECT setval(pg_get_serial_sequence('adjustments', 'id'), coalesce(max(id), 1)) FROM adjustments;

-- 5. Holidays Table
CREATE TABLE IF NOT EXISTS holidays (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    description VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('holiday', 'term_start', 'term_end'))
);

-- Seed Holidays
INSERT INTO holidays (id, date, description, type) VALUES
(1, '2025-01-26', 'Republic Day', 'holiday'),
(2, '2025-04-14', 'Tamil New Year', 'holiday'),
(3, '2025-06-01', 'Term I Begins', 'term_start'),
(4, '2025-10-31', 'Term I Ends', 'term_end'),
(5, '2025-08-15', 'Independence Day', 'holiday'),
(6, '2025-10-02', 'Gandhi Jayanti', 'holiday')
ON CONFLICT (id) DO UPDATE SET
    date = EXCLUDED.date,
    description = EXCLUDED.description,
    type = EXCLUDED.type;

SELECT setval(pg_get_serial_sequence('holidays', 'id'), coalesce(max(id), 1)) FROM holidays;

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES staff(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sub TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('pending', 'approved', 'rejected', 'forwarded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Notifications
INSERT INTO notifications (id, user_id, message, sub, is_read, type, created_at) VALUES
(1, 3, 'John Doe applied for Sick Leave', 'Jul 5–7 · 3 days', FALSE, 'pending', '2025-07-01T09:00:00Z'),
(2, 3, 'Ravi Kumar applied for Casual Leave', 'Jun 18–19 · 2 days', FALSE, 'pending', '2025-06-12T10:00:00Z'),
(3, 5, 'Your leave was approved', 'Medical Leave Jun 10–12', TRUE, 'approved', '2025-06-08T14:00:00Z'),
(4, 2, 'Priya Sharma leave forwarded by HOD', 'Academic Leave Jun 20–21', FALSE, 'forwarded', '2025-06-17T11:00:00Z'),
(5, 2, 'Sunita Nair leave forwarded by HOD', 'Sick Leave Jul 10–12', FALSE, 'forwarded', '2025-07-09T08:00:00Z'),
(6, 5, 'Adjustment request sent to Arun Menon', 'Algorithms · 2nd Period', FALSE, 'pending', '2025-07-01T09:05:00Z'),
(7, 8, 'John Doe requests class adjustment', 'Algorithms · Jul 5 · 2nd Pd', FALSE, 'pending', '2025-07-01T09:05:00Z')
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    message = EXCLUDED.message,
    sub = EXCLUDED.sub,
    is_read = EXCLUDED.is_read,
    type = EXCLUDED.type,
    created_at = EXCLUDED.created_at;

SELECT setval(pg_get_serial_sequence('notifications', 'id'), coalesce(max(id), 1)) FROM notifications;
