var express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
var app = express();
var fs = require('fs');

app.use(cors())
app.use(bodyParser.json());

app.get('/teams', function (req, res) {
    fs.readFile(__dirname + "/" + "teams.json", 'utf8', function (err, data) {
        console.log(data);
        res.end(data);
    });
})

app.get('/leagues', function (req, res) {
    fs.readFile(__dirname + "/" + "leagues.json", 'utf8', function (err, data) {
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading file");
            return;
        }
        console.log(data);
        res.header("Content-Type", "application/json");
        res.send(data);
    });
})

app.get('/timeslots/:divisionID', function (req, res){
    const divisionID = parseInt(req.params.divisionID);

    fs.readFile(__dirname + "/" + "leagues.json", 'utf8', function (err, data) {
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading file");
            return;
        }

        const leagues = JSON.parse(data).leagues;
        let foundDivision = null;
        for (const league of leagues) {
            const division = league.divisions.find(div => div.divisionID === divisionID);
            if (division) {
                foundDivision = division;
                break;
            }
        }

        if (!foundDivision) {
            res.status(404).send("Division not found");
            return;
        }
        res.header("Content-Type", "application/json");
        res.send(JSON.stringify({ divisionName:foundDivision.divisionName, timeslots: foundDivision.timeslots || [] }));
    });

})



app.get('/teams/:divisionID', function (req, res){

    const divisionID = parseInt(req.params.divisionID);

    fs.readFile(__dirname + "/" + "leagues.json", 'utf8', function (err, data) {
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading file");
            return;
        }

        const leagues = JSON.parse(data).leagues;
        let foundDivision = null;
        for (const league of leagues) {
            const division = league.divisions.find(div => div.divisionID === divisionID);
            if (division) {
                foundDivision = division;
                break;
            }
        }

        if (!foundDivision) {
            res.status(404).send("Division not found");
            return;
        }

        res.header("Content-Type", "application/json");
        res.send(JSON.stringify({ divisionName:foundDivision.divisionName, teams: foundDivision.teams || [] }));
    });

})

app.get('/divisions/:leagueID', function (req, res) {
    const leagueID = parseInt(req.params.leagueID);
    
    fs.readFile(__dirname + "/" + "leagues.json", 'utf8', function (err, data) {
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading file");
            return;
        }

        const leagues = JSON.parse(data).leagues;

        // Find the league tith the given ID
        const league = leagues.find(league => league.id === leagueID);
        if (!league) {
            res.status(404).send("League not found");
            return;
        }

        res.header("Content-Type", "application/json");
        res.send(JSON.stringify({ divisions: league.divisions, leagueName: league.league }));
    });
});


var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("REST API demo app listening at http://%s:%s", host, port)
})

app.post('/league/:leagueID/division/:divisionID/team', function (req, res) {
    console.log("Request Received");
    
    fs.readFile(__dirname + "/" + "leagues.json", 'utf8', function (err, data) {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ error: "Failed to read data file" });
            return;
        }

        let parseData;
        try {
            parseData = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).json({ error: "Failed to parse data file" });
            return;
        }


        const newTeam = req.body;
        const leagueID = parseInt(req.params.leagueID, 10);
        const divisionID = parseInt(req.params.divisionID, 10);

        const league = parseData.leagues.find(league => league.id === leagueID);
        if (!league) {
            res.status(404).json({ error: "League not found" });
            return;
        }

        console.log("Current league: ", league);


        const division = league.divisions.find(division => division.divisionID === divisionID);



        if (!division) {
            res.status(404).json({ error: "This Division not found" });
            return;
        }

        const newTeamID = division.teams.length > 0 
            ? Math.max(...division.teams.map(team => team.id)) + 1 
            : 1;

        newTeam.id = newTeamID;
        division.teams.push(newTeam);

        const updatedData = JSON.stringify(parseData, null, 2);

        fs.writeFile(__dirname + "/leagues.json", updatedData, function (writeErr) {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                res.status(500).json({ error: "Failed to write data file" });
                return;
            }

            console.log('Team added successfully');
            res.status(200).json({ message: 'Team added successfully', data: parseData });
        });
    });
});

app.post('/league/:leagueID/division/:divisionID/timeslot', function (req, res) {
    console.log("Request Received");
    
    fs.readFile(__dirname + "/" + "leagues.json", 'utf8', function (err, data) {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ error: "Failed to read data file" });
            return;
        }

        let parseData;
        try {
            parseData = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).json({ error: "Failed to parse data file" });
            return;
        }


        const newTimeSlot = req.body;
        const leagueID = parseInt(req.params.leagueID, 10);
        const divisionID = parseInt(req.params.divisionID, 10);

        const league = parseData.leagues.find(league => league.id === leagueID);
        if (!league) {
            res.status(404).json({ error: "League not found" });
            return;
        }

        console.log("Current league: ", league);


        const division = league.divisions.find(division => division.divisionID === divisionID);



        if (!division) {
            res.status(404).json({ error: "This Division not found" });
            return;
        }

        const newTimeslotID = division.timeslots.length > 0 
            ? Math.max(...division.timeslots.map(timeslot => timeslot.id)) + 1 
            : 1;

        newTimeSlot.id = newTimeslotID;
        division.timeslots.push(newTimeSlot);

        const updatedData = JSON.stringify(parseData, null, 2);

        fs.writeFile(__dirname + "/leagues.json", updatedData, function (writeErr) {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                res.status(500).json({ error: "Failed to write data file" });
                return;
            }

            console.log('Timeslot added successfully');
            res.status(200).json({ message: 'Timeslot added successfully', data: parseData });
        });
    });
});


