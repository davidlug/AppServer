class Team {
    constructor(teamName, skillLevel) {
        this.teamName = teamName;
        this.skillLevel = skillLevel;
        this.scheduleWeight = 0;
    }

    getTeamName() {
        return this.teamName;
    }

    setScheduleWeight(weight) {
        this.scheduleWeight += weight;
    }

    resetScheduleWeight() {
        this.scheduleWeight = 0;
    }
}

class Match {
    constructor(homeTeam, awayTeam) {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.gamesPlayed = 0;
    }

    getHomeTeam() {
        return this.homeTeam;
    }

    getAwayTeam() {
        return this.awayTeam;
    }

    toString() {
        //return `${this.homeTeam.getTeamName()} vs ${this.awayTeam.getTeamName()}`;
    }
}

class TimeSlot {
    constructor(date, week, playingLocation, lateGame = false) {
        this.date = new Date(date);
        this.week = week;
        this.playingLocation = playingLocation;
        this.weight = 0;
        this.match = null;
        this.lateGame = lateGame;
    }

    getDate() {
        return this.date;
    }

    getWeek() {
        return this.week;
    }

    setMatch(match) {
        this.match = match;
    }

    getMatch() {
        return this.match;
    }

    setWeight(weight) {
        this.weight = weight;
    }

    toString() {
        return `${this.date} - ${this.match}`;
    }
}

class PlayingLocation {
    constructor(name, rink, isOutdoor) {
        this.name = name;
        this.rink = rink;
        this.isOutdoor = isOutdoor;
    }
}

