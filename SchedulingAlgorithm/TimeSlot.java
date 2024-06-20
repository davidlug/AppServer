package SchedulingAlgorithm;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;


public class TimeSlot 
{
    private Date date;

    private int weight;

    private Calendar calendar;

    private int week;

    private PlayingLocation playingLocation;

    private Match match;

    public TimeSlot(Date date, Calendar calendar, int week, PlayingLocation playingLocation, int weight)
    {
        this.calendar = calendar;
        this.date = date;
        calendar.setTime(date);
        this.week = week;
        this.playingLocation = playingLocation;
        this.weight = weight;
    }

    public void setDate(Date date)
    {
        this.date = date;
    }

    public Date getDate()
    {
        return this.date;
    }

    public void setWeight(int weight)
    {
        this.weight = weight;
    }

    public int getWeight()
    {
        return this.weight;
    }

    public void setCalendar(Date date)
    {
        this.calendar.setTime(date);
    }

    public int getWeek()
    {
        return this.week;
    }

    public void setWeek(int week)
    {
        this.week = week;
    }

    public void setPlayingLocation(PlayingLocation playingLocation)
    {
        this.playingLocation = playingLocation;
    }

    public PlayingLocation getPlayingLocation()
    {
        return this.playingLocation;
    }

    public void setMatch(Match match)
    {
        this.match = match;
    }
    public Match getMatch()
    {
        return this.match;
    }

    public int getStartTime()
    {
        Calendar cal = Calendar.getInstance();
        cal.setTime(this.getDate());
        return cal.get(Calendar.HOUR_OF_DAY);
    }


    @Override
    public String toString()
    {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
        String strDate = dateFormat.format(this.getDate());  
        
        return "Week "+this.getWeek()+":  "+this.getMatch().getHomeTeam().getTeamName()+" vs. "+this.getMatch().getAwayTeam().getTeamName()+" time - "+strDate;
    }

}
