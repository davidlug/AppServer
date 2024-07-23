import exp from "constants";

interface Team {
    id: number;
    teamName: string;
    Players: number;
    weight: number;
    numGames: number;
    gamesPlayed: number;
    Division: string;
  }
  
  interface Division {
    divisionID: number;
    divisionName: String;
    teams: Team[];
    timeslots: TimeSlot[];
    schedule: TimeSlot[][];
  }
  
  interface TimeSlot{
      week: number;
      date: string;
      startTime: string;
      endTime: string;
      facility: string;
      rink: string;
      extra: string;
      additionalData?: string[];
      weight: number;
      id: number;
      match?: Match;
      gamesPlayed: number;
  
  }
  
  interface Match {
      homeTeam: Team;
      awayTeam: Team;
  }
  
  interface League {
    id: number;
    divisions: Division[];
  }

  function matchupGenerator(teams: Team[]): Match[] {
    const matchups: Match[] = [];
    for (let i = 0; i < teams.length; i++) {
        const homeTeam = teams[i];
        for (let j = 0; j < teams.length; j++) {
            if (i !== j) {
                const awayTeam = teams[j];
                matchups.push({ homeTeam, awayTeam });
            }
        }
    }
    return matchups;
}


function generateSchedule(matchups, scheduleByWeeks, teams, teamsGamesPlayed) {
    const MAX_RETRIES = 100000; // Set a maximum number of retries to avoid infinite loops

    function schedule() {
        let seasonMatchups = [...matchups];
        let tempSchedule = JSON.parse(JSON.stringify(scheduleByWeeks)); // Create a deep copy of the schedule
        let tempTeams = JSON.parse(JSON.stringify(teams)); // Create a deep copy of the teams array

        for (let k = 0; k < tempSchedule.length; k++) {
            let weekMatchups = [...seasonMatchups];
            let teamCopy = [...tempTeams];
            let teamsScheduledThisWeek = new Set();

            teamsGamesPlayed = teamsGamesPlayed.filter(team => team.numGames > 0);
            weekMatchups = weekMatchups.filter(match => match.homeTeam.numGames > 0 && match.awayTeam.numGames > 0);
            seasonMatchups = seasonMatchups.filter(match => match.homeTeam.numGames > 0 && match.awayTeam.numGames > 0);

            console.log("Checking");
            console.log(teamsGamesPlayed);

            // Sort teams by the number of games played in ascechonding order
            teamsGamesPlayed.sort((a, b) => a.numGames - b.numGames);

            // Prioritize matchups involving teams with the least games played
            let prioritizedMatchups = weekMatchups.filter(match =>
                teamsGamesPlayed.slice(0, 2).some(team => team.teamName === match.homeTeam.teamName || team.teamName === match.awayTeam.teamName)
            );

            for (let i = 0; i < tempSchedule[k].length; i++) {
                teamsGamesPlayed = teamsGamesPlayed.filter(team => team.numGames > 0);
                weekMatchups = weekMatchups.filter(match => match.homeTeam.numGames > 0 && match.awayTeam.numGames > 0);
                seasonMatchups = seasonMatchups.filter(match => match.homeTeam.numGames > 0 && match.awayTeam.numGames > 0);

                let chosenMatch;
                console.log("Priority");
                console.log(prioritizedMatchups);

                // Try to get a prioritized matchup first
                if (prioritizedMatchups.length > 0) {
                    const index = Math.floor(Math.random() * prioritizedMatchups.length);
                    chosenMatch = prioritizedMatchups.splice(index, 1)[0];
                } else {
                    console.log("Cannot prioritize. Reselect");
                    if (weekMatchups.length === 0) {
                        console.log("Loop Season");
                        weekMatchups = matchups.filter(match => match.homeTeam.numGames != 0 && match.awayTeam.numGames != 0);
                    }
                    const index = Math.floor(Math.random() * weekMatchups.length);
                    chosenMatch = weekMatchups.splice(index, 1)[0];
                }

                console.log("Chosen Match");
                while (chosenMatch === undefined) {
                    const index = Math.floor(Math.random() * weekMatchups.length);
                    chosenMatch = weekMatchups.splice(index, 1)[0];
                }
                console.log(chosenMatch);
                weekMatchups = weekMatchups.filter(match =>
                    !(match.homeTeam.teamName == chosenMatch.homeTeam.teamName || match.awayTeam.teamName == chosenMatch.awayTeam.teamName) &&
                    !(match.awayTeam.teamName == chosenMatch.homeTeam.teamName || match.homeTeam.teamName == chosenMatch.awayTeam.teamName)                );
                    prioritizedMatchups = prioritizedMatchups.filter(match =>
                        !(match.homeTeam.teamName == chosenMatch.homeTeam.teamName || match.awayTeam.teamName == chosenMatch.awayTeam.teamName) &&
                        !(match.awayTeam.teamName == chosenMatch.homeTeam.teamName || match.homeTeam.teamName == chosenMatch.awayTeam.teamName)                );
                    // seasonMatchups = seasonMatchups.filter(match =>
                    //     !(match.homeTeam.teamName == chosenMatch.homeTeam.teamName && match.awayTeam.teamName == chosenMatch.awayTeam.teamName) ||
                    //     !(match.awayTeam.teamName == chosenMatch.homeTeam.teamName && match.homeTeam.teamName == chosenMatch.awayTeam.teamName)                );
                        console.log(weekMatchups);
                // Check if the chosen match will result in a team playing twice in the week
                if ((teamsScheduledThisWeek.has(chosenMatch.homeTeam.teamName) || teamsScheduledThisWeek.has(chosenMatch.awayTeam.teamName)) && weekMatchups.length > 2) {
                    // Only allow this if necessary
                    console.log("145 entered");
                    const remainingTeams = teamsGamesPlayed.filter(team => team.numGames > 0 && !teamsScheduledThisWeek.has(team.teamName));
                    if (remainingTeams.length * 2 > tempSchedule[k].length - i) {
                        // There are enough teams to avoid double scheduling
                        i--; // Retry this time slot
                        continue;
                    }
                }

                tempSchedule[k][i].match = chosenMatch;
                teamsScheduledThisWeek.add(chosenMatch.homeTeam.teamName);
                teamsScheduledThisWeek.add(chosenMatch.awayTeam.teamName);

                for (let j = 0; j < teamsGamesPlayed.length; j++) {
                    if (chosenMatch.homeTeam.teamName === teamsGamesPlayed[j].teamName || chosenMatch.awayTeam.teamName === teamsGamesPlayed[j].teamName) {
                        console.log(`200 -- ${teamsGamesPlayed[j].numGames} ${teamsGamesPlayed[j].teamName}`);
                        teamsGamesPlayed[j].numGames--;
                        console.log("teamsGamesPlayed");
                        console.log(teamsGamesPlayed[j].teamName);
                        console.log(teamsGamesPlayed[j].numGames);
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
        }
        return tempSchedule;
    }

    return schedule();
}


function generateExtraSchedule(matchups, scheduleByWeeks, teams, teamsGamesPlayed) {
    const MAX_RETRIES = 1000; // Set a maximum number of retries to avoid infinite loops

    function schedule() {
        const tempSchedule = JSON.parse(JSON.stringify(scheduleByWeeks)); // Create a deep copy of the schedule
        let tempMatchups = [...matchups]; // Create a copy of the matchups array
        const tempTeamsGamesPlayed = JSON.parse(JSON.stringify(teamsGamesPlayed)); // Create a deep copy of the games played array

        for (let k = 0; k < tempSchedule.length; k++) {
            console.log("k value " + k);

            tempTeamsGamesPlayed.forEach(team => {
                if (team.numGames === 0) {
                    console.log("Out of " + team.teamName);
                    for (let i = 0; i < tempMatchups.length; i++) {
                        tempMatchups = tempMatchups.filter(match =>
                            match.homeTeam.teamName !== team.teamName && match.awayTeam.teamName !== team.teamName
                        );
                    }

                    console.log("Remaining matchups");
                    console.log(tempMatchups.length);
                }
            });

            if (tempMatchups.length === 0) {
                console.log("No matchups left to schedule for week " + k);
                return null; // Return null to indicate an invalid schedule
            }

            const index = Math.floor(Math.random() * tempMatchups.length);
            const chosenMatch = tempMatchups[index];
            console.log("Chosen Match");
            console.log(chosenMatch);
            tempSchedule[k].match = chosenMatch;

            for (let i = 0; i < tempTeamsGamesPlayed.length; i++) {
                if (chosenMatch.homeTeam.teamName === tempTeamsGamesPlayed[i].teamName || chosenMatch.awayTeam.teamName === tempTeamsGamesPlayed[i].teamName) {
                    console.log(`299 -- ${tempTeamsGamesPlayed[i].numGames} ${tempTeamsGamesPlayed[i].teamName}`)
                    tempTeamsGamesPlayed[i].numGames--;
                    console.log("teamsGamesPlayed");
                    console.log(tempTeamsGamesPlayed[i].teamName);
                    console.log(tempTeamsGamesPlayed[i].numGames);
                }
            }
        }

        return tempSchedule;
    }

    let retries = 0;
    let result = schedule();

    while (retries < MAX_RETRIES && result === null) {
        result = schedule();
        retries++;
    }

    if (result === null) {
        throw new Error("Unable to generate a valid schedule after maximum retries");
    }

    // Update the number of games played for each team
    for (let i = 0; i < result.length; i++) {
        if (result[i].match) {
            const homeTeam = result[i].match.homeTeam;
            const awayTeam = result[i].match.awayTeam;
            teams.forEach(team => {
                if (team.teamName === homeTeam.teamName || team.teamName === awayTeam.teamName) {
                    team.gamesPlayed++;
                }
            });
        }
    }

    return result;
}





function main(teams, timeSlots, balanceValue, lastWeek) {
    console.log("Main Teams");
    let teamsGamesPlayed: any[] = [...teams];
    let returnedSchedule: any[] = [];
    let teamCopy: Array<{ [key: string]: any; weight: number }> = teams.map(team => ({ ...team, weight: 0 }));
    let numGameValues: number[] = [];
    console.log(teams);
    
    for (let i = 0; i < teams.length; i++) {
        numGameValues.push(teams[i].numGames);
    }
    
    

    console.log(numGameValues);

    timeSlots = timeSlots.filter(ts => !isNaN(Date.parse(ts.date)));
    if (timeSlots[timeSlots.length - 1].week >= teams.length) {
        timeSlots.slice(0, teams.length);
    }

    let matchups = matchupGenerator(teams);

    const numWeek = timeSlots[timeSlots.length - 1].week;

    timeSlots.sort((a, b) => a.week - b.week);

    const scheduleByWeeks:TimeSlot[][] = [];
    const extraWeeks:TimeSlot[] = [];
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
        week.sort((t1: { date: string }, t2: { date: string }) => new Date(t1.date).getTime() - new Date(t2.date).getTime());
    }
    

    let freezeWeeks: number = lastWeek || 0;
let frozenSchedule: Array<Array<any>> = scheduleByWeeks.slice(0, freezeWeeks);
let scheduleToGenerate: Array<any> = scheduleByWeeks.slice(freezeWeeks);

for (let i: number = 0; i < frozenSchedule.length; i++) {
    for (let k: number = 0; k < frozenSchedule[i].length; k++) {
        let timeslot: any = frozenSchedule[i][k];
        if (timeslot.match) {
            let chosenMatch: any = timeslot.match;
            matchups = matchups.filter(match =>
                !(match.homeTeam === chosenMatch.homeTeam && match.awayTeam === chosenMatch.awayTeam) &&
                !(match.homeTeam === chosenMatch.awayTeam && match.awayTeam === chosenMatch.homeTeam)
            );
        }
    }
}

console.log("Frozen Schedule");
console.log(frozenSchedule);
for (let i: number = 0; i < frozenSchedule.length; i++) {
    for (let p: number = 0; p < frozenSchedule[i].length; p++) {
        for (let k: number = 0; k < teams.length; k++) {
            if (frozenSchedule[i][p].match) {
                if (frozenSchedule[i][p].match.homeTeam.teamName === teams[k].teamName || frozenSchedule[i][p].match.awayTeam.teamName === teams[k].teamName) {
                    teams[k].gamesPlayed++;
                }
            }
        }
        for (let m: number = 0; m < teamsGamesPlayed.length; m++) {
            if (frozenSchedule[i][p].match.homeTeam.teamName === teamsGamesPlayed[m].teamName || frozenSchedule[i][p].match.awayTeam.teamName === teamsGamesPlayed[m].teamName) {
                console.log(`419-- ${teamsGamesPlayed[m].numGames} ${teamsGamesPlayed[m].teamName}`);
                teamsGamesPlayed[m].numGames--;
            }
        }
    }
}



let scheduleSections: any[] = [];
console.log(teams.length);
console.log(scheduleToGenerate.length);
if (teams.length <= scheduleToGenerate.length) {
    console.log("Mod Result");
    let numberRepeats: number = Math.floor(scheduleToGenerate.length / teams.length);
    console.log(Math.floor(scheduleToGenerate.length / teams.length));
    let backup: any[] = scheduleToGenerate;
    let start: number = 0;
    let end: number = teams.length - 1;
    for (let i = 0; i < numberRepeats + 2; i++) {
        scheduleToGenerate = backup.slice(start, end);
        scheduleSections.push(scheduleToGenerate);
        start = start + teams.length - 1;
        end = end + teams.length - 1;

        if (end > backup.length) {
            end = backup.length;
        }
    }
    let repeatSchedule: any[] = backup.slice(teams.length - 1);
    console.log(repeatSchedule);
}



    // console.log("Sliced");
    // console.log(repeatSchedule);

    let returnSchedule:any[] = [[]];
    console.log("ScheduleSections");
    console.log(scheduleSections);
for (let i = 0; i < scheduleSections.length; i++) {
    let generated = generateSchedule(matchups, scheduleSections[i], teams, teamsGamesPlayed);
    if (generated === null) {
        throw new Error("Failed to generate schedule for section " + i);
    }
    console.log("Generated Schedule");
    console.log(generated.length);
    for(let i = 0; i < generated.length; i++)
    {
        for (let p = 0; p < generated[i].length; p++) {
            console.log(generated[i][p]);
            // console.log("Corresponding Match");
            // console.log(generated[i][p]).match;
        }
    }
   // console.log(generated);
    returnSchedule[0].push(...generated);
    console.log("Pushed Schedule");
    for (let i = 0; i < returnSchedule[0].length; i++) {
        for (let p = 0; p < returnSchedule[0][p].length; p++) {
            // console.log("Week "+(returnSchedule[0][p][i].week+i));
            // console.log(returnSchedule[0][p][i].match);
            console.log(returnSchedule[0][i][p]);
        }

    }
}

// Output the result
console.log("Final returnSchedule");
console.log(returnSchedule);


    
    console.log("Entering");
    // for (let p = 0; p < returnSchedule.length; p++)
    //     for (let x = 0; x < returnSchedule[p].length; x++) {
    //         for(let m = 0; m < returnSchedule[p][x].length; m++)
    //         {
    //             console.log(returnSchedule[p][x][m].week);
    //             console.log(returnSchedule[p][x][m].match);
    //         }
    //     }

    console.log(teamsGamesPlayed);

    let goodSchedule = false;
    let balancedSchedule = false;
    let dupeTeam = true;

    let printOne = false;

    // while (!goodSchedule || !balancedSchedule || dupeTeam) {
    //     let returnSchedule = [[]];  // Initialize returnSchedule with an empty array as its first element
    //     // console.log("Reprint");

    //     for (let i = 0; i < scheduleSections.length; i++) {
    //         let generated = generateSchedule(matchups, scheduleSections[i], teams, teamsGamesPlayed);
    //         // Append each generated schedule to the first element in returnSchedule
    //         returnSchedule[0].push(...generated);
    //         for (let p = 0; p < teamsGamesPlayed.length; p++) {
    //             //   console.log(`512-- ${teamsGamesPlayed[p].numGames} ${teamsGamesPlayed[p].teamName}`)

    //         }
    //         // Update the original teamsGamesPlayed with the changes from the generated schedule
    //         for (let k = 0; k < teamsGamesPlayed.length; k++) {
    //             //   console.log(`515 -- generated.length ${generated.length} `)
    //             for (let j = 0; j < generated.length; j++) {
    //                 //      console.log(`521 match ${generated[j].match}`)
    //                 if (generated[j].match) {
    //                     const homeTeam = generated[j].match.homeTeam.teamName;
    //                     const awayTeam = generated[j].match.awayTeam.teamName;
    //                     //      console.log(`525 ${teamsGamesPlayed[k].teamName} ${homeTeam} ${awayTeam }`)
    //                     if (teamsGamesPlayed[k].teamName === homeTeam || teamsGamesPlayed[k].teamName === awayTeam) {
    //                         //         console.log(`520-- ${tempTeamsGamesPlayed[k].numGames} ${tempTeamsGamesPlayed[k].teamName}`)
    //                         teamsGamesPlayed[k].numGames--;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     if (printOne == false) {
    //         console.log("First Time");
    //         console.log(returnSchedule[0][returnSchedule[0].length - 1].match);
    //         printOne = true;

    //     }

    //     returnedSchedule = returnSchedule[0];

    //     //console.log(returnSchedule.length);
    //     goodSchedule = returnedSchedule.every(week => week.every(ts => ts.match != null));

    //     if (goodSchedule) {
    //         balancedSchedule = true;
    //         teamCopy.forEach(team => team.weight = 0);

    //         returnedSchedule.forEach(week => {
    //             week.forEach(ts => {
    //                 teamCopy.forEach(team => {
    //                     if (team.teamName === ts.match.homeTeam.teamName || team.teamName === ts.match.awayTeam.teamName) {
    //                         team.weight += ts.weight;
    //                     }
    //                 });
    //             });
    //         });

    //         let weights = teamCopy.map(team => team.weight / returnedSchedule.length);
    //         // console.log("Weights");
    //         // console.log(weights);


    //         teams.map((team, index) => {
    //             return {
    //                 ...team,
    //                 assignedWeight: weights[index]
    //             };
    //         });

    //         for (let i = 0; i < weights.length; i++) {
    //             teams[i].weight = weights[i];
    //         }



    //         // console.log("Teams with assigned weights");
    //         // console.log(teams);

    //         let minWeight = Math.min(...weights);
    //         let maxWeight = Math.max(...weights);

    //         balancedSchedule = (maxWeight - minWeight <= 0.7);

    //         if (balancedSchedule) {
    //             dupeTeam = false;

    //             for (let week of returnedSchedule) {
    //                 let teamsInWeek = new Set();
    //                 for (let ts of week) {
    //                     if (teamsInWeek.has(ts.match.homeTeam.teamName) || teamsInWeek.has(ts.match.awayTeam.teamName)) {
    //                         dupeTeam = true;
    //                         break;
    //                     }
    //                     teamsInWeek.add(ts.match.homeTeam.teamName);
    //                     teamsInWeek.add(ts.match.awayTeam.teamName);
    //                 }
    //                 if (dupeTeam) break;
    //             }
    //         }
    //     }
    // }

    console.log("Freeze");
    console.log(freezeWeeks);
    if (freezeWeeks > 0) {


        for (let k = freezeWeeks; k < scheduleByWeeks.length; k++) {

            for (let i = 0; i < scheduleByWeeks[k].length; i++) {

                const chosenMatch:any = scheduleByWeeks[k][i].match;

                for (let p = 0; p < teamsGamesPlayed.length; p++) {
                    if (chosenMatch.homeTeam.teamName == teamsGamesPlayed[p].teamName || chosenMatch.awayTeam.teamName == teamsGamesPlayed[p].teamName) {
                        console.log(`611-- ${teamsGamesPlayed[p].numGames} ${teamsGamesPlayed[p].teamName}`)
                        //teamsGamesPlayed[p].numGames--;
                    }
                }
            }
        }
    }

    console.log("Before freeze");
    console.log(teamsGamesPlayed);



    teams.forEach(team => team.gamesPlayed = 0);

    let finalSchedule = frozenSchedule.concat(returnSchedule[0]);
    console.log("658 Concat");
    console.log(frozenSchedule);
    console.log(returnSchedule[0]);
    
    console.log(finalSchedule);


    let leftoverMatchupsArray:any[] = [];
    for (let i = 0; i < scheduleByWeeks.length; i++) {
        leftoverMatchupsArray.push(matchups);
    }
    // console.log(leftoverMatchupsArray);
    console.log("Sorted Array");

    // console.log("Initial leftoverMatchups:", leftoverMatchups.map(m => `${m.homeTeam.teamName} vs ${m.awayTeam.teamName}`));

    for (let i = 0; i < finalSchedule.length; i++) {
        for (let k = 0; k < finalSchedule[i].length; k++) {
            let chosenMatch = finalSchedule[i][k].match;
            if (chosenMatch) {
                //console.log("Chosen Match:", `${chosenMatch.homeTeam.teamName} vs ${chosenMatch.awayTeam.teamName}`);



                leftoverMatchupsArray[i] = leftoverMatchupsArray[i].filter(match =>
                    !(
                        (match.homeTeam.teamName === chosenMatch.homeTeam.teamName && match.awayTeam.teamName === chosenMatch.awayTeam.teamName) ||
                        (match.homeTeam.teamName === chosenMatch.awayTeam.teamName && match.awayTeam.teamName === chosenMatch.homeTeam.teamName)
                    )
                );

                // console.log("Week "+(i+1));
                // console.log(leftoverMatchupsArray[i]);


                // console.log("Updated leftoverMatchups:", leftoverMatchups.map(m => `${m.homeTeam.teamName} vs ${m.awayTeam.teamName}`));
            }

        }
    }
    


    
    
    let extraSchedule = generateExtraSchedule(matchups, extraWeeks, teams, teamsGamesPlayed);
    console.log("Bonus Games");
    
    for (let extraWeek of extraSchedule) {
        let weekNumber = extraWeek.week - 1;  // Adjusting week index (assuming week is 1-based)
        if (!finalSchedule[weekNumber]) {
            finalSchedule[weekNumber] = [];
        }
        finalSchedule[weekNumber] = finalSchedule[weekNumber].concat(extraWeek);
        finalSchedule[weekNumber].sort((a, b) => (a.date) - (b.date));
    }

    console.log("Final");
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
    console.log(finalSchedule)
    return finalSchedule;
}



export {main};