function matchupGenerator(teams) {
    const matchups = [];
    for (let i = 0; i < teams.length; i++) {
        const homeTeam = teams[i];
        for (let j = i + 1; j < teams.length; j++) {
            if (i !== j) {
                const awayTeam = teams[j];
                matchups.push(new Match(homeTeam, awayTeam));
            }
        }
    }
    return matchups;
}
function generateSchedule(matchups, scheduleByWeeks, teams, teamsGamesPlayed, oldSchedule) {
    // console.log("Received teamsGamesPlayed");
    // console.log(teamsGamesPlayed);

    function schedule() {
        console.log("Entered schedule() method");
        for(let i = 0; i < scheduleByWeeks.length; i++)
        {
            console.log(i+1);
        }

        let seasonMatchups = [...matchups];
        let tempSchedule = JSON.parse(JSON.stringify(scheduleByWeeks)); // Create a deep copy of the schedule
        let tempTeams = JSON.parse(JSON.stringify(teams)); // Create a deep copy of the teams array

        if (teams.length % 2 == 0) {
            console.log("Entered even loop");
            //Entry point for specific week

            for (let k = 0; k < tempSchedule.length; k++) {
                

                let weekMatchups = [...seasonMatchups];

                let teamCopy = [...tempTeams];
                let teamsScheduledThisWeek = new Set();

                //Entry point for specific timeslot in week

                function generateWeekSchedule() {

                    for (let i = 0; i < tempSchedule[k].length; i++) {

                        teamsScheduledThisWeek.clear();

                        if (weekMatchups.length === 0) {
                            console.log("weekMatchups is empty");
                            return false;
                        }
                        const index = Math.floor(Math.random() * weekMatchups.length);

                        let chosenMatch = weekMatchups.splice(index, 1)[0];


                        if (chosenMatch == null) {
                            return oldSchedule;
                        }

                        // Ensure chosen match teams are not scheduled twice in the week
                        if (teamsScheduledThisWeek.has(chosenMatch.homeTeam.teamName) || teamsScheduledThisWeek.has(chosenMatch.awayTeam.teamName)) {
                            teamsScheduledThisWeek.clear();
                            return (false);
                        }

                        let teamsOnThisDay = [];

                        for(let a = 0; a < tempSchedule.length; a++)
                        {
                            for(let b = 0; b < tempSchedule[a].length; b++)
                            {
                                if(tempSchedule[a][b].match != null)
                                {
                                   
                                    if(tempSchedule[a][b].date == tempSchedule[k][i].date)
                                    {
                                        teamsOnThisDay.push(tempSchedule[a][b].match.homeTeam.teamName);
                                        teamsOnThisDay.push(tempSchedule[a][b].match.awayTeam.teamName);
                                        teamsOnThisDay.push(chosenMatch.homeTeam.teamName);
                                        teamsOnThisDay.push(chosenMatch.awayTeam.teamName);
                                       
                                        //     || chosenMatch.awayTeam.teamName == tempSchedule[a][b].match.homeTeam.teamName || chosenMatch.awayTeam.teamName == tempSchedule[a][b].match.awayTeam.teamName)
                                        //     {
                                        //         console.log("Issue detected 173");
                                        //         console.log(tempSchedule[a][b]);
                                        //         console.log(tempSchedule[k][i]);
                                        //         return false;
                                        //     }
                                    }
                                    
                                }
                                
                            }
                        }
                        //console.log("Teams on this day" + tempSchedule[k][i].date);
                         //           console.log(teamsOnThisDay);

                        weekMatchups = weekMatchups.filter(match =>
                            !(match.homeTeam.teamName == chosenMatch.homeTeam.teamName || match.awayTeam.teamName == chosenMatch.awayTeam.teamName) &&
                            !(match.awayTeam.teamName == chosenMatch.homeTeam.teamName || match.homeTeam.teamName == chosenMatch.awayTeam.teamName)
                        );



                        tempSchedule[k][i].match = chosenMatch;
                        teamsScheduledThisWeek.add(chosenMatch.homeTeam.teamName);
                        teamsScheduledThisWeek.add(chosenMatch.awayTeam.teamName);

                    }

                    //console.log("Return tempSchedule[k]");
                    for (let m = 0; m < tempSchedule[k].length; m++) {
                        let chosenMatch = tempSchedule[k][m].match;
                        seasonMatchups = seasonMatchups.filter(match =>
                            !(match.homeTeam === chosenMatch.homeTeam && match.awayTeam === chosenMatch.awayTeam) &&
                            !(match.homeTeam === chosenMatch.awayTeam && match.awayTeam === chosenMatch.homeTeam)
                        );
                        for (let j = 0; j < teamsGamesPlayed.length; j++) {
                            if (chosenMatch.homeTeam.teamName === teamsGamesPlayed[j].teamName || chosenMatch.awayTeam.teamName === teamsGamesPlayed[j].teamName) {
                                teamsGamesPlayed[j].numGames--;

                            }
                        }
                    }
                    return tempSchedule[k];
                }


                tempTeams = [...teamCopy];
                // console.log("After k value " + k);
                let genSchedule = generateWeekSchedule()
                let genScheduleCheck = true;
                if (genSchedule == false) {
                    genScheduleCheck = false;
                }

                while (genScheduleCheck == false) {
                    return false;
                }
            }

        }
        else {
            console.log("Entered odd loop")
            let byeWeeks = [...teams];
            for (let k = 0; k < tempSchedule.length; k++) {
                let weekMatchups = [...seasonMatchups];
                let teamCopy = [...tempTeams];
                let teamsScheduledThisWeek = new Set();
                let byeTeam = byeWeeks[0];
                console.log("byeTeam");
                console.log(byeTeam);

                teamsGamesPlayed = teamsGamesPlayed.filter(team => team.numGames > 0);
                weekMatchups = weekMatchups.filter(match => match.homeTeam.teamName != byeTeam.teamName && match.awayTeam.teamName != byeTeam.teamName);
                byeWeeks = byeWeeks.filter(team => team.teamName != byeTeam.teamName);
                console.log(byeWeeks);

                console.log("Checking");
                console.log(teamsGamesPlayed);

                // Sort teams by the number of games played in ascending order
                teamsGamesPlayed.sort((a, b) => a.numGames - b.numGames);

                // Prioritize matchups involving teams with the least games played
                let prioritizedMatchups = weekMatchups.filter(match =>
                    teamsGamesPlayed.slice(0, 2).some(team => team.teamName === match.homeTeam.teamName || team.teamName === match.awayTeam.teamName)
                );

                for (let i = 0; i < tempSchedule[k].length; i++) {

                    // if(weekMatchups.length == 0)
                    //     {
                    //         console.log("weekMatchups is empty!");
                    //         return false;
                    //     }


                    let chosenMatch;
                    console.log("249 weekMatchups");
                    console.log(weekMatchups);
                    if (weekMatchups.length == 0) {
                        console.log("weekMatchups is empty 253");
                        return false;
                    }
                    // console.log("Priority");
                    // console.log(prioritizedMatchups);

                    // Try to get a prioritized matchup first
                    if (prioritizedMatchups.length > 0) {
                        const index = Math.floor(Math.random() * prioritizedMatchups.length);
                        chosenMatch = prioritizedMatchups.splice(index, 1)[0];
                    } else {
                        console.log("Cannot prioritize. Reselect");
                        console.log(weekMatchups);
                        if (weekMatchups.length === 0) {
                            console.log("Loop Season");
                            //weekMatchups = matchups.filter(match => match.homeTeam.numGames != 0 && match.awayTeam.numGames != 0);
                            //weekMatchups = matchups.filter(match => match.homeTeam.teamName != byeTeam.teamName && match.awayTeam.teamName != byeTeam.teamName)
                            console.log(byeTeam.teamName);

                        }
                        const index = Math.floor(Math.random() * weekMatchups.length);
                        chosenMatch = weekMatchups.splice(index, 1)[0];
                    }

                    console.log("weekMatchups 270");
                    console.log(weekMatchups);


                    console.log("Chosen Match");
                    console.log(chosenMatch.homeTeam.teamName + " vs " + chosenMatch.awayTeam.teamName);
                    console.log("Week Matchups");
                    console.log(weekMatchups.map(match => match.homeTeam.teamName + " vs " + match.awayTeam.teamName));
                    if (chosenMatch == undefined) {
                        console.log("Have to exit");
                        return oldSchedule;
                    }

                    // Ensure chosen match teams are not scheduled twice in the week
                    if (teamsScheduledThisWeek.has(chosenMatch.homeTeam.teamName) || teamsScheduledThisWeek.has(chosenMatch.awayTeam.teamName)) {
                        console.log("Retried");
                        i--; // Retry this time slot
                        return false;
                    }

                    weekMatchups = weekMatchups.filter(match =>
                        !(match.homeTeam.teamName == chosenMatch.homeTeam.teamName || match.awayTeam.teamName == chosenMatch.awayTeam.teamName) &&
                        !(match.awayTeam.teamName == chosenMatch.homeTeam.teamName || match.homeTeam.teamName == chosenMatch.awayTeam.teamName)
                    );
                    prioritizedMatchups = prioritizedMatchups.filter(match =>
                        !(match.homeTeam.teamName == chosenMatch.homeTeam.teamName || match.awayTeam.teamName == chosenMatch.awayTeam.teamName) &&
                        !(match.awayTeam.teamName == chosenMatch.homeTeam.teamName || match.homeTeam.teamName == chosenMatch.awayTeam.teamName)
                    );

                    //console.log(weekMatchups);

                    tempSchedule[k][i].match = chosenMatch;
                    teamsScheduledThisWeek.add(chosenMatch.homeTeam.teamName);
                    teamsScheduledThisWeek.add(chosenMatch.awayTeam.teamName);

                    for (let j = 0; j < teamsGamesPlayed.length; j++) {
                        if (chosenMatch.homeTeam.teamName === teamsGamesPlayed[j].teamName || chosenMatch.awayTeam.teamName === teamsGamesPlayed[j].teamName) {
                            console.log(`200 -- ${teamsGamesPlayed[j].numGames} ${teamsGamesPlayed[j].teamName}`);
                            teamsGamesPlayed[j].numGames--;
                            // console.log("teamsGamesPlayed");
                            // console.log(teamsGamesPlayed[j].teamName);
                            // console.log(teamsGamesPlayed[j].numGames);
                        }
                    }

                    teamsGamesPlayed.forEach(team => {
                        if (team.numGames === 0) {
                            console.log("No games left " + team.teamName);
                            weekMatchups = weekMatchups.filter(match => match.homeTeam.teamName !== team.teamName && match.awayTeam.teamName !== team.teamName);
                            matchups = matchups.filter(match => match.homeTeam.teamName !== team.teamName && match.awayTeam.teamName !== team.teamName);
                        }
                    });

                    weekMatchups = weekMatchups.filter(match =>
                        ![chosenMatch.homeTeam, chosenMatch.awayTeam].includes(match.homeTeam) &&
                        ![chosenMatch.homeTeam, chosenMatch.awayTeam].includes(match.awayTeam)
                    );
                    seasonMatchups = seasonMatchups.filter(match =>
                        !(match.homeTeam === chosenMatch.homeTeam && match.awayTeam === chosenMatch.awayTeam) &&
                        !(match.homeTeam === chosenMatch.awayTeam && match.awayTeam === chosenMatch.homeTeam)
                    );
                }

                tempTeams = [...teamCopy];
                console.log("After k value " + k);
                console.log(tempSchedule[k]);
                for (let i = 0; i < tempSchedule[k].length; i++) {
                    let selectMatch = tempSchedule[k][i].match;
                    let selectHomeTeam = selectMatch.homeTeam.teamName;
                    console.log("Remove " + selectHomeTeam);
                    let selectAwayTeam = selectMatch.awayTeam.teamName;
                    console.log("Remove " + selectAwayTeam);
                    //byeWeeks = byeWeeks.filter(team => !(team.teamName == selectHomeTeam || team.teamName == selectAwayTeam));


                }
                console.log("byeWeeks");
                console.log(byeWeeks);
            }
        }
        console.log("Original Schedule ")
        return tempSchedule;
    }



    let returnSchedule = schedule();
    console.log("returnSchedule value " + returnSchedule);
    if (returnSchedule == false) {
        return false;
    }
    else {
        return returnSchedule;
    }

}



