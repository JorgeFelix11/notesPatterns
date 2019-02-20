const express = require('express');
const hbs = require('hbs');

let app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'hbs');
app.use(express.static(__dirname + "/public"))
app.get('/', (req, res) => {
    res.render('notes.hbs', {
        title: 'Notes JavaScript By Jorge Felix'
    });
})

app.listen(port, () => console.log('App listening to port 3000'))