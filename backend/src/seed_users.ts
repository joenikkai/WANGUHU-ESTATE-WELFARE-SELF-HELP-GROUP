import bcrypt from 'bcryptjs';
import pool from './config/db';

async function seed() {
    const password = 'Password123!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const members = [
        {
            username: 'joe_nikkai',
            email: 'joe@wewshg.com',
            role: 'admin',
            title: 'System Administrator',
            full_name: 'Joe Nikkai',
            national_id: 'ID100',
            kra_pin: 'KRA100',
            phone_number: '0711111111',
            address: 'Garden Estate, Nairobi'
        },
        {
            username: 'mary_wambui',
            email: 'mary@wewshg.com',
            role: 'board_member',
            title: 'Chairperson',
            full_name: 'Mary Wambui',
            national_id: 'ID101',
            kra_pin: 'KRA101',
            phone_number: '0711111112',
            address: 'Wanguhu Close'
        },
        {
            username: 'david_otieno',
            email: 'david@wewshg.com',
            role: 'board_member',
            title: 'Vice Chairman',
            full_name: 'David Otieno',
            national_id: 'ID102',
            kra_pin: 'KRA102',
            phone_number: '0711111113',
            address: 'Thika Road'
        },
        {
            username: 'sarah_mwaniki',
            email: 'sarah@wewshg.com',
            role: 'board_member',
            title: 'Treasurer',
            full_name: 'Sarah Mwaniki',
            national_id: 'ID103',
            kra_pin: 'KRA103',
            phone_number: '0711111114',
            address: 'Runda Estate'
        },
        {
            username: 'john_kamau',
            email: 'john@wewshg.com',
            role: 'board_member',
            title: 'Secretary',
            full_name: 'John Kamau',
            national_id: 'ID104',
            kra_pin: 'KRA104',
            phone_number: '0711111115',
            address: 'Kasarani'
        },
        {
            username: 'alice_njeri',
            email: 'alice@wewshg.com',
            role: 'member',
            title: 'Community Member',
            full_name: 'Alice Njeri',
            national_id: 'ID105',
            kra_pin: 'KRA105',
            phone_number: '0711111116',
            address: 'Mirema Drive'
        },
        {
            username: 'guest_visitor',
            email: 'guest@wewshg.com',
            role: 'guest',
            title: 'Potential Investor',
            full_name: 'Kevin Koech',
            national_id: 'ID106',
            kra_pin: 'KRA106',
            phone_number: '0711111117',
            address: 'Westlands'
        },
    ];

    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        // Clear existing to avoid conflicts during renaming
        await client.query('DELETE FROM users');
        await client.query('DELETE FROM persons');

        for (const m of members) {
            const person = await client.query(
                `INSERT INTO persons (full_name, national_id, kra_pin, phone_number, email, physical_address) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
                [m.full_name, m.national_id, m.kra_pin, m.phone_number, m.email, m.address]
            );
            await client.query(
                `INSERT INTO users (person_id, username, password_hash, role, title) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [person.rows[0].id, m.username, hash, m.role, m.title]
            );
            console.log(`User ${m.full_name} seeded.`);
        }
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Seeding failed:', err);
    } finally {
        client.release();
        process.exit(0);
    }
}

seed();
