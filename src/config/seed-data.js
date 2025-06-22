const mysql = require('mysql2/promise');
require('dotenv').config();

const seedData = async () => {
    let connection;
    try {
        console.log('Starting data seeding...');

        // Connect to database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'construction_management'
        });

        // Sample users (if not already created)
        const users = [
            { id: 'admin1', username: 'admin_user', password: 'admin123' },
            { id: 'client1', username: 'client_user', password: 'client123' },
            { id: 'super1', username: 'supervisor_user', password: 'super123' }
        ];

        // Insert users
        for (const user of users) {
            await connection.query(
                'INSERT IGNORE INTO User (id, username, password) VALUES (?, ?, ?)',
                [user.id, user.username, user.password]
            );
        }
        console.log('Users seeded successfully');

        // Sample projects
        const projects = [
            {
                name: 'Residential Complex - Phase 1',
                client_id: 'client1',
                labour_contractor: 'ABC Contractors',
                address: '123 Main Street, City',
                total_budget: 5000000.00,
                created_by: 'admin1',
                created_on: new Date(),
                admin_id: 'admin1'
            },
            {
                name: 'Commercial Plaza',
                client_id: 'client1',
                labour_contractor: 'XYZ Builders',
                address: '456 Business Park, City',
                total_budget: 8000000.00,
                created_by: 'admin1',
                created_on: new Date(),
                admin_id: 'admin1'
            },
            {
                name: 'Apartment Building',
                client_id: 'client1',
                labour_contractor: 'PQR Construction',
                address: '789 Housing Colony, City',
                total_budget: 3000000.00,
                created_by: 'admin1',
                created_on: new Date(),
                admin_id: 'admin1'
            }
        ];

        // Insert projects
        for (const project of projects) {
            const [result] = await connection.query(
                `INSERT INTO Project 
                (name, client_id, labour_contractor, address, total_budget, created_by, created_on, admin_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    project.name,
                    project.client_id,
                    project.labour_contractor,
                    project.address,
                    project.total_budget,
                    project.created_by,
                    project.created_on,
                    project.admin_id
                ]
            );

            // Sample payments for each project
            const payments = [
                {
                    project_id: result.insertId,
                    particulars: 'Initial Advance Payment',
                    date: new Date(),
                    amount: project.total_budget * 0.3,
                    paid_through: 'Bank Transfer',
                    remarks: '30% advance payment'
                },
                {
                    project_id: result.insertId,
                    particulars: 'Material Purchase',
                    date: new Date(),
                    amount: project.total_budget * 0.2,
                    paid_through: 'Cheque',
                    remarks: 'Construction materials'
                },
                {
                    project_id: result.insertId,
                    particulars: 'Labour Payment',
                    date: new Date(),
                    amount: project.total_budget * 0.15,
                    paid_through: 'Cash',
                    remarks: 'Monthly labour payment'
                }
            ];

            // Insert payments
            for (const payment of payments) {
                await connection.query(
                    `INSERT INTO Payment 
                    (project_id, particulars, date, amount, paid_through, remarks) 
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        payment.project_id,
                        payment.particulars,
                        payment.date,
                        payment.amount,
                        payment.paid_through,
                        payment.remarks
                    ]
                );
            }
        }

        console.log('Projects and payments seeded successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Run the seeding
console.log('Starting data seeding process...');
seedData(); 