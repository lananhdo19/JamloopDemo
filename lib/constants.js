export const PUBLISHERS = [
  'Hulu',
  'Discovery',
  'ABC',
  'A&E',
  'TLC',
  'Fox News',
  'Fox Sports',
  'ESPN',
  'NBC',
  'CBS',
];

export const DEVICES = ['CTV', 'Mobile Device', 'Web Browser'];

export const GENDERS = ['All', 'Male', 'Female'];

export const CAMPAIGN_STATUSES = ['draft', 'active', 'paused', 'ended'];

export const US_STATES = ['Virginia', 'Georgia', 'California', 'New York']; //sample states, not a complete list

export const COUNTRIES = ['United States', 'Canada', 'Mexico'];

export const DEFAULT_FORM = {
  name: '',
  status: 'draft',
  budgetGoal: '',
  startDate: '',
  endDate: '',
  demographic: { ageMin: '', ageMax: '', gender: 'All' },
  geo: { country: 'United States', state: '', city: '', zipCode: '' },
  publishers: [],
  devices: [],
};