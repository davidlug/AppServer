var express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const { Team, TimeSlot, PlayingLocation, main } = require('./test.js'); // import from test.js
var app = express();
var fs = require('fs');
const path = require('path');
const { scheduler } = require('timers/promises');
const { match } = require('assert');

app.use(cors())
app.use(bodyParser.json());


app.get('/leagues', function (req, res) {
    fs.readFile(__dirname + "/" + "leagues.json", 'utf8', function (err, data) {
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading file");
            return;
        }
        //  console.log(data);
        res.header("Content-Type", "application/json");
        res.send(data);
    });
})

app.get('/timeslots/:divisionID', function (req, res) {
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
        res.send(JSON.stringify({ divisionName: foundDivision.divisionName, timeslots: foundDivision.timeslots || [] }));
    });

})


const DATA_FILE = './leagues.json';

// Utility function to read the JSON data file
const readDataFile = (callback) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            callback(err, null);
        } else {
            try {
                const jsonData = JSON.parse(data);
                callback(null, jsonData);
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                callback(parseErr, null);
            }
        }
    });
};

// Utility function to write to the JSON data file
const writeDataFile = (data, callback) => {
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error("Error writing file:", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};

// Get teams for a specific league and division
app.get('/leagues/:leagueID/divisions/:divisionID/teams', (req, res) => {
    const leagueID = parseInt(req.params.leagueID);
    const divisionID = parseInt(req.params.divisionID);

    readDataFile((err, data) => {
        if (err) {
            res.status(500).send("Error reading file");
            return;
        }

        const league = data.leagues.find(league => league.id === leagueID);
        if (!league) {
            res.status(404).json({ error: "League not found" });
            return;
        }

        const division = league.divisions.find(division => division.divisionID === divisionID);
        if (!division) {
            res.status(404).json({ error: "Division not found" });
            return;
        }

        res.json({ teams: division.teams || [], divisionName: division.divisionName, leagueName: league.league });
    });
});


// Get timeslots for a specific league and division
app.get('/leagues/:leagueID/divisions/:divisionID/timeslots', (req, res) => {
    //console.log("Time Slots");
    const leagueID = parseInt(req.params.leagueID);
    const divisionID = parseInt(req.params.divisionID);

    readDataFile((err, data) => {
        if (err) {
            res.status(500).send("Error reading file");
            return;
        }

        const league = data.leagues.find(league => league.id === leagueID);
        if (!league) {
            res.status(404).json({ error: "League not found" });
            return;
        }

        const division = league.divisions.find(division => division.divisionID === divisionID);
        if (!division) {
            res.status(404).json({ error: "Division not found" });
            return;
        }
        console.log(division.timeslots);

        res.json({ timeslots: division.timeslots || [] });
    });
});


app.get('/teams/:divisionID', function (req, res) {

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
        res.send(JSON.stringify({ divisionName: foundDivision.divisionName, teams: foundDivision.teams || [] }));
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

app.post('/league/:leagueID/division/:divisionID/teams', function (req, res) {
    // console.log("Request Received");

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

        const newTeams = req.body; // Array of new teams
        const leagueID = parseInt(req.params.leagueID, 10);
        const divisionID = parseInt(req.params.divisionID, 10);

        const league = parseData.leagues.find(league => league.id === leagueID);
        if (!league) {
            res.status(404).json({ error: "League not found" });
            return;
        }

        //console.log("Current league: ", league);

        const division = league.divisions.find(division => division.divisionID === divisionID);
        if (!division) {
            res.status(404).json({ error: "Division not found" });
            return;
        }

        newTeams.forEach(newTeam => {
            const newTeamID = division.teams.length > 0
                ? Math.max(...division.teams.map(team => team.id)) + 1
                : 1;

            newTeam.id = newTeamID;
            division.teams.push(newTeam);
        });

        const updatedData = JSON.stringify(parseData, null, 2);

        fs.writeFile(__dirname + "/leagues.json", updatedData, function (writeErr) {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                res.status(500).json({ error: "Failed to write data file" });
                return;
            }

            console.log('Teams added successfully');
            res.status(200).json({ message: 'Teams added successfully', data: parseData });
        });
    });
});

