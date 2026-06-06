export type Gender = 'Male' | 'Female' ;

export type UserProfile = {
  fullName: string;
  email: string;
  password: string;
  username: string;
  age: string;
  gender: Gender | '';
  primaryGoal: string;
  activityLevel: string;
  wellnessActivities: string[];
  // New wellness profile fields
  occupation: string;
  averageSleepDuration: string;
  dailyScreenTime: string;
  stressLevel: string;
  daysExercisedPerWeek: string;
  biggestWellnessChallenge: string;
  existingWellnessHabits: string[];
  wellnessGoals: string[];
};

export const EMPTY_PROFILE: UserProfile = {
  fullName: '',
  email: '',
  password: '',
  username: '',
  age: '',
  gender: '',
  primaryGoal: '',
  activityLevel: '',
  wellnessActivities: [],
  // New wellness profile defaults
  occupation: '',
  averageSleepDuration: '',
  dailyScreenTime: '',
  stressLevel: '',
  daysExercisedPerWeek: '',
  biggestWellnessChallenge: '',
  existingWellnessHabits: [],
  wellnessGoals: [],
};
