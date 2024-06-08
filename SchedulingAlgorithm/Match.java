package SchedulingAlgorithm;

public class Match 
{
    private Team homeTeam;
    private Team awayTeam;

    public Match()
    {
        this.homeTeam = null;
        this.awayTeam = null;
    }

    public Match(Team homeTeam, Team awayTeam)
    {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
    }

    public void setHomeTeam(Team homeTeam)
    {
        this.homeTeam = homeTeam;
    }

    public Team getHomeTeam()
    {
        return this.homeTeam;
    }

    public void setAwayTeam(Team awayTeam)
    {
        this.awayTeam = awayTeam;
    }

    public Team getAwayTeam()
    {
        return this.awayTeam;
    }

    @Override
    public String toString()
    {
        return this.getHomeTeam().getTeamName() + " vs "+this.getAwayTeam().getTeamName();
    }
}
