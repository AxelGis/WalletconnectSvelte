export type Language = {
  label: string;
  flag: string;
  value: string;
};

const languages: Language[] = [
  {
    label: 'French',
    flag: 'assets/images/flags/french.jpg',
    value: 'fr',
  },
  {
    label: 'English',
    flag: 'assets/images/flags/us.jpg',
    value: 'en',
  },
];
if (import.meta.env.DEV) {
  languages.push({
    label: 'Russian',
    flag: 'assets/images/flags/russia.jpg',
    value: 'ru',
  });
}

export default languages;
