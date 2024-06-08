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
            scheduleByWeeks[k][i].setMatch(chosenMatch);
            teams = teams.filter(team => ![chosenMatch.getHomeTeam(), chosenMatch.getAwayTeam()].includes(team));
            weekMatchups = weekMatchups.filter(match =>
                ![chosenMatch.getHomeTeam(), chosenMatch.getAwayTeam()].includes(match.getHomeTeam()) &&
                ![chosenMatch.getHomeTeam(), chosenMatch.getAwayTeam()].includes(match.getAwayTeam())
            );

            seasonMatchups = seasonMatchups.filter(match =>
                !(match.getHomeTeam() === chosenMatch.getHomeTeam() && match.getAwayTeam() === chosenMatch.getAwayTeam()) &&
                !(match.getHomeTeam() === chosenMatch.getAwayTeam() && match.getAwayTeam() === chosenMatch.getHomeTeam())
            );
        }
        teams = [...teamCopy];
    }
    return scheduleByWeeks;
}

function main() {
    const teams = [
        new Team("Team 1", "Elite"),
        new Team("Team 2", "A"),
        new Team("Team 3", "B"),
        new Team("Team 4", "A"),
        new Team("Team 5", "A"),
        new Team("Team 6", "A"),
        new Team("Team 7", "A"),
        new Team("Team 8", "A")
    ];

    var teamCopy = teams.map(team => ({ ...team, weight: 0 }));

    const matchups = matchupGenerator(teams);

    const timeSlots = [
        new TimeSlot("2024-05-12 18:00:00", 1, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
        new TimeSlot("2024-05-12 19:00:00", 1, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
        new TimeSlot("2024-05-12 20:00:00", 1, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
        new TimeSlot("2024-05-12 21:00:00", 1, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
        new TimeSlot("2024-05-26 17:00:00", 2, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
        new TimeSlot("2024-05-26 18:00:00", 2, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
        new TimeSlot("2024-05-26 19:00:00", 2, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
        new TimeSlot("2024-05-26 20:00:00", 2, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
        new TimeSlot("2024-06-02 16:00:00", 3, new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false)),
        new TimeSlot("2024-06-02 18:00:00", 3, new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false)),
        new TimeSlot("2024-06-02 19:00:00", 3, new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false)),
        new TimeSlot("2024-06-02 20:00:00", 3, new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false)),
        new TimeSlot("2024-07-09 17:00:00", 4, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
        new TimeSlot("2024-06-09 18:00:00", 4, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
        new TimeSlot("2024-06-09 19:00:00", 4, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
        new TimeSlot("2024-06-09 20:00:00", 4, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
        new TimeSlot("2024-06-16 17:00:00", 5, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
        new TimeSlot("2024-06-16 18:00:00", 5, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
        new TimeSlot("2024-06-16 19:00:00", 5, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
        new TimeSlot("2024-06-16 20:00:00", 5, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
        new TimeSlot("2024-06-23 17:00:00", 6, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
        new TimeSlot("2024-06-23 18:00:00", 6, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
        new TimeSlot("2024-06-23 19:00:00", 6, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
        new TimeSlot("2024-06-23 20:00:00", 6, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
        new TimeSlot("2024-07-07 19:00:00", 7, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
        new TimeSlot("2024-07-07 20:00:00", 7, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
        new TimeSlot("2024-07-07 21:00:00", 7, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
        new TimeSlot("2024-07-07 22:00:00", 7, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false))
    ];

    const scheduleByWeeks = [];
    for (let i = 0; i < timeSlots[timeSlots.length - 1].getWeek(); i++) {
        scheduleByWeeks.push([]);
    }
    for (let ts of timeSlots) {
        scheduleByWeeks[ts.getWeek() - 1].push(ts);
    }

    for (let week of scheduleByWeeks) {
        week.sort((t1, t2) => t1.getDate() - t2.getDate());
        for (let i = 0; i < week.length; i++) {
            week[i].setWeight(i);
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
        
        if (maxWeight - minWeight > 0.35) {
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


    for (let week of returnSchedule) {
        for (let slot of week) {
            console.log(slot.toString());
        }
        console.log();
    }
}

main();