function generateExtraSchedule(matchups, scheduleByWeeks, teams, teamsGamesPlayed, originalSchedule) {
    const MAX_RETRIES = 1; // Set a maximum number of retries to avoid infinite loops
    console.log("Inside generateExtraSchedule");

    function schedule() {
        const tempSchedule = JSON.parse(JSON.stringify(scheduleByWeeks)); // Create a deep copy of the schedule
        let tempMatchups = JSON.parse(JSON.stringify(matchups)); // Create a deep copy of the matchups array

        tempMatchups = tempMatchups.filter(matchups => matchups.length != 0);

        for (let k = 0; k < tempSchedule.length; k++) {
            console.log("tempMatchups for week " + k);

            // Find the teams with the least number of games played
            const minGamesPlayed = Math.min(...teams.map(team => team.gamesPlayed));
            const leastGamesTeams = teams.filter(team => team.gamesPlayed === minGamesPlayed);

            // Randomly select one team from those with the least games played
            const randomIndex = Math.floor(Math.random() * leastGamesTeams.length);
            const leastGamesTeam = leastGamesTeams[randomIndex];

            console.log(leastGamesTeam.teamName + " has played the least number of games");

            if (tempMatchups[k] == undefined) {
                tempMatchups[k] = [...tempMatchups][0];
            }

            console.log("Extra date");
            console.log(tempSchedule[k].date);

            // Filter out matchups that are already scheduled on the same date
            for (let a = 0; a < originalSchedule.length; a++) {
                for (let b = 0; b < originalSchedule[a].length; b++) {
                    if (originalSchedule[a][b].date == tempSchedule[k].date) {
                        console.log("Same date matchup");
                        console.log(originalSchedule[a][b].match.homeTeam.teamName + " vs " + originalSchedule[a][b].match.awayTeam.teamName);
                        tempMatchups[k] = tempMatchups[k].filter(match => 
                            !(match.homeTeam.teamName == originalSchedule[a][b].match.homeTeam.teamName || match.homeTeam.teamName == originalSchedule[a][b].match.awayTeam.teamName ||
                              match.awayTeam.teamName == originalSchedule[a][b].match.homeTeam.teamName || match.awayTeam.teamName == originalSchedule[a][b].match.awayTeam.teamName));
                    }
                }
            }

            // Prioritize matchups involving the selected team with the least games played
            let prioritizedMatchups = tempMatchups[k].filter(match =>
                match.homeTeam.teamName == leastGamesTeam.teamName || match.awayTeam.teamName == leastGamesTeam.teamName
            );

            let chosenMatch;
            if (prioritizedMatchups.length > 0) {
                const index = Math.floor(Math.random() * prioritizedMatchups.length);
                chosenMatch = prioritizedMatchups[index];
            } else {
                const index = Math.floor(Math.random() * tempMatchups[k].length);
                chosenMatch = tempMatchups[k][index];
            }

            tempSchedule[k].match = chosenMatch; // Properly assign the chosen match to the current week

            // Update the games played count for the teams in the chosen match
            for (let i = 0; i < teams.length; i++) {
                if (teams[i].teamName == chosenMatch.homeTeam.teamName || teams[i].teamName == chosenMatch.awayTeam.teamName) {
                    teams[i].gamesPlayed++;
                }
            }
        }

        return tempSchedule;
    }

    let retries = 0;
    let result = null;

    while (retries < MAX_RETRIES && result === null) {
        result = schedule();
        retries++;
    }

    if (result === null) {
        throw new Error("Unable to generate a valid schedule after maximum retries");
    }

    return result;
}