app.post('/league/:leagueID/division/:divisionID/timeslots', function (req, res) {
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

        const newTimeslots = req.body; // Array of new teams
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
            res.status(404).json({ error: "Division not found" });
            return;
        }

        if (!Array.isArray(division.timeslots)) {
            division.timeslots = [];
        }

        newTimeslots.forEach(newTimeslot => {
            const newTimeslotID = division.timeslots.length > 0
                ? Math.max(...division.timeslots.map(timeslot => timeslot.id)) + 1
                : 1;

            newTimeslot.id = newTimeslotID;
            division.timeslots.push(newTimeslot);
        });

        const updatedData = JSON.stringify(parseData, null, 2);

        fs.writeFile(__dirname + "/leagues.json", updatedData, function (writeErr) {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                res.status(500).json({ error: "Failed to write data file" });
                return;
            }

            console.log('Timeslots added successfully');
            res.status(200).json({ message: 'Timeslots added successfully', data: parseData });
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

        // Ensure timeslots array is initialized
        if (!Array.isArray(division.timeslots)) {
            division.timeslots = [];
        }

        console.log(division.timeslots.length);

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

app.get('/league/:leagueID/division/:divisionID/schedules', function (req, res) {
    fs.readFile(__dirname + "/leagues.json", 'utf8', function (err, data) {
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

        const leagueID = parseInt(req.params.leagueID, 10);
        const divisionID = parseInt(req.params.divisionID, 10);


        const league = parseData.leagues.find(league => league.id === leagueID);
        if (!league) {
            res.status(404).json({ error: "League not found" });
            return;
        }

        const division = league.divisions.find(division => division.divisionID === divisionID);
        if (!division) {
            res.status(404).json({ error: "Division not found" });
            return;
        }

        res.header("Content-Type", "application/json");
        res.send(JSON.stringify({ schedule: division.schedule }));
    });
})

app.get('/league/:leagueID/division/:divisionID/schedule', function (req, res) {
    console.log("Inside getSchedule");
    console.log("Request Received");

    const filePath = path.join(__dirname, "leagues.json");
    console.log("Reading file:", filePath);

    fs.readFile(filePath, 'utf8', function (err, data) {
        console.log("Inside fs.readFile callback");

        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ error: "Failed to read data file" });
            return;
        }

        console.log("File read successfully. Parsing JSON...");

        let parseData;
        try {
            parseData = JSON.parse(data);
            console.log("JSON parsed successfully");
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).json({ error: "Failed to parse data file" });
            return;
        }

        const leagueID = parseInt(req.params.leagueID, 10);
        const divisionID = parseInt(req.params.divisionID, 10);
        const freezeWeeks = req.query.freezeWeeks ? req.query.freezeWeeks.split(",") : [];
        const lastWeek = freezeWeeks.length ? parseInt(freezeWeeks[freezeWeeks.length - 1], 10) : 0;

        // console.log("Parsed Data:");
        // console.log(parseData);

        const league = parseData.leagues.find(league => league.id === leagueID);
        if (!league) {
            console.error("League not found:", leagueID);
            res.status(404).json({ error: "League not found" });
            return;
        }

        //console.log("League found:", league);

        const division = league.divisions.find(division => division.divisionID === divisionID);
        if (!division) {
            console.error("Division not found:", divisionID);
            res.status(404).json({ error: "Division not found" });
            return;
        }

        // console.log("Division found:", division);

        // Generate new schedule
        let newSchedule = main(division.teams, division.timeslots, lastWeek, division.schedule);

        let gooseEgg = false;

        const teamCount = division.teams.length;
        const matchupCounts = Array.from({ length: teamCount }, () => Array(teamCount).fill(0));

        // Populate the matchup counts based on the new schedule
        for (let week of newSchedule) {
            for (let timeslot of week) {
                if (timeslot.match) {
                    const homeTeamName = timeslot.match.homeTeam.teamName;
                    const awayTeamName = timeslot.match.awayTeam.teamName;

                    if (homeTeamName != awayTeamName) {
                        const homeTeamIndex = division.teams.findIndex(team => team.teamName === homeTeamName);
                        const awayTeamIndex = division.teams.findIndex(team => team.teamName === awayTeamName);

                        if (homeTeamIndex !== -1 && awayTeamIndex !== -1) {
                            matchupCounts[homeTeamIndex][awayTeamIndex]++;
                            matchupCounts[awayTeamIndex][homeTeamIndex]++; // Since it's a symmetric relation
                        }
                    }


                }
            }
        }

        console.log("teamCount");
        console.log(teamCount);
        console.log(division.schedule.length);

        // Example: log the matchup counts
        console.log("Matchup Counts:");
        for (let i = 0; i < teamCount; i++) {
            for (let j = 0; j < teamCount; j++) {
                if (division.teams[i].teamName != division.teams[j].teamName) {
                    console.log(`Team ${division.teams[i].teamName} vs Team ${division.teams[j].teamName}: ${matchupCounts[i][j]} times`);
                    if (matchupCounts[i][j] == 0) {
                        console.log("Flagged");
                        console.log(`Team ${division.teams[i].teamName} vs Team ${division.teams[j].teamName}: ${matchupCounts[i][j]} times`);
                        if(division.schedule.length >= teamCount)
                        {
                            gooseEgg = true;
                        }
                    }
                }
            }
        }

        while (gooseEgg == true) {
            gooseEgg = false;
            console.log("Redo main");

            newSchedule = main(division.teams, division.timeslots, lastWeek, division.schedule);
            const teamCount = division.teams.length;
            const matchupCounts = Array.from({ length: teamCount }, () => Array(teamCount).fill(0));

            // Populate the matchup counts based on the new schedule
            for (let week of newSchedule) {
                for (let timeslot of week) {
                    if (timeslot.match) {
                        const homeTeamName = timeslot.match.homeTeam.teamName;
                        const awayTeamName = timeslot.match.awayTeam.teamName;

                        if (homeTeamName != awayTeamName) {
                            const homeTeamIndex = division.teams.findIndex(team => team.teamName === homeTeamName);
                            const awayTeamIndex = division.teams.findIndex(team => team.teamName === awayTeamName);

                            if (homeTeamIndex !== -1 && awayTeamIndex !== -1) {
                                matchupCounts[homeTeamIndex][awayTeamIndex]++;
                                matchupCounts[awayTeamIndex][homeTeamIndex]++; // Since it's a symmetric relation
                            }
                        }


                    }
                }
            }

            console.log(teamCount);

            // Example: log the matchup counts
            console.log("Matchup Counts:");
            for (let i = 0; i < teamCount; i++) {
                for (let j = 0; j < teamCount; j++) {
                    if (division.teams[i].teamName != division.teams[j].teamName) {
                        console.log(`Team ${division.teams[i].teamName} vs Team ${division.teams[j].teamName}: ${matchupCounts[i][j]} times`);
                        if (matchupCounts[i][j] == 0) {
                            console.log("Flagged");
                            console.log(`Team ${division.teams[i].teamName} vs Team ${division.teams[j].teamName}: ${matchupCounts[i][j]} times`);
                            gooseEgg = true;
                        }
                    }
                }
            }
        }


        division.schedule = newSchedule;

        // Reset games played count
        for (let team of division.teams) {
            team.gamesPlayed = 0;
        }

        // Calculate games played for each team
        for (let week of newSchedule) {
            for (let timeslot of week) {
                if (timeslot.match) {
                    const homeTeamName = timeslot.match.homeTeam.teamName;
                    const awayTeamName = timeslot.match.awayTeam.teamName;

                    const homeTeam = division.teams.find(team => team.teamName === homeTeamName);
                    const awayTeam = division.teams.find(team => team.teamName === awayTeamName);

                    if (homeTeam) homeTeam.gamesPlayed++;
                    if (awayTeam) awayTeam.gamesPlayed++;
                }
            }
        }

        console.log("New Schedule generated:");

        fs.writeFile(filePath, JSON.stringify(parseData, null, 2), 'utf8', (writeErr) => {
            console.log("Entered write");
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                res.status(500).json({ error: "Failed to write data file" });
                return;
            }

            console.log('New Schedule written to file successfully');
            // console.log(newSchedule);
            res.status(200).json({ message: 'Schedule generated and saved successfully', schedule: newSchedule });
        });
    });
    console.log("After fs.readFile");
});


