package SchedulingAlgorithm;

public class Team {
    private String teamName;
    private String skillLevel;
    private int scheduleWeight;
    public int skillLevelWeight;

    public Team() {
        this.teamName = null;
        this.skillLevel = null;
        this.scheduleWeight = 0;
    }

    public Team(String teamName, String skillLevel) {
        this.teamName = teamName;
        this.skillLevel = skillLevel;
        this.scheduleWeight = 0;
        if (skillLevel.equals("Elite")) {
            this.skillLevelWeight = 3;
        } else if (skillLevel.equals("A")) {
            this.skillLevelWeight = 2;
        } else if (skillLevel.equals("B")) {
            this.skillLevelWeight = 1;
        } else {
            this.skillLevelWeight = 0;
        }

    }

    public int getSkillLevelWeight()
    {
        return this.skillLevelWeight;
    }

    public Team(String teamName) {
        this.teamName = teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getTeamName() {
        return this.teamName;
    }

    public void setSkillLevel(String skillLevel) {
        this.skillLevel = skillLevel;
    }

    public String getSkillLevel() {
        return this.skillLevel;
    }

    public void setScheduleWeight(int scheduleWeight) {
        this.scheduleWeight += scheduleWeight;
    }

    public void resetScheduleWeight() {
        this.scheduleWeight = 0;
    }

    public int getScheduleWeight() {
        return this.scheduleWeight;
    }
}