function main(teams, timeSlots, lastWeek, oldSchedule) {
    let teamsGamesPlayed = [...teams];
    var teamCopy = teams.map(team => ({ ...team, weight: 0 }));
    let numGameValues = [];

    for (let i = 0; i < teams.length; i++) {
        numGameValues.push(teams[i].numGames)
    }

    timeSlots = timeSlots.filter(ts => !isNaN(Date.parse(ts.date)));
    if (timeSlots[timeSlots.length - 1].week >= teams.length) {
        timeSlots.slice(0, teams.length);
    }

    let matchups = matchupGenerator(teams);

    const numWeek = timeSlots[timeSlots.length - 1].week;

    timeSlots.sort((a, b) => a.week - b.week);

    const scheduleByWeeks = [];
    const extraWeeks = [];
    for (let i = 0; i < timeSlots[timeSlots.length - 1].week; i++) {
        scheduleByWeeks.push([]);
    }

    for (let ts of timeSlots) {
        if (ts.extra === "Yes") {
            extraWeeks.push(ts);
        } else {
            scheduleByWeeks[ts.week - 1].push(ts);
        }
    }

    for (let week of scheduleByWeeks) {
        week.sort((t1, t2) => new Date(t1.date) - new Date(t2.date));
    }

    let freezeWeeks = lastWeek || 0;
    let frozenSchedule = null;
    if (oldSchedule != undefined) {
        frozenSchedule = oldSchedule.slice(0, freezeWeeks);
    }
    let scheduleToGenerate = scheduleByWeeks.slice(freezeWeeks);

    if (frozenSchedule != undefined) {


        for (let i = 0; i < frozenSchedule.length; i++) {
            for (let k = 0; k < frozenSchedule[i].length; k++) {
                let timeslot = frozenSchedule[i][k];
                if (timeslot.match) {
                    let chosenMatch = timeslot.match;
                    matchups = matchups.filter(match =>
                        !(match.homeTeam === chosenMatch.homeTeam && match.awayTeam === chosenMatch.awayTeam) &&
                        !(match.homeTeam === chosenMatch.awayTeam && match.awayTeam === chosenMatch.homeTeam)
                    );
                }
            }
        }

        for (let i = 0; i < frozenSchedule.length; i++) {
            for (let p = 0; p < frozenSchedule[i].length; p++) {
                for (let k = 0; k < teams.length; k++) {
                    if (frozenSchedule[i][p].match) {
                        if (frozenSchedule[i][p].match.homeTeam.teamName === teams[k].teamName || frozenSchedule[i][p].match.awayTeam.teamName === teams[k].teamName) {
                            teams[k].gamesPlayed++;
                        }

                    }
                }
            }

        }
    }

    let scheduleSections = [];

    if (teams.length % 2 == 0) {

        let numberRepeats = Math.floor(scheduleToGenerate.length / teams.length);
        let backup = scheduleToGenerate;
        let start = 0;
        let end = teams.length - 1;
        for (let i = 0; i < numberRepeats + 2; i++) {
            scheduleToGenerate = backup.slice(start, end);
            scheduleSections.push(scheduleToGenerate);
            start = start + teams.length - 1;
            end = end + teams.length - 1;
            if (end > backup.length) {
                end = backup.length;
            }
        }

        repeatSchedule = backup.slice(teams.length - 1);
    }
    else {
        let numberRepeats = Math.ceil(scheduleToGenerate.length / teams.length);

        let backup = scheduleToGenerate;
        let start = 0;
        let end = teams.length;
        for (let i = 0; i < numberRepeats; i++) {
            scheduleToGenerate = backup.slice(start, end);
            scheduleSections.push(scheduleToGenerate);
            start = start + teams.length;
            end = end + teams.length;

            if (end > backup.length) {
                end = backup.length;
            }
        }
        repeatSchedule = backup.slice(teams.length - 1);
    }


    let returnSchedule = [[]];
    let generated = null;

    for (let z = 0; z < scheduleSections.length; z++) {
        scheduleSections[z] = scheduleSections[z].filter(subsection => subsection.length > 0);
    }
    scheduleSections = scheduleSections.filter(m => m.length > 0);
    let teamsGamesPlayedBackup = JSON.parse(JSON.stringify(teamsGamesPlayed))
    for (let i = 0; i < scheduleSections.length; i++) {
        generated = generateSchedule(matchups, scheduleSections[i], teams, teamsGamesPlayed, oldSchedule);
        

        while (generated == false) {
            generated = generateSchedule(matchups, scheduleSections[i], teams, teamsGamesPlayedBackup, oldSchedule);
        }

        if (generated === null) {
            throw new Error("Failed to generate schedule for section " + i);
        }
        returnSchedule[0].push(...generated);
        
    }

    let balancedSchedule = false;

    for (let m = 0; m < teams.length; m++) {
        let tempWeight = 0;
        for (let i = 0; i < returnSchedule[0].length; i++) {
            for (let p = 0; p < returnSchedule[0][i].length; p++) {
                if (teams[m].teamName == returnSchedule[0][i][p].match.homeTeam.teamName || teams[m].teamName == returnSchedule[0][i][p].match.awayTeam.teamName) {
                    tempWeight += returnSchedule[0][i][p].weight;
                }
            }
        }

        teams[m].weight = tempWeight / returnSchedule[0].length;
    }

    let weights = teams.map(team => team.weight);


    teams.map((team, index) => {
        return {
            ...team,
            assignedWeight: weights[index]
        };
    });

    for (let i = 0; i < weights.length; i++) {
        teams[i].weight = weights[i];
    }


    let minWeight = Math.min(...weights);
    let maxWeight = Math.max(...weights);

    balancedSchedule = (maxWeight - minWeight <= 0.15);


    while (!balancedSchedule) {
        for (let i = 0; i < scheduleSections.length; i++) {
            generated = generateSchedule(matchups, scheduleSections[i], teams, teamsGamesPlayed, oldSchedule);
            if (generated === null) {
                throw new Error("Failed to generate schedule for section " + i);
            }
            if (generated == false) {
                console.log("Error! Returned schedule is false!");
            }
        }

        let weights = teamCopy.map(team => team.weight);
        teams.map((team, index) => {
            return {
                ...team,
                assignedWeight: weights[index]
            };
        });

        for (let i = 0; i < weights.length; i++) {
            teams[i].weight = weights[i];
        }

        let minWeight = Math.min(...weights);
        let maxWeight = Math.max(...weights);

        balancedSchedule = (maxWeight - minWeight <= 0.15);
    }

      teams.forEach(team => team.gamesPlayed = 0);

    let finalSchedule = null;

    if (frozenSchedule == null || frozenSchedule == undefined) {
        finalSchedule = returnSchedule[0]
    }
    else {
        finalSchedule = frozenSchedule.concat(returnSchedule[0]);
    }

    let leftoverMatchupsArray = [];
    let leftOverTeams = [];

    for (let i = 0; i < finalSchedule.length; i++) {
        let teamsCopy = [...teams];

        for (let k = 0; k < finalSchedule[i].length; k++) {
            let chosenMatch = finalSchedule[i][k].match;
            let chosenMatchHomeTeam = chosenMatch.homeTeam.teamName;
            let chosenMatchAwayTeam = chosenMatch.awayTeam.teamName;
            teamsCopy = teamsCopy.filter(team =>
                team.teamName !== chosenMatchHomeTeam &&
                team.teamName !== chosenMatchAwayTeam
            );
        }
        leftOverTeams.push(teamsCopy);
    }


    for (let i = 0; i < finalSchedule.length; i++) {
        leftoverMatchupsArray.push([]); // Initialize sub-array for the current week
    
        let weeklyLeftoverTeams = leftOverTeams[i]; // Get the leftover teams for the current week
    
        for (let p = 0; p < weeklyLeftoverTeams.length; p++) {
            for (let k = 0; k < matchups.length; k++) {
                let chosenMatch = matchups[k];
                let homeTeam = chosenMatch.homeTeam.teamName;
                let awayTeam = chosenMatch.awayTeam.teamName;
    
                // Check if the matchup involves the leftover team
                if (weeklyLeftoverTeams.some(team => team.teamName === homeTeam || team.teamName === awayTeam)) {
                    leftoverMatchupsArray[i].push(chosenMatch);
                }
            }
        }
    
    }

    let extraWeekRemove = [];


    for (let i = 0; i < leftoverMatchupsArray.length; i++) {
    
        let extra = false; // Initialize the flag for bonus matchups
    
        for (let p = 0; p < extraWeeks.length; p++) {
            if (extraWeeks[p].week === (i + 1)) {      
                extra = true; // Set flag to true since this week has bonus matchups
                break; // Exit loop early since we've found the week
            }
        }
    
        if (!extra) {
            extraWeekRemove.push((i + 1)); // Push weeks without bonus matchups
        }
    }
    

    for (let i = 0; i < extraWeekRemove.length; i++) {
        for (let m = 0; m < leftoverMatchupsArray.length; m++) {
            if (extraWeekRemove[i] === m+1) {
                leftoverMatchupsArray[m] = [];
            }
        }
    }


    console.log("Final 729");
    console.log(finalSchedule);

    for(let i = 0; i < finalSchedule.length; i++)
    {
        for(let p = 0; p < finalSchedule[i].length; p++)
        {
            let chosenMatch = finalSchedule[i][p].match;
            for(let m = 0; m < teams.length; m++)
            {
                if(teams[m].teamName == chosenMatch.homeTeam.teamName || teams[m].teamName == chosenMatch.awayTeam.teamName)
                {
                    teams[m].gamesPlayed++;
                }
            }
        }
    }

    console.log("teams 747");
    console.log(teams);

    let extraSchedule;

    if (extraWeeks.length != null) {
        extraSchedule = generateExtraSchedule(leftoverMatchupsArray, extraWeeks, teams, teamsGamesPlayed, finalSchedule);

    }

    if (extraSchedule != null) {
        for (let extraWeek of extraSchedule) {
            let weekNumber = extraWeek.week - 1;  // Adjusting week index (assuming week is 1-based)
            if (!finalSchedule[weekNumber]) {
                finalSchedule[weekNumber] = [];
            }
            finalSchedule[weekNumber] = finalSchedule[weekNumber].concat(extraWeek);
            finalSchedule[weekNumber].sort((a, b) => new Date(a.date) - new Date(b.date));
        }
    }



    for (let week of finalSchedule) {

        for (let ts of week) {
            if (ts.match) {
                ts.match.homeTeam.gamesPlayed++;
                ts.match.awayTeam.gamesPlayed++;
            }
        }
    }

    for (let i = 0; i < teams.length; i++) {
        teams[i].numGames = numGameValues[i];
    }


    if(finalSchedule.length > 1)
    {
        console.log("Entering final check");
        for(let i = 1; i < finalSchedule.length; i++)
        {
            let analyzeWeeks = finalSchedule.slice(0, i);
            let currentWeek = finalSchedule[i];


            for(let m = 0; m < currentWeek.length; m++)
            {
                let currentDate = currentWeek[m].date;
                let currentMatch = currentWeek[m].match;
                for(let k = 0; k < analyzeWeeks.length; k++)
                {
                    for(let o = 0; o < analyzeWeeks[k].length; o++)
                        {
                            let selectDate = analyzeWeeks[k][o].date;
                            let selectMatch = analyzeWeeks[k][o].match;
                            if(selectDate == currentDate)
                            {
                                console.log("Check match");
                                console.log(selectDate);
                                
                                if(selectMatch.homeTeam.teamName == currentMatch.homeTeam.teamName 
                                    || selectMatch.awayTeam.teamName == currentMatch.homeTeam.teamName 
                                    || selectMatch.homeTeam.teamName == currentMatch.awayTeam.teamName 
                                    || selectMatch.awayTeam.teamName == currentMatch.awayTeam.teamName)
                                    {
                                        console.log("Flagged");
                                        console.log(selectMatch.homeTeam.teamName + " vs "+ selectMatch.awayTeam.teamName);
                                        console.log(currentMatch.homeTeam.teamName + " vs "+ currentMatch.awayTeam.teamName);
                                        console.log("Choose from");
                                        console.log(currentWeek.map(section => section.match.homeTeam.teamName + " vs "+ section.match.awayTeam.teamName));
                                        for(let a = 0; a < currentWeek.length; a++)
                                        {
                                            if(currentWeek[a].match.homeTeam.teamName != selectMatch.homeTeam.teamName 
                                                && currentWeek[a].match.homeTeam.teamName != selectMatch.awayTeam.teamName 
                                                && currentWeek[a].match.awayTeam.teamName != selectMatch.homeTeam.teamName 
                                                && currentWeek[a].match.awayTeam.teamName != selectMatch.awayTeam.teamName)
                                                {
                                                    console.log("Can swap " + currentMatch.homeTeam.teamName + " vs " + currentMatch.awayTeam.teamName+ " with " + currentWeek[a].match.homeTeam.teamName + " vs " + currentWeek[a].match.awayTeam.teamName);
                                                    console.log(currentWeek[m]);
                                                    console.log(currentWeek[a]);
                                                    let tempMatch = currentWeek[m].match;
                                                    currentWeek[m].match = currentWeek[a].match;
                                                    currentWeek[a].match = tempMatch;
                                                }
                                        }
                                    }
                            }
                        }
                }
            }
        }
    }
    



    
    

    return finalSchedule;
}



module.exports = { Team, TimeSlot, PlayingLocation, main };
