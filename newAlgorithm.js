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
    }

    getHomeTeam() {
        return this.homeTeam;
    }

    getAwayTeam() {
        return this.awayTeam;
    }

    toString() {
        return `${this.homeTeam.getTeamName()} vs ${this.awayTeam.getTeamName()}`;
    }
}

class TimeSlot {
    constructor(date, week, playingLocation) {
        this.date = new Date(date);
        this.week = week;
        this.playingLocation = playingLocation;
        this.weight = 0;
        this.match = null;
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
        for (let j = 0; j < teams.length; j++) {
            if (i !== j) {
                const awayTeam = teams[j];
                matchups.push(new Match(homeTeam, awayTeam));
            }
        }
    }
    return matchups;
}

function generateSchedule(matchups, scheduleByWeeks, teams) {
    let seasonMatchups = [...matchups];
    for (let k = 0; k < scheduleByWeeks.length; k++) {
        let weekMatchups = [...seasonMatchups];
        var teamCopy = [...teams];

        for (let i = 0; i < scheduleByWeeks[k].length; i++) {
            if (weekMatchups.length === 0) {
                return scheduleByWeeks;
            }
            const index = Math.floor(Math.random() * weekMatchups.length);
            const chosenMatch = weekMatchups[index];
            scheduleByWeeks[k][i].match = chosenMatch;
            teams = teams.filter(team => ![chosenMatch.homeTeam, chosenMatch.awayTeam].includes(team));
            weekMatchups = weekMatchups.filter(match =>
                ![chosenMatch.homeTeam, chosenMatch.awayTeam].includes(match.homeTeam) &&
                ![chosenMatch.homeTeam, chosenMatch.awayTeam].includes(match.awayTeam)
            );

            seasonMatchups = seasonMatchups.filter(match =>
                !(match.homeTeam === chosenMatch.homeTeam && match.awayTeam === chosenMatch.awayTeam) &&
                !(match.homeTeam === chosenMatch.awayTeam && match.awayTeam === chosenMatch.homeTeam)
            );
        }

        teams = [...teamCopy];
        //console.log(k);
    }
    return scheduleByWeeks;
}

function main(teams, timeSlots) {
    var teamCopy = teams.map(team => ({ ...team, weight: 0 }));

    const matchups = matchupGenerator(teams);

    console.log(timeSlots);

    const scheduleByWeeks = [];
    for (let i = 0; i < timeSlots[timeSlots.length - 1].week; i++) {
        console.log(timeSlots[timeSlots.length-1].week);
        scheduleByWeeks.push([]);
    }
    for (let ts of timeSlots) {
        scheduleByWeeks[ts.week - 1].push(ts);
    }

    for (let week of scheduleByWeeks) {
        week.sort((t1, t2) => t1.date - t2.date);
        for (let i = 0; i < week.length; i++) {
            week[i].weight = i;
        }
    }

    let returnSchedule = generateSchedule(matchups, scheduleByWeeks, teams);

    let goodSchedule = false;
    let balancedSchedule = false;
    let dupeTeam = true;

    while (!goodSchedule || !balancedSchedule || dupeTeam) {
        // Generate a new schedule
        returnSchedule = generateSchedule(matchups, scheduleByWeeks, teams);
        
        // Check if the schedule is good
        goodSchedule = true;
        for (let k = 0; k < returnSchedule.length; k++) {
            for (let i = 0; i < returnSchedule[k].length; i++) {
                if (returnSchedule[k][i].match == null) {
                    goodSchedule = false;
                    break;
                }
            }
            if (!goodSchedule) {
                break;
            }
        }

        if (goodSchedule) {
            // Check if the schedule is balanced
            balancedSchedule = true;  // Start with an assumption that the schedule is balanced
            for (let p = 0; p < teamCopy.length; p++) {
                teamCopy[p].weight = 0; // Reset team weights
            }
            
            for (let k = 0; k < returnSchedule.length; k++) {
                for (let i = 0; i < returnSchedule[k].length; i++) {
                    for (let p = 0; p < teamCopy.length; p++) {
                        if (teamCopy[p].teamName === returnSchedule[k][i].match.homeTeam.teamName || 
                            teamCopy[p].teamName === returnSchedule[k][i].match.awayTeam.teamName) {
                            teamCopy[p].weight += returnSchedule[k][i].weight;
                        }
                    }
                }
            }

            let weights = [];
            for (let r = 0; r < teamCopy.length; r++) {
                weights.push(teamCopy[r].weight / returnSchedule.length);
            }
            
            let minWeight = Math.min(...weights);
            let maxWeight = Math.max(...weights);
            if (maxWeight - minWeight > 0.15) {
                balancedSchedule = false;
            }

            if (balancedSchedule) {
                // Check for duplicate teams
                dupeTeam = false;
                for (let k = 0; k < returnSchedule.length; k++) {
                    let teamsCopy = [];
                    for (let i = 0; i < returnSchedule[k].length; i++) {
                        teamsCopy.push(returnSchedule[k][i].match.awayTeam.teamName);
                        teamsCopy.push(returnSchedule[k][i].match.homeTeam.teamName);
                    }
                    let s = new Set();
                    for (let teamName of teamsCopy) {
                        if (s.has(teamName)) {
                            dupeTeam = true;
                            break;
                        } else {
                            s.add(teamName);
                        }
                    }
                    if (dupeTeam) {
                        break;
                    }
                }
            }
        }
    }

    return returnSchedule;
}

module.exports = { Team, TimeSlot, PlayingLocation, main };
