const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acmedb');
const express = require('express');
const app = express();

app.get('/', (req, res, next)=> {
    res.send('hello world');
});

app.get('/api/flavors', async(req, res, next)=> {
    try {
        const SQL = `
            SELECT *
            FROM flavors
        `;
        const response = await client.query(SQL);
        res.send(response.rows);
    }
    catch(ex){
        next(ex);
    }
});

const init = async()=> {
    
    await client.connect();
    console.log('connected to database');
    let SQL = `
        DROP TABLE IF EXISTS flavors;
        CREATE TABLE flavors(
            id SERIAL PRIMARY KEY,
            txt VARCHAR(100),
            ranking INTEGER DEFAULT 5,
            created_at TIMESTAMP DEFAULT now()
        );
    `;
    await client.query(SQL);
    console.log('table created');
    SQL = `
        INSERT INTO flavors(txt) VALUES ('chocolate');
        INSERT INTO flavors(txt) VALUES ('vanilla');
        INSERT INTO flavors(txt) VALUES ('strawberry');
    `;
    await client.query(SQL);
    console.log('data seeded');
    
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();