app.post('/leagues/:leagueID/division', function (req, res) {
    console.log("Request Received");
    fs.readFile(__dirname + "/" + "leagues.json", 'utf8', function (err, data) {
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).json({ error: "Error reading file" });
            return;
        }

        let parseData;
        try {
            parseData = JSON.parse(data);
        } catch (jsonErr) {
            console.error("Error parsing JSON:", jsonErr);
            res.status(500).json({ error: "Error parsing JSON" });
            return;
        }

        console.log("Current leagues: ", parseData);

        const newDivision = req.body;
        const leagueID = parseInt(req.params.leagueID, 10);

        // Find the league with the given ID
        const league = parseData.leagues.find(league => league.id === leagueID);
        if (!league) {
            res.status(404).json({ error: "League not found" });
            return;
        }

        // Initialize the divisions array if it doesn't exist
        if (!league.divisions) {
            league.divisions = [];
        }

        // Determine the new division ID
        const newDivisionID = league.divisions.length > 0 
            ? Math.max(...league.divisions.map(div => div.divisionID)) + 1 
            : 1;

        newDivision.divisionID = newDivisionID;

        league.divisions.push(newDivision);
        const updatedData = JSON.stringify(parseData, null, 2);

        fs.writeFile(__dirname + "/leagues.json", updatedData, function (writeErr) {
            if (writeErr) {
                console.error("Error writing file:", writeErr);
                res.status(500).json({ error: "Error writing file" });
                return;
            }

            console.log('Division added successfully');
            res.status(200).json({ message: 'Division added successfully', data: parseData });
        });
    });
});

app.delete('/league/:leagueID/division/:divisionID/team/:teamID', (req, res) => {
    const divisionID = parseInt(req.params.divisionID);
    const newTeamID = parseInt(req.params.teamID);
    const leagueID = parseInt(req.params.leagueID, 10);

    fs.readFile(__dirname + "/leagues.json", 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).json({ error: "Error reading file" });
            return;
        }

        let parseData;
        try {
            parseData = JSON.parse(data);
        } catch (jsonErr) {
            console.error("Error parsing JSON:", jsonErr);
            res.status(500).json({ error: "Error parsing JSON" });
            return;
        }

        console.log("Current leagues: ", parseData);

        // Find the league with the given ID
        const league = parseData.leagues.find(league => league.id === leagueID);
        if (!league) {
            res.status(404).json({ error: "League not found" });
            return;
        }

        // Find the division
        let division = league.divisions.find(d => d.divisionID === divisionID);
        if (!division) {
            res.status(404).json({ message: 'Division not found.' });
            return;
        }

        // Find the team index
        let teamIndex = division.teams.findIndex(t => t.id === newTeamID);
        console.log("Index: " + teamIndex);
        if (teamIndex === -1) {
            res.status(404).json({ message: 'Team not found.' });
            return;
        }

        // Remove the team from the division
        division.teams.splice(teamIndex, 1);
        
        // Convert the modified object back to a JSON string
        const updatedData = JSON.stringify(parseData, null, 2);

        // Write the updated JSON string back to the file
        fs.writeFile(__dirname + "/leagues.json", updatedData, (writeErr) => {
            if (writeErr) {
                console.error("Error writing file:", writeErr);
                res.status(500).json({ error: "Error writing file" });
                return;
            }

            console.log('Team deleted successfully');
            res.status(200).json({ message: 'Team deleted successfully', data: parseData });
        });
    });
});


app.post('/league', function (req, res) {
    console.log("Request Received");
    fs.readFile(__dirname + "/" + "leagues.json", 'utf8', function (err, data) {
        let parseData = JSON.parse(data);
        console.log("Current leagues: ", parseData)

        const newLeague = req.body;

        const newLeagueID = parseData.leagues.length + 1;

        console.log("ID " + newLeagueID);

        newLeague.id = newLeagueID;

        parseData.leagues.push(newLeague);

        const updatedData = JSON.stringify(parseData, null, 2);

        fs.writeFile(__dirname + "/leagues.json", updatedData, function (writeErr) {
            console.log('League added successfully');
            res.status(200).json({ message: 'League added successfully', data: parseData });
        });
    });
})

app.put('/league/:id', function (req, res) {
    console.log("Request Received "+req.params.id);
    fs.readFile(__dirname + "/" + "leagues.json", 'utf8', function (err, data) {
        if (err) {
            res.status(500).json({ message: 'Error reading file', error: err });
            return;
        }

        let parseData = JSON.parse(data);
        console.log("Current leagues: ", parseData);

        const leagueID = parseInt(req.params.id, 10);
        const updatedLeague = req.body;

        // Find the index of the league with the given ID
        const leagueIndex = parseData.leagues.findIndex(league => league.id === leagueID);

        if (leagueIndex === -1) {
            res.status(404).json({ message: 'League not found' });
            return;
        }

        // Update the league details
        parseData.leagues[leagueIndex] = { ...parseData.leagues[leagueIndex], ...updatedLeague };

        const updatedData = JSON.stringify(parseData, null, 2);

        fs.writeFile(__dirname + "/leagues.json", updatedData, function (writeErr) {
            if (writeErr) {
                res.status(500).json({ message: 'Error writing file', error: writeErr });
                return;
            }

            console.log('League updated successfully');
            res.status(200).json({ message: 'League updated successfully', data: parseData });
        });
    });
});


app.get('/:id', function (req, res) {
    fs.readFile(__dirname + "/" + "teams.json", 'utf8', function (err, data) {
        var teams = JSON.parse(data);
        id = 5;
        var team = teams["team" + id]
        //var team = teams["team" + req.params.id] 
        console.log(team);
        res.end(JSON.stringify(team));
    });
})


