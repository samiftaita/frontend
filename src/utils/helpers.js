export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR");
};

export const formatTime = (time) => {
  return time.substring(0, 5);
};

export const getFrenchDayName = (dayIndex) => {
  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  return days[dayIndex];
};