app.get('/league/:leagueID/division/:divisionID/team/:teamID', (req, res) => {
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

        //console.log("Current leagues: ", parseData);

        // Find the league with the given ID
        const league = parseData.leagues.find(league => league.id == leagueID);
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
        console.log("Division teams");
        console.log(division.teams);
        let teamIndex = division.teams.findIndex(t => t.id === newTeamID);
        if (teamIndex === -1) {
            res.status(404).json({ message: 'Team not found.' });
            return;
        }

        let team = division.teams.find(t => t.id === (teamIndex + 1));
        // console.log(team);

        console.log

        res.status(200).json({ team: team });

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

app.get('/league/:leagueID/division/:divisionID/team/:teamID/weight', (req, res) => {
    console.log("Entered weight Call")
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

        //console.log("Current leagues: ", parseData);

        // Find the league with the given ID
        const league = parseData.leagues.find(league => league.id == leagueID);
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
        if (teamIndex === -1) {
            res.status(404).json({ message: 'Team not found.' });
            return;
        }

        let team = division.teams.find(t => t.id === (teamIndex + 1));
        console.log("/weight team");
        console.log(team);

        console.log("Division Schedule");
        console.log(division.schedule);
        let tempWeight = 0;
        for (let i = 0; i < division.schedule.length; i++) {
            for (let p = 0; p < division.schedule[i].length; p++) {
                if (team.teamName == division.schedule[i][p].match.homeTeam.teamName || team.teamName == division.schedule[i][p].match.awayTeam.teamName) {
                    tempWeight += division.schedule[i][p].weight;
                }
            }
        }

        tempWeight = tempWeight / team.gamesPlayed;
        team.weight = tempWeight;

        console.log(team.teamName + " " + team.weight);


        //let teamWeight = team.weight

        res.status(200).json({ weight: tempWeight });

    });

});

