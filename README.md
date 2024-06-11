# Fitness-plus Membership Backend API

## Overview

Fitness-plus offers gym memberships with various billing structures. This backend system manages memberships, including annual and monthly billing, as well as optional add-on services such as personal training sessions and towel rentals. The API also handles invoicing for new members, sends email reminders for upcoming payments, and includes a cron job to check for upcoming membership fees.

## Features

- Manage memberships with annual and monthly billing.
- Handle optional add-on services with separate monthly charges.
- Combine the annual membership fee with the first month's add-on service charges for new members.
- Send email reminders for upcoming payments.
- Cron job to check for upcoming membership fees and send reminders.

## Technologies Used

- [Nest.js](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [NodeMailer](https://nodemailer.com/)

## Prerequisites

- Node.js and npm installed
- PostgreSQL database setup
- Gmail account for sending emails

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/NuelUzoma/fitness-plus.git
    cd fitness-plus
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password
    DB_DATABASE=fitness_plus
    MAIL_HOST=smtp.gmail.com
    MAIL_PORT=587
    MAIL_USER=your_gmail_username
    MAIL_PASS=your_gmail_password
    ```

4. **Run the database migration to set up the database schema:**

    ```sh
    npm run typeorm migration:run
    ```

## Running the Application

1. **Start the Nest.js server:**

    ```sh
    npm run start
    ```

## Usage

### Endpoints

#### Memberships

- **Create a new membership**

    ```http
    POST /api/memberships
    ```

    **Request Body:**

    ```json
    {
      "firstName": "Kelechi",
      "lastName": "Ogu",
      "membershipType": "Annual Basic",
      "email": "user15@yopmail.com",
      "isFirstMonth": true
    }
    ```

    **Response:**

    ```json
    {
      "firstName": "Kelechi",
      "lastName": "Ogu",
      "membershipType": "Annual Basic",
      "email": "user15@yopmail.com",
      "isFirstMonth": true,
      "startDate": "2024-06-11T20:16:26.217Z",
      "dueDate": "2025-06-10T23:00:00.000Z",
      "totalAmount": 500,
      "id": 22
    }
    ```

- **Get all memberships**

    ```http
    GET /api/memberships
    ```

  
- **Update membership details**

    ```http
    PUT /api/memberships
    ```

#### Add-On Services

- **Create a new add-on service**

    ```http
    POST /api/addons
    ```

    **Request Body:**

    ```json
    {
      "serviceName": "Personal Training"
    }
    ```

    **Response:**

    ```json
    {
      "serviceName": "Personal Training",
      "dueDate": "2024-07-10T23:00:00.000Z",
      "monthlyAmount": 100,
      "id": 21
    }
    ```

- **Get all add-on services**

    ```http
    GET /api/addons
    ```

### Email Notifications

Emails are sent using NodeMailer configured with a Gmail SMTP server. Ensure that your Gmail account allows less secure apps or generate an app-specific password for better security.

### Cron Job

A cron job runs daily at midnight to check for upcoming membership fees and send reminders.
