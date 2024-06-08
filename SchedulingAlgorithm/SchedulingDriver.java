package SchedulingAlgorithm;

import java.util.*;
import java.lang.reflect.Array;
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class SchedulingDriver {

    public static ArrayList<Match> matchupGenerator(ArrayList<Team> teams) {
        ArrayList<Match> matchups = new ArrayList<Match>();
        for (int i = 0; i < teams.size(); i++) {
            Team homeTeam = teams.get(i);
            for (int j = 0; j < teams.size(); j++) {
                if (i != j) {
                    Team awayTeam = teams.get(j);
                    matchups.add(new Match(homeTeam, awayTeam));
                }

            }
        }
        return matchups;
    }

    /*
     
     */
    public static List<List<TimeSlot>> generateSchedule(ArrayList<Match> matchups, List<List<TimeSlot>> scheduleByWeeks,
            ArrayList<Team> teams) {
        ArrayList<Match> seasonMatchups = (ArrayList<Match>) matchups.clone();
        for (int k = 0; k < scheduleByWeeks.size(); k++) {
            ArrayList<Match> weekMatchups = (ArrayList<Match>) seasonMatchups.clone();
            ArrayList<Team> teamCopy = (ArrayList<Team>) teams.clone();
            for (int i = 0; i < scheduleByWeeks.get(k).size(); i++) {

                int index = (int) (Math.random() * (weekMatchups.size()));
                if (weekMatchups.size() == 0) {
                    return scheduleByWeeks;
                }
                Match chosenMatch = weekMatchups.get(index);
                scheduleByWeeks.get(k).get(i).setMatch(chosenMatch);
                teams.removeIf(
                        team -> team.equals(chosenMatch.getAwayTeam()) || team.equals(chosenMatch.getHomeTeam()));
                weekMatchups.removeIf(match -> match.getAwayTeam().equals(chosenMatch.getAwayTeam()) ||
                        match.getAwayTeam().equals(chosenMatch.getHomeTeam()) ||
                        match.getHomeTeam().equals(chosenMatch.getAwayTeam()) ||
                        match.getHomeTeam().equals(chosenMatch.getHomeTeam()));

                for (int j = 0; j < seasonMatchups.size(); j++) {
                    if ((seasonMatchups.get(j).getHomeTeam().equals(chosenMatch.getHomeTeam()) &&
                            seasonMatchups.get(j).getAwayTeam().equals(chosenMatch.getAwayTeam()))
                            || (seasonMatchups.get(j).getHomeTeam().equals(chosenMatch.getAwayTeam()) &&
                                    seasonMatchups.get(j).getAwayTeam().equals(chosenMatch.getHomeTeam()))) {
                        seasonMatchups.remove(j);
                    }
                }
            }
            teams = (ArrayList<Team>) teamCopy.clone();
        }
        return scheduleByWeeks;
    }

    public static void main(String[] args) {
        Calendar calendar = Calendar.getInstance();
        Scanner scanner = new Scanner(System.in);
        // System.out.print("Enter the number of teams: ");
        // int numTeams = scanner.nextInt();
        // scanner.nextLine();
        // ArrayList<Team> teams = new ArrayList<Team>();
        ArrayList<Team> teams = new ArrayList<Team>();
        ;
        teams.add(new Team("Team 1", "Elite")); // 1 v 6
        teams.add(new Team("Team 2", "A"));

        teams.add(new Team("Team 3", "B")); // 2 v 4
        teams.add(new Team("Team 4", "A"));

        teams.add(new Team("Team 5", "A")); // 3 v 5
        teams.add(new Team("Team 6", "A"));

        teams.add(new Team("Team 7", "A"));
        teams.add(new Team("Team 8", "A"));
        //teams.add(new Team("Team 9", "A"));
        ArrayList<Team> teamCopy = (ArrayList<Team>) teams.clone();
        /*
         * for(int i = 0; i < numTeams; i++)
         * {
         * System.out.print("Enter team "+(i+1)+" name: ");
         * String name = scanner.nextLine();
         * System.out.print("Enter team "+ (i+1) + " skill level (Elite,A,B,C): ");
         * String skillLevel = scanner.nextLine();
         * teams.add(new Team(name,skillLevel));
         * }
         */
        ArrayList<Match> matchups = matchupGenerator(teams);
        for (int i = 0; i < matchups.size(); i++) {
            // System.out.println((matchups.get(i)).toString());
        }

        TimeSlot[] timeSlots = null;
        List<List<TimeSlot>> scheduleByWeeks = null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            timeSlots = new TimeSlot[] {
                  
                new TimeSlot(sdf.parse("2024-05-12 18:00:00"), calendar, 1,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
                    new TimeSlot(sdf.parse("2024-05-12 19:00:00"), calendar, 1,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
                    new TimeSlot(sdf.parse("2024-05-12 20:00:00"), calendar, 1,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
                    new TimeSlot(sdf.parse("2024-05-12 21:00:00"), calendar, 1,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
                    new TimeSlot(sdf.parse("2024-05-26 17:00:00"), calendar, 2,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
                    new TimeSlot(sdf.parse("2024-05-26 18:00:00"), calendar, 2,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
                    new TimeSlot(sdf.parse("2024-05-26 19:00:00"), calendar, 2,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
                    new TimeSlot(sdf.parse("2024-05-26 20:00:00"), calendar, 2,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
                    new TimeSlot(sdf.parse("2024-06-02 16:00:00"), calendar, 3,
                            new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false)),
                    new TimeSlot(sdf.parse("2024-06-02 18:00:00"), calendar, 3,
                            new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false)),
                    new TimeSlot(sdf.parse("2024-06-02 19:00:00"), calendar, 3,
                            new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false)),
                    new TimeSlot(sdf.parse("2024-06-02 20:00:00"), calendar, 3,
                            new PlayingLocation("Allandale Recreation Centre", "Blue Rink", false)),
                    new TimeSlot(sdf.parse("2024-07-09 17:00:00"), calendar, 4,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
                    new TimeSlot(sdf.parse("2024-06-09 18:00:00"), calendar, 4,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
                    new TimeSlot(sdf.parse("2024-06-09 19:00:00"), calendar, 4,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
                    new TimeSlot(sdf.parse("2024-06-09 20:00:00"), calendar, 4,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
                    new TimeSlot(sdf.parse("2024-06-16 17:00:00"), calendar, 5,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
                    new TimeSlot(sdf.parse("2024-06-16 18:00:00"), calendar, 5,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
                    new TimeSlot(sdf.parse("2024-06-16 19:00:00"), calendar, 5,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
                    new TimeSlot(sdf.parse("2024-06-16 20:00:00"), calendar, 5,
                            new PlayingLocation("Centre Ice Sportsplex", "Rink 1", false)),
                    new TimeSlot(sdf.parse("2024-06-23 17:00:00"), calendar, 6,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
                    new TimeSlot(sdf.parse("2024-06-23 18:00:00"), calendar, 6,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
                    new TimeSlot(sdf.parse("2024-06-23 19:00:00"), calendar, 6,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
                    new TimeSlot(sdf.parse("2024-06-23 20:00:00"), calendar, 6,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
                    new TimeSlot(sdf.parse("2024-07-07 19:00:00"), calendar, 7,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
                    new TimeSlot(sdf.parse("2024-07-07 20:00:00"), calendar, 7,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
                    new TimeSlot(sdf.parse("2024-07-07 21:00:00"), calendar, 7,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
                    new TimeSlot(sdf.parse("2024-07-07 22:00:00"), calendar, 7,
                            new PlayingLocation("Allandale Recreation Centre", "Red Rink", false)),
            };

            for (int i = 0; i < timeSlots.length; i++) {
                Calendar cal = Calendar.getInstance();
                cal.setTime(timeSlots[i].getDate());
                // System.out.println(cal.get(Calendar.HOUR_OF_DAY));
            }

            scheduleByWeeks = new ArrayList<List<TimeSlot>>();
            for (int i = 0; i < timeSlots[timeSlots.length - 1].getWeek(); i++) {
                scheduleByWeeks.add(new ArrayList<TimeSlot>());
            }
            for (int j = 0; j < timeSlots.length; j++) {
                scheduleByWeeks.get(timeSlots[j].getWeek() - 1).add(timeSlots[j]);
            }

            for (int i = 0; i < scheduleByWeeks.size(); i++) {
                Collections.sort(scheduleByWeeks.get(i), new Comparator<TimeSlot>() {
                    @Override
                    public int compare(TimeSlot t1, TimeSlot t2) {
                        Calendar cal = Calendar.getInstance();
                        cal.setTime(t1.getDate());
                        int t1Time = cal.get(Calendar.HOUR_OF_DAY);
                        cal.setTime(t2.getDate());
                        int t2Time = cal.get(Calendar.HOUR_OF_DAY);

                        if (t1Time > t2Time) {
                            return 1;
                        } else if (t1Time < t2Time) {
                            return -1;
                        }
                        return 0;
                    }
                });
                for (int j = 0; j < scheduleByWeeks.get(i).size(); j++) {
                    scheduleByWeeks.get(i).get(j).setWeight(j);
                }
            }

        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        List<List<TimeSlot>> returnSchedule = generateSchedule(matchups, scheduleByWeeks, teams);

        
        int num = 0;
        boolean goodSchedule = false;
        boolean balancedSchedule = false;
        boolean dupeTeam = true;
        ArrayList<Double> weightsCopy = new ArrayList<>();

       
            while (goodSchedule == false || balancedSchedule == false || dupeTeam) {
                // Reset flags and variables
                goodSchedule = true;
                balancedSchedule = false;
                dupeTeam = false;
            
                // Check if the schedule is fully filled
                for (int k = 0; k < returnSchedule.size(); k++) {
                    for (int i = 0; i < returnSchedule.get(k).size(); i++) {
                        if (returnSchedule.get(k).get(i).getMatch() == null) {
                            returnSchedule = generateSchedule(matchups, scheduleByWeeks, teams);
                            num += 1;
                            goodSchedule = false;
                            break;
                        }
                    }
                    if (!goodSchedule) {
                        break;
                    }
                }
            
                if (goodSchedule) {
                    // Update team schedule weights
                    for (int k = 0; k < returnSchedule.size(); k++) {
                        for (int i = 0; i < returnSchedule.get(k).size(); i++) {
                            for (int p = 0; p < teamCopy.size(); p++) {
                                if (teamCopy.get(p).getTeamName().equals(returnSchedule.get(k).get(i).getMatch().getHomeTeam().getTeamName()) || 
                                    teamCopy.get(p).getTeamName().equals(returnSchedule.get(k).get(i).getMatch().getAwayTeam().getTeamName())) {
                                    teamCopy.get(p).setScheduleWeight(returnSchedule.get(k).get(i).getWeight());
                                }
                            }
                        }
                    }
            
                    // Check if the schedule is balanced
                    ArrayList<Double> weights = new ArrayList<>();
                    for (int r = 0; r < teamCopy.size(); r++) {
                        weights.add(((double) teamCopy.get(r).getScheduleWeight()) / returnSchedule.size());
                       // System.out.println("Double: "+teamCopy.get(r).getScheduleWeight());
                        //System.out.println("Size: "+returnSchedule.size());
                       // System.out.println(((double) teamCopy.get(r).getScheduleWeight()) / returnSchedule.size());
                        num += 1;
                    }
                    double minWeight = weights.get(0);
                    double maxWeight = weights.get(0);
                    for (int l = 1; l < weights.size(); l++) {
                        if (weights.get(l) < minWeight) {
                            minWeight = weights.get(l);
                        }
                        if (weights.get(l) > maxWeight) {
                            maxWeight = weights.get(l);
                        }
                    }
            
                    if (maxWeight - minWeight > 0.15) {
                        for (int a = 0; a < teamCopy.size(); a++) {
                            teamCopy.get(a).resetScheduleWeight();
                        }
                        returnSchedule = generateSchedule(matchups, scheduleByWeeks, teams);
                    } else {
                        balancedSchedule = true;
                        weightsCopy = weights;
                        for(int i = 0; i < weights.size(); i++)
                        {
                           // System.out.println(weights.get(i));
                        }
                    }
                }
            
                if (goodSchedule && balancedSchedule) {

                    // Check for duplicate teams
                    for (int k = 0; k < returnSchedule.size(); k++) {
                        ArrayList<String> teamsCopy = new ArrayList<>();
                        for (int i = 0; i < returnSchedule.get(k).size(); i++) {
                            teamsCopy.add(returnSchedule.get(k).get(i).getMatch().getAwayTeam().getTeamName());
                            teamsCopy.add(returnSchedule.get(k).get(i).getMatch().getHomeTeam().getTeamName());
                        }
                        Set<String> s = new HashSet<>();
                        for (String teamName : teamsCopy) {
                            if (!s.add(teamName)) {
                                dupeTeam = true;
                                break;
                            }
                        }
                        if (dupeTeam) {
                            returnSchedule = generateSchedule(matchups, scheduleByWeeks, teams);
                            goodSchedule = false;
                            balancedSchedule = false;
                            break;
                        }
                    }
                }
            }        

           for (int k = 0; k < returnSchedule.size(); k++) {
            for (int i = 0; i < returnSchedule.get(k).size(); i++) {
                System.out.println(scheduleByWeeks.get(k).get(i).toString());
            }

            System.out.println();

        }
        //System.out.println(num);

        for(int i = 0; i < weightsCopy.size(); i++)
        {
            //System.out.println("Copy: "+weightsCopy.get(i));
        }

    }

}