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
};
