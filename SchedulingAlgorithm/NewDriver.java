package SchedulingAlgorithm;

import java.util.*;
import java.lang.reflect.Array;
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class NewDriver {

    public static ArrayList<Match> roundRobinMatchGenerator(ArrayList<Team> teams) {
        ArrayList<Match> matchups = new ArrayList<Match>();
        int numTeams = teams.size();
        boolean evenTeams = numTeams % 2 == 0;
        if (!evenTeams) {
            teams.add(new Team("Bye", "None"));
            numTeams++;
        }

        for (int round = 0; round < numTeams - 1; round++) {
            for (int i = 0; i < numTeams / 2; i++) {
                Team home = teams.get(i);
                Team away = teams.get(numTeams - 1 - i);
                if (!home.getTeamName().equals("Bye") && !away.getTeamName().equals("Bye")) {
                    matchups.add(new Match(home, away));
                }
            }
            // Rotate teams
            teams.add(1, teams.remove(teams.size() - 1));
        }
        return matchups;
    }

    public static List<List<TimeSlot>> generateSchedule(ArrayList<Match> matchups, List<List<TimeSlot>> scheduleByWeeks,
            ArrayList<Team> teams) {
        ArrayList<Match> seasonMatchups = new ArrayList<>(matchups);
        for (int k = 0; k < scheduleByWeeks.size(); k++) {
            ArrayList<Match> weekMatchups = new ArrayList<>(seasonMatchups);
            ArrayList<Team> teamCopy = new ArrayList<>(teams);
            for (int i = 0; i < scheduleByWeeks.get(k).size(); i++) {
                if (weekMatchups.isEmpty()) {
                    return scheduleByWeeks;
                }
                int index = (int) (Math.random() * weekMatchups.size());
                Match chosenMatch = weekMatchups.get(index);
                scheduleByWeeks.get(k).get(i).setMatch(chosenMatch);
                teams.removeIf(
                        team -> team.equals(chosenMatch.getAwayTeam()) || team.equals(chosenMatch.getHomeTeam()));
                weekMatchups.removeIf(match -> match.getAwayTeam().equals(chosenMatch.getAwayTeam()) ||
                        match.getAwayTeam().equals(chosenMatch.getHomeTeam()) ||
                        match.getHomeTeam().equals(chosenMatch.getAwayTeam()) ||
                        match.getHomeTeam().equals(chosenMatch.getHomeTeam()));
                seasonMatchups.removeIf(match -> (match.getHomeTeam().equals(chosenMatch.getHomeTeam()) &&
                        match.getAwayTeam().equals(chosenMatch.getAwayTeam())) ||
                        (match.getHomeTeam().equals(chosenMatch.getAwayTeam()) &&
                                match.getAwayTeam().equals(chosenMatch.getHomeTeam())));
            }
            teams = new ArrayList<>(teamCopy);
        }
        return scheduleByWeeks;
    }

    public static boolean isScheduleBalanced(List<List<TimeSlot>> schedule, ArrayList<Team> teams) {
        Map<String, Integer> teamWeights = new HashMap<>();
        for (Team team : teams) {
            teamWeights.put(team.getTeamName(), 0);
        }

        for (List<TimeSlot> week : schedule) {
            for (TimeSlot slot : week) {
                Match match = slot.getMatch();
                if (match != null) {
                    teamWeights.put(match.getHomeTeam().getTeamName(),
                            teamWeights.get(match.getHomeTeam().getTeamName()) + slot.getWeight());
                    teamWeights.put(match.getAwayTeam().getTeamName(),
                            teamWeights.get(match.getAwayTeam().getTeamName()) + slot.getWeight());
                }
            }
        }

        int totalWeight = teamWeights.values().stream().mapToInt(Integer::intValue).sum();
        double avgWeight = (double) totalWeight / teams.size();
        double maxDeviation = avgWeight * 0.15;

        for (int weight : teamWeights.values()) {
            if (Math.abs(weight - avgWeight) > maxDeviation) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        Calendar calendar = Calendar.getInstance();
        ArrayList<Team> teams = new ArrayList<>();
        teams.add(new Team("Team 1", "Elite"));
        teams.add(new Team("Team 2", "A"));
        teams.add(new Team("Team 3", "B"));
        teams.add(new Team("Team 4", "A"));
        // teams.add(new Team("Team 5", "A"));
        // teams.add(new Team("Team 6", "A"));
        // teams.add(new Team("Team 7", "A"));
        // teams.add(new Team("Team 8", "A"));

        ArrayList<Match> matchups = roundRobinMatchGenerator(teams);
        List<List<TimeSlot>> scheduleByWeeks = null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            TimeSlot[] timeSlots = new TimeSlot[]{
                    new TimeSlot(sdf.parse("2024-05-12 18:00:00"), calendar, 1, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    new TimeSlot(sdf.parse("2024-05-12 19:00:00"), calendar, 1, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    //new TimeSlot(sdf.parse("2024-05-12 20:00:00"), calendar, 1, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    //new TimeSlot(sdf.parse("2024-05-12 21:00:00"), calendar, 1, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    new TimeSlot(sdf.parse("2024-05-26 17:00:00"), calendar, 2, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    new TimeSlot(sdf.parse("2024-05-26 18:00:00"), calendar, 2, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    //new TimeSlot(sdf.parse("2024-05-26 19:00:00"), calendar, 2, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    //new TimeSlot(sdf.parse("2024-05-26 20:00:00"), calendar, 2, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-02 16:00:00"), calendar, 3, new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-02 18:00:00"), calendar, 3, new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-02 19:00:00"), calendar, 3, new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-02 20:00:00"), calendar, 3, new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false), 0),
                    // new TimeSlot(sdf.parse("2024-07-09 17:00:00"), calendar, 4, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-09 18:00:00"), calendar, 4, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-09 19:00:00"), calendar, 4, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-09 20:00:00"), calendar, 4, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-16 17:00:00"), calendar, 5, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-16 18:00:00"), calendar, 5, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-16 19:00:00"), calendar, 5, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-16 20:00:00"), calendar, 5, new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-23 17:00:00"), calendar, 6, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-23 18:00:00"), calendar, 6, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-23 19:00:00"), calendar, 6, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    // new TimeSlot(sdf.parse("2024-06-23 20:00:00"), calendar, 6, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    // new TimeSlot(sdf.parse("2024-07-07 19:00:00"), calendar, 7, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    // new TimeSlot(sdf.parse("2024-07-07 20:00:00"), calendar, 7, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    // new TimeSlot(sdf.parse("2024-07-07 21:00:00"), calendar, 7, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
                    // new TimeSlot(sdf.parse("2024-07-07 22:00:00"), calendar, 7, new PlayingLocation("Allandale Recreation Centre", "Red Rink", false), 0),
            };

            scheduleByWeeks = new ArrayList<>();
            for (int i = 0; i < timeSlots[timeSlots.length - 1].getWeek(); i++) {
                scheduleByWeeks.add(new ArrayList<>());
            }
            for (TimeSlot timeSlot : timeSlots) {
                scheduleByWeeks.get(timeSlot.getWeek() - 1).add(timeSlot);
            }

            for (List<TimeSlot> week : scheduleByWeeks) {
                week.sort(Comparator.comparing(TimeSlot::getDate));
                for (int j = 0; j < week.size(); j++) {
                    week.get(j).setWeight(j);
                }
            }

        } catch (ParseException e) {
            e.printStackTrace();
        }

        List<List<TimeSlot>> returnSchedule;
        do {
            returnSchedule = generateSchedule(matchups, scheduleByWeeks, teams);
        } while (!isScheduleBalanced(returnSchedule, teams));

        for (List<TimeSlot> week : returnSchedule) {
            for (TimeSlot slot : week) {
                System.out.println(slot.toString());
            }
            System.out.println();
        }
    }
}