app.get('/league/:leagueID/division/:divisionID/timeslot/:timeslotID', (req, res) => {
    const divisionID = parseInt(req.params.divisionID);
    const newTimeslotID = parseInt(req.params.timeslotID);
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

        //console.log("Current leagues: ", parseData);

        // Find the league with the given ID
        const league = parseData.leagues.find(league => league.id == leagueID);
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
        let timeslotIndex = division.timeslots.findIndex(t => t.id === newTimeslotID);
        if (timeslotIndex === -1) {
            res.status(404).json({ message: 'Timeslot not found.' });
            return;
        }

        let timeslot = division.timeslots.find(t => t.id === (timeslotIndex + 1));
        // console.log("Timeslot");
        // console.log(timeslot);

        console.log

        res.status(200).json({ timeslot: timeslot });

    });

});

const jsonFilePath = path.join(__dirname, 'leagues.json');


app.put('/league/:leagueID/division/:divisionID/team/:teamID', (req, res) => {
    const divisionID = parseInt(req.params.divisionID);
    const teamID = parseInt(req.params.teamID);
    const leagueID = parseInt(req.params.leagueID, 10);
    const teamData = req.body;

    console.log(`Received PUT request for leagueID: ${leagueID}, divisionID: ${divisionID}, teamID: ${teamID}`);
    console.log("Received teamData:", teamData);

    // Check if the parameters are correctly extracted
    if (!leagueID || !divisionID || !teamID) {
        console.error('Missing parameters');
        return res.status(400).send('Missing parameters.');
    }

    fs.readFile(__dirname + "/leagues.json", 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('An error occurred while reading the file.');
        }

        console.log('File read successfully');

        let parseData;
        try {
            parseData = JSON.parse(data);
        } catch (jsonErr) {
            console.error("Error parsing JSON:", jsonErr);
            res.status(500).json({ error: "Error parsing JSON" });
            return;
        }

        const league = parseData.leagues.find(league => league.id === leagueID);
        if (!league) {
            console.log('League not found');
            return res.status(404).send('League not found.');
        }

        const division = league.divisions.find(division => division.divisionID === divisionID);
        if (!division) {
            console.log('Division not found');
            return res.status(404).send('Division not found.');
        }

        const teamIndex = division.teams.findIndex(team => team.id === teamID);
        if (teamIndex === -1) {
            console.log('Team not found');
            return res.status(404).send('Team not found.');
        }

        // Ensure the teamData includes the id as an integer
        teamData.id = teamID;

        const updatedTeamData = { ...teamData, id: teamID };
        delete updatedTeamData.teamID;

        console.log("Updating team:", updatedTeamData);
        division.teams[teamIndex] = updatedTeamData;

        fs.writeFile(jsonFilePath, JSON.stringify(parseData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('An error occurred while writing the file.');
            }

            res.status(200).json({ message: 'League updated successfully', data: parseData });
        });
    });
});


