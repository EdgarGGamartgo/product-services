const express = require('express')
const cors = require('cors')
const app = express()
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./testdb.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to testdb database.');
});


db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Products (
        id int,
        name varchar(255),
        quantity int,
        created_at varchar(255),
        updated_at varchar(255)
    );`);
});


app.use(express.json())
app.use(cors())

// Hecho por Edgar Gabriel Martinez Gonzalez

// interface Product {
//     id: number;
//     name: string;
//     created_at: string;
//     updated_at: string;
//     quantity: number;
// }

app.get('/product/:id', function (req, res) {
    db.get(`SELECT * FROM Products WHERE id = ?`, [req.params.id], function (err, rows) {
        if (err) {
            return console.log(err);
        }
        res.json({ data: rows })
    })
})

app.get('/products', function (req, res) {
    db.all(`SELECT * FROM Products`, [], function (err, rows) {
        if (err) {
            return console.log(err);
        }
        res.json({ data: rows })
    })
})

app.delete('/product/:id', function (req, res) {
    db.run(`DELETE FROM Products WHERE id = ?`, [req?.params?.id], function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(`A row has been deleted with rowid::${req.params.id}`);
    })

    res.json({ data: `A row has been deleted with rowid::${req.params.id}` })
})

app.post('/product', function (req, res) {
    db.run(`INSERT INTO Products(id, name, quantity, created_at, updated_at) VALUES (?,?,?,?,?)`, [req.body.id, req.body.name, req.body.quantity, req.body.created_at, req.body.updated_at], function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(`A row has been inserted with rowid::${req.body.id}`);
    });
    res.json({ data: req.body })
})

app.put('/product/:id', function (req, res) {
    db.run(`UPDATE Products SET name = ?, quantity = ? WHERE id = ?;`, [req.body.name, req.body.quantity, req.params.id], function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(`A row has been updated with rowid::${req.body.id}`);
    });
    res.json({ data: req.body })
})

app.listen(process.env.PORT || 3000, function () { })