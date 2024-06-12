const { Team, TimeSlot, PlayingLocation, main } = require('./newAlgorithm');

// Create teams
const teams = [
    new Team("Team 1", "Elite"),
    new Team("Team 2", "A"),
    new Team("Team 3", "B"),
    new Team("Team 4", "A"),
    new Team("Team 5", "A"),
    new Team("Team 6", "A"),
    new Team("Team 7", "A"),
    new Team("Team 8", "A"),
];

// Create time slots
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
    new TimeSlot("2024-07-07 22:00:00", 7, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
];

// Run the main function
const schedule = main(teams, timeSlots);

// Print the schedule
for (const week of schedule) {
    for (const slot of week) {
        console.log(slot.toString());
    }
    console.log();
}
