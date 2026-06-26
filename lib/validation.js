export function validateCampaignData({ name, budgetGoal, startDate, endDate, publishers, devices, demographic }) {
  const errors = {};
  if (!name?.trim()) errors.name = 'Campaign name is required.';
  if (!budgetGoal || budgetGoal <= 0) errors.budgetGoal = 'Budget must be greater than $0.';
  if (!startDate) errors.startDate = 'Start date is required.';
  if (!endDate) errors.endDate = 'End date is required.';
  if (startDate && endDate && new Date(endDate) <= new Date(startDate))
    errors.endDate = 'End date must be after start date.';
  if (!publishers?.length) errors.publishers = 'Select at least one publisher.';
  if (!devices?.length) errors.devices = 'Select at least one device.';
  if (demographic?.ageMin && demographic?.ageMax) {
    if (Number(demographic.ageMax) <= Number(demographic.ageMin))
      errors['demographic.ageMax'] = 'Max age must be greater than min age.';
  }
  return errors;
}
