const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const accountSid = 'ACac3582977054bdd643dbbe441e1ed1dd'; // Twilio Account SID
const authToken = '800df566aaec26d56a607a5d41570be2'; // Twilio Auth Token
const client = require('twilio')(accountSid, authToken);

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.send('Welcome to the messaging API!');
  });


app.post('/send-message', (req, res) => {
    const { body, to } = req.body;

    client.messages
        .create({
            body: body,
            messagingServiceSid: 'MG914c56ce40b7737142a65a4e1e3b6d95',
            //from: '(229) 459-6292',
            to: to,
        })
        .then(message => res.json({ sid: message.sid }))
        .catch(err => res.status(500).json({ error: err.message }));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
