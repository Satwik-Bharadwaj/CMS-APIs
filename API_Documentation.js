const { Document, Packer, Paragraph, HeadingLevel, TextRun } = require('docx');
const fs = require('fs');

const doc = new Document({
    sections: [
        {
            properties: {},
            children: [
                new Paragraph({
                    text: 'API Documentation',
                    heading: HeadingLevel.TITLE,
                }),
                new Paragraph({ text: '' }),
                new Paragraph({
                    text: 'User APIs (/api/users)',
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph('POST /create — Create a new user'),
                new Paragraph('GET /all — Get all users'),
                new Paragraph('GET /id/:id — Get a user by ID'),
                new Paragraph('DELETE /:id — Delete a user'),
                new Paragraph({ text: '' }),
                new Paragraph({
                    text: 'Payment APIs (/api/payments)',
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph('POST /create — Create a new payment'),
                new Paragraph('GET /all — Get all payments'),
                new Paragraph({ text: '' }),
                new Paragraph({
                    text: 'Project APIs (/api/projects)',
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph('POST /create — Create a new project'),
                new Paragraph('GET /all — Get all projects'),
                new Paragraph('GET /id/:id — Get a project by ID'),
                new Paragraph('PUT /update/:id — Update a project by ID'),
                new Paragraph('DELETE /delete/:id — Delete a project by ID'),
                new Paragraph('GET /generalInformation — Get general project information'),
                new Paragraph('PUT /update/generalInformation/:id — Update general project information by ID'),
                new Paragraph({ text: '' }),
                new Paragraph({
                    text: 'Payment Plan APIs (/api/payment_plans)',
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph('POST /create — Create a new payment plan'),
                new Paragraph('GET /all — Get all payment plans'),
                new Paragraph('PUT /update/:id — Update a payment plan by ID'),
                new Paragraph({ text: '' }),
                new Paragraph({
                    text: 'Rate List APIs (/api/rate_lists)',
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph('POST /create — Create a new rate list'),
                new Paragraph('GET /all — Get all rate lists'),
                new Paragraph('PUT /update/:id — Update a rate list by ID'),
                new Paragraph({ text: '' }),
                new Paragraph({
                    text: 'Drawing APIs (/api/drawings)',
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph('POST /create — Create a new drawing'),
                new Paragraph('GET /all — Get all drawings'),
                new Paragraph('PUT /update/:id — Update a drawing by ID'),
                new Paragraph({ text: '' }),
                new Paragraph({
                    text: 'Material APIs (/api/materials)',
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph('POST /create — Create a new material'),
                new Paragraph('GET /all — Get all materials'),
                new Paragraph('PUT /update/:id — Update a material by ID'),
                new Paragraph({ text: '' }),
                new Paragraph({
                    text: 'Labour Bill APIs (/api/labourBills)',
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph('POST /create — Create a new labour bill'),
                new Paragraph('GET /all — Get all labour bills'),
                new Paragraph('PUT /update/:id — Update a labour bill by ID'),
                new Paragraph({ text: '' }),
                new Paragraph({
                    text: 'Labour Payment APIs (/api/labourPayments)',
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph('POST / — Create a new labour payment'),
                new Paragraph('GET / — Get all labour payments'),
                new Paragraph('PUT /:id — Update a labour payment'),
                new Paragraph({ text: '' }),
                new Paragraph({
                    text: 'Material Tracking Entry APIs (/api/materialTrackingEntries)',
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph('POST /create — Create a new material tracking entry'),
                new Paragraph('GET /all — Get all material tracking entries'),
                new Paragraph('PUT /update/:id — Update a material tracking entry by ID'),
                new Paragraph({ text: '' }),
                new Paragraph({
                    text: 'Project Supervisor APIs (/api/projectSupervisors)',
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph('POST /create — Create a new project supervisor'),
                new Paragraph('GET /all — Get all project supervisors'),
                new Paragraph('PUT /update/:id — Update a project supervisor by ID'),
                new Paragraph({ text: '' }),
                new Paragraph({
                    text: 'Daily Report APIs (/api/dailyReports)',
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph('GET /all — Get all daily reports'),
                new Paragraph('POST /create — Create a new daily report'),
                new Paragraph('PUT /update/:id — Update a daily report by ID'),
                new Paragraph({ text: '' }),
                new Paragraph({
                    text: 'Keycloak Integration',
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph('There is no Keycloak integration found in the codebase.'),
            ],
        },
    ],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync('API_Documentation.docx', buffer);
    console.log('API documentation Word file created as API_Documentation.docx');
}); 