app.put('/league/:leagueID/division/:divisionID/teams', (req, res) => {
    const divisionID = parseInt(req.params.divisionID);
    const leagueID = parseInt(req.params.leagueID, 10);
    const teamData = req.body;

    console.log(`Received PUT request for leagueID: ${leagueID}, divisionID: ${divisionID}`);
    console.log("Received teamData:", teamData);

    // Check if the parameters are correctly extracted
    if (!leagueID || !divisionID) {
        console.error('Missing parameters');
        return res.status(400).send('Missing parameters.');
    }

    fs.readFile(__dirname + "/leagues.json", 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('An error occurred while reading the file.');
        }

        console.log('File read successfully');

        let parseData;
        try {
            parseData = JSON.parse(data);
        } catch (jsonErr) {
            console.error("Error parsing JSON:", jsonErr);
            res.status(500).json({ error: "Error parsing JSON" });
            return;
        }

        const league = parseData.leagues.find(league => league.id === leagueID);
        if (!league) {
            console.log('League not found');
            return res.status(404).send('League not found.');
        }

        const division = league.divisions.find(division => division.divisionID === divisionID);
        if (!division) {
            console.log('Division not found');
            return res.status(404).send('Division not found.');
        }
        // console.log("Team Data");
        console.log(teamData);
        division.teams = teamData;

        fs.writeFile(jsonFilePath, JSON.stringify(parseData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('An error occurred while writing the file.');
            }

            res.status(200).json({ message: 'League updated successfully', data: teamData });
        });
    });
});


app.put('/league/:leagueID/division/:divisionID/timeslot/:timeslotID', (req, res) => {
    const divisionID = parseInt(req.params.divisionID);
    const timeslotID = parseInt(req.params.timeslotID);
    const leagueID = parseInt(req.params.leagueID, 10);
    const timeslotData = req.body;

    console.log(`Received PUT request for leagueID: ${leagueID}, divisionID: ${divisionID}, timeslotID: ${timeslotID}`);
    console.log("Received timeslot data:", timeslotData);

    // Check if the parameters are correctly extracted
    if (!leagueID || !divisionID || !timeslotID) {
        console.error('Missing parameters');
        return res.status(400).send('Missing parameters.');
    }

    fs.readFile(__dirname + "/leagues.json", 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('An error occurred while reading the file.');
        }

        console.log('File read successfully');

        let parseData;
        try {
            parseData = JSON.parse(data);
        } catch (jsonErr) {
            console.error("Error parsing JSON:", jsonErr);
            res.status(500).json({ error: "Error parsing JSON" });
            return;
        }

        const league = parseData.leagues.find(league => league.id === leagueID);
        if (!league) {
            console.log('League not found');
            return res.status(404).send('League not found.');
        }

        const division = league.divisions.find(division => division.divisionID === divisionID);
        if (!division) {
            console.log('Division not found');
            return res.status(404).send('Division not found.');
        }

        const timeslotIndex = division.timeslots.findIndex(timeslot => timeslot.id === timeslotID);
        if (timeslotIndex === -1) {
            console.log('Timeslot not found');
            return res.status(404).send('Timeslot not found.');
        }

        // Ensure the teamData includes the id as an integer
        timeslotData.id = timeslotID;

        const updatedTimeslotData = { ...timeslotData, id: timeslotID };
        delete updatedTimeslotData.timeslotID;

        console.log("Updating team:", updatedTimeslotData);
        division.timeslots[timeslotIndex] = updatedTimeslotData;

        fs.writeFile(jsonFilePath, JSON.stringify(parseData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('An error occurred while writing the file.');
            }

            res.status(200).json({ message: 'League updated successfully', data: parseData });
        });
    });
});


app.put('/league/:leagueID/division/:divisionID/schedule', (req, res) => {
    const divisionID = parseInt(req.params.divisionID);
    const leagueID = parseInt(req.params.leagueID, 10);
    const schedule = req.body;

    console.log(`Received PUT request for leagueID: ${leagueID}, divisionID: ${divisionID}`);
    console.log("Received schedule data:");

    // Check if the parameters are correctly extracted
    if (!leagueID || !divisionID) {
        console.error('Missing parameters');
        return res.status(400).send('Missing parameters.');
    }

    fs.readFile(__dirname + "/leagues.json", 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('An error occurred while reading the file.');
        }

        console.log('File read successfully');

        let parseData;
        try {
            parseData = JSON.parse(data);
        } catch (jsonErr) {
            console.error("Error parsing JSON:", jsonErr);
            res.status(500).json({ error: "Error parsing JSON" });
            return;
        }

        const league = parseData.leagues.find(league => league.id === leagueID);
        if (!league) {
            console.log('League not found');
            return res.status(404).send('League not found.');
        }

        const division = league.divisions.find(division => division.divisionID === divisionID);
        if (!division) {
            console.log('Division not found');
            return res.status(404).send('Division not found.');
        }


        console.log("Updating team:",);
        console.log(schedule);
        division.schedule = schedule;

        fs.writeFile(jsonFilePath, JSON.stringify(parseData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('An error occurred while writing the file.');
            }

            res.status(200).json({ message: 'League updated successfully', data: parseData });
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
app.delete('/league/:id', function (req, res) {
    console.log("Delete Request Received");

    fs.readFile(__dirname + "/leagues.json", 'utf8', function (err, data) {
        if (err) {
            return res.status(500).json({ message: 'Error reading data' });
        }

        let parseData = JSON.parse(data);
        const leagueID = parseInt(req.params.id, 10);

        // Find the index of the league with the given ID
        const leagueIndex = parseData.leagues.findIndex(league => league.id === leagueID);

        if (leagueIndex === -1) {
            return res.status(404).json({ message: 'League not found' });
        }

        // Remove the league from the array
        parseData.leagues.splice(leagueIndex, 1);

        const updatedData = JSON.stringify(parseData, null, 2);

        // Write the updated data back to the file
        fs.writeFile(__dirname + "/leagues.json", updatedData, function (writeErr) {
            if (writeErr) {
                return res.status(500).json({ message: 'Error saving data' });
            }

            console.log('League deleted successfully');
            res.status(200).json({ message: 'League deleted successfully', data: parseData });
        });
    });
});

app.delete('/leagues/:leagueID/divisions/:divisionID', function (req, res) {
    console.log("Delete Request Received");

    fs.readFile(__dirname + "/leagues.json", 'utf8', function (err, data) {
        if (err) {
            return res.status(500).json({ message: 'Error reading data' });
        }

        let parseData = JSON.parse(data);
        const leagueID = parseInt(req.params.leagueID, 10);
        const divisionID = parseInt(req.params.divisionID, 10);

        // Find the league
        const league = parseData.leagues.find(league => league.id === leagueID);
        if (!league) {
            console.log('League not found');
            return res.status(404).send('League not found.');
        }

        // Find the division
        const divisionIndex = league.divisions.findIndex(division => division.divisionID === divisionID);
        if (divisionIndex === -1) {
            console.log('Division not found');
            return res.status(404).send('Division not found.');
        }

        console.log("Found division:", league.divisions[divisionIndex]);

        // Remove the division from the array
        league.divisions.splice(divisionIndex, 1);

        // Stringify the updated data
        const updatedData = JSON.stringify(parseData, null, 2);

        // Write the updated data back to the file
        fs.writeFile(__dirname + "/leagues.json", updatedData, function (writeErr) {
            if (writeErr) {
                return res.status(500).json({ message: 'Error saving data' });
            }

            console.log('Division deleted successfully');
            res.status(200).json({ message: 'Division deleted successfully', data: parseData });
        });
    });
});

app.delete('/leagues/:leagueID/divisions/:divisionID/teams/:teamID', function (req, res) {
    console.log("Delete Request Received 1382");

    fs.readFile(__dirname + "/leagues.json", 'utf8', function (err, data) {
        if (err) {
            console.log("err 1386");
            return res.status(500).json({ message: 'Error reading data' });
        }

        let parseData = JSON.parse(data);
        const leagueID = parseInt(req.params.leagueID, 10);
        const divisionID = parseInt(req.params.divisionID, 10);
        const teamID = parseInt(req.params.teamID, 10);

        console.log("temID "+teamID);

        // Find the league
        const league = parseData.leagues.find(league => league.id === leagueID);
        if (!league) {
            console.log('League not found');
            return res.status(404).send('League not found.');
        }

        // Find the division
        const division = league.divisions.find(division => division.divisionID === divisionID);
        if (!division) {
            console.log('Division not found');
            return res.status(404).send('Division not found.');
        }

        console.log("Found division:", division);

        // Find the team
        const teamIndex = division.teams.findIndex(team => team.id === teamID);
        if (teamIndex === -1) {
            console.log('Team not found');
            return res.status(404).send('Team not found.');
        }

        console.log("Found team:", division.teams[teamIndex]);

        // Remove the team from the array
        division.teams.splice(teamIndex, 1);

        // Stringify the updated data
        const updatedData = JSON.stringify(parseData, null, 2);

        // Write the updated data back to the file
        fs.writeFile(__dirname + "/leagues.json", updatedData, function (writeErr) {
            if (writeErr) {
                return res.status(500).json({ message: 'Error saving data' });
            }

            console.log('Team deleted successfully');
            res.status(200).json({ message: 'Team deleted successfully', data: parseData });
        });
    });
});

app.delete('/leagues/:leagueID/divisions/:divisionID/timeslots/:timeslotID', function (req, res) {
    console.log("Delete Request Received");

    fs.readFile(__dirname + "/leagues.json", 'utf8', function (err, data) {
        if (err) {
            return res.status(500).json({ message: 'Error reading data' });
        }

        let parseData = JSON.parse(data);
        const leagueID = parseInt(req.params.leagueID, 10);
        const divisionID = parseInt(req.params.divisionID, 10);
        const timeslotID = parseInt(req.params.timeslotID, 10);

        // Find the league
        const league = parseData.leagues.find(league => league.id === leagueID);
        if (!league) {
            console.log('League not found');
            return res.status(404).send('League not found.');
        }

        // Find the division
        const division = league.divisions.find(division => division.divisionID === divisionID);
        if (!division) {
            console.log('Division not found');
            return res.status(404).send('Division not found.');
        }

        // Find the timeslot
        const timeslotIndex = division.timeslots.findIndex(timeslot => timeslot.id === timeslotID);
        if (timeslotIndex === -1) {
            console.log('Timeslot not found');
            return res.status(404).send('Timeslot not found.');
        }

        console.log("Found timeslot:", division.timeslots[timeslotIndex]);

        // Remove the timeslot from the array
        division.timeslots.splice(timeslotIndex, 1);

        // Stringify the updated data
        const updatedData = JSON.stringify(parseData, null, 2);

        // Write the updated data back to the file
        fs.writeFile(__dirname + "/leagues.json", updatedData, function (writeErr) {
            if (writeErr) {
                return res.status(500).json({ message: 'Error saving data' });
            }

            console.log('Timeslotf deleted successfully');
            res.status(200).json({ message: 'Timeslot deleted successfully', data: parseData });
        });
    });
});


app.put('/league/:id', function (req, res) {
    console.log("Request Received " + req.params.id);
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





