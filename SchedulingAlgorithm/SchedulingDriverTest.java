package SchedulingAlgorithm;

import java.util.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class SchedulingDriverTest {

    public static void main(String[] args) throws ParseException {
        Calendar calendar = Calendar.getInstance();

        List<Team> teams = Arrays.asList(
            new Team("Team 1", "Elite"), 
            new Team("Team 2", "A"), 
            new Team("Team 3", "B"),
            new Team("Team 4", "A"), 
            new Team("Team 5", "A"), 
            new Team("Team 6", "A"),
            new Team("Team 7", "A"), 
            new Team("Team 8", "A")
        );
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        List<TimeSlot> timeSlots = Arrays.asList(
            new TimeSlot(sdf.parse("2024-05-12 18:00:00"), calendar, 1,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    new TimeSlot(sdf.parse("2024-05-12 19:00:00"), calendar, 1,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    new TimeSlot(sdf.parse("2024-05-12 20:00:00"), calendar, 1,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    new TimeSlot(sdf.parse("2024-05-12 21:00:00"), calendar, 1,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    new TimeSlot(sdf.parse("2024-05-26 17:00:00"), calendar, 2,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    new TimeSlot(sdf.parse("2024-05-26 18:00:00"), calendar, 2,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    new TimeSlot(sdf.parse("2024-05-26 19:00:00"), calendar, 2,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    new TimeSlot(sdf.parse("2024-05-26 20:00:00"), calendar, 2,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    new TimeSlot(sdf.parse("2024-06-02 16:00:00"), calendar, 3,
                            new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false), 0),
                    new TimeSlot(sdf.parse("2024-06-02 18:00:00"), calendar, 3,
                            new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false), 0),
                    new TimeSlot(sdf.parse("2024-06-02 19:00:00"), calendar, 3,
                            new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false), 0),
                    new TimeSlot(sdf.parse("2024-06-02 20:00:00"), calendar, 3,
                            new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false), 0)
        );
        List<List<TimeSlot>> scheduleByWeeks = createWeeklySchedule(timeSlots);
        List<Match> matches = generateRoundRobinMatches(teams);

        List<List<TimeSlot>> balancedSchedule = generateBalancedSchedule(matches, scheduleByWeeks, teams);
        printSchedule(balancedSchedule);
    }


    public static List<List<TimeSlot>> createWeeklySchedule(List<TimeSlot> timeSlots) {
        List<List<TimeSlot>> scheduleByWeeks = new ArrayList<>();
        for (int i = 0; i < timeSlots.get(timeSlots.size() - 1).getWeek(); i++) {
            scheduleByWeeks.add(new ArrayList<>());
        }
        for (TimeSlot slot : timeSlots) {
            scheduleByWeeks.get(slot.getWeek() - 1).add(slot);
        }
        return scheduleByWeeks;
    }

    public static List<Match> generateRoundRobinMatches(List<Team> teams) {
        List<Match> matchups = new ArrayList<>();
        int numTeams = teams.size();
        boolean hasBye = numTeams % 2 != 0;

        if (hasBye) teams.add(new Team("BYE", "N/A"));

        numTeams = teams.size();
        int numRounds = numTeams - 1;
        int halfSize = numTeams / 2;

        List<Team> teamsList = new ArrayList<>(teams);
        teamsList.remove(0);

        int teamsSize = teamsList.size();
        for (int round = 0; round < numRounds; round++) {
            List<Match> roundMatches = new ArrayList<>();
            int teamIdx = round % teamsSize;
            roundMatches.add(new Match(teams.get(0), teamsList.get(teamIdx)));

            for (int i = 1; i < halfSize; i++) {
                int firstTeam = (round + i) % teamsSize;
                int secondTeam = (round + teamsSize - i) % teamsSize;
                roundMatches.add(new Match(teamsList.get(firstTeam), teamsList.get(secondTeam)));
            }
            matchups.addAll(roundMatches);
        }
        if (hasBye) teams.remove(teams.size() - 1);

        return matchups;
    }

    public static List<List<TimeSlot>> generateBalancedSchedule(List<Match> matchups, List<List<TimeSlot>> scheduleByWeeks, List<Team> teams) {
        int numWeeks = scheduleByWeeks.size();
        List<List<TimeSlot>> finalSchedule = new ArrayList<>(scheduleByWeeks);

        // Determine thresholds for early, mid, and late times based on timeslot distribution
        List<Integer> hours = new ArrayList<>();
        for (TimeSlot slot : scheduleByWeeks.get(0)) {
            hours.add(slot.getStartTime());
        }
        Collections.sort(hours);

        int third = hours.size() / 3;
        int earlyThreshold = hours.get(third);
        int lateThreshold = hours.get(hours.size() - third - 1);

        // Track timeslot distribution for each team
        Map<String, Integer> earlyGames = new HashMap<>();
        Map<String, Integer> midGames = new HashMap<>();
        Map<String, Integer> lateGames = new HashMap<>();
        for (Team team : teams) {
            earlyGames.put(team.getTeamName(), 0);
            midGames.put(team.getTeamName(), 0);
            lateGames.put(team.getTeamName(), 0);
        }

        for (int week = 0; week < numWeeks; week++) {
            List<TimeSlot> weekSchedule = new ArrayList<>(finalSchedule.get(week));
            List<Match> availableMatches = new ArrayList<>(matchups);
            boolean weekIsBalanced = false;

            while (!weekIsBalanced) {
                Collections.shuffle(availableMatches);
                weekIsBalanced = true;
                Set<Team> scheduledTeams = new HashSet<>();

                for (TimeSlot slot : weekSchedule) {
                    if (availableMatches.isEmpty()) break;
                    Match match = availableMatches.remove(0);

                    if (scheduledTeams.contains(match.getHomeTeam()) || scheduledTeams.contains(match.getAwayTeam())) {
                        weekIsBalanced = false;
                        break;
                    }

                    // Check timeslot distribution balance
                    boolean validSlot = true;
                    int hour = slot.getStartTime();
                    if (hour <= earlyThreshold) {
                        if (earlyGames.get(match.getHomeTeam().getTeamName()) > numWeeks / 3 || earlyGames.get(match.getAwayTeam().getTeamName()) > numWeeks / 3) {
                            validSlot = false;
                        }
                    } else if (hour >= lateThreshold) {
                        if (lateGames.get(match.getHomeTeam().getTeamName()) > numWeeks / 3 || lateGames.get(match.getAwayTeam().getTeamName()) > numWeeks / 3) {
                            validSlot = false;
                        }
                    } else {
                        if (midGames.get(match.getHomeTeam().getTeamName()) > numWeeks / 3 || midGames.get(match.getAwayTeam().getTeamName()) > numWeeks / 3) {
                            validSlot = false;
                        }
                    }

                    if (!validSlot) {
                        weekIsBalanced = false;
                        break;
                    }

                    scheduledTeams.add(match.getHomeTeam());
                    scheduledTeams.add(match.getAwayTeam());
                    slot.setMatch(match);

                    // Update timeslot distribution
                    if (hour <= earlyThreshold) {
                        earlyGames.put(match.getHomeTeam().getTeamName(), earlyGames.get(match.getHomeTeam().getTeamName()) + 1);
                        earlyGames.put(match.getAwayTeam().getTeamName(), earlyGames.get(match.getAwayTeam().getTeamName()) + 1);
                    } else if (hour >= lateThreshold) {
                        lateGames.put(match.getHomeTeam().getTeamName(), lateGames.get(match.getHomeTeam().getTeamName()) + 1);
                        lateGames.put(match.getAwayTeam().getTeamName(), lateGames.get(match.getAwayTeam().getTeamName()) + 1);
                    } else {
                        midGames.put(match.getHomeTeam().getTeamName(), midGames.get(match.getHomeTeam().getTeamName()) + 1);
                        midGames.put(match.getAwayTeam().getTeamName(), midGames.get(match.getAwayTeam().getTeamName()) + 1);
                    }
                }
            }
        }

        return finalSchedule;
    }

    public static void printSchedule(List<List<TimeSlot>> schedule) {
        for (int week = 0; week < schedule.size(); week++) {
            System.out.println("Week " + (week + 1) + ":");
            for (TimeSlot slot : schedule.get(week)) {
                System.out.println(slot);
            }
        }
    }
}






