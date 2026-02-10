export const egyptianGovernorates = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Port Said",
  "Suez",
  "Luxor",
  "Aswan",
  "Asyut",
  "Beheira",
  "Beni Suef",
  "Dakahlia",
  "Damietta",
  "Faiyum",
  "Gharbia",
  "Ismailia",
  "Kafr El Sheikh",
  "Matrouh",
  "Minya",
  "Monufia",
  "New Valley",
  "North Sinai",
  "Qena",
  "Red Sea",
  "Sharqia",
  "Sohag",
  "South Sinai",
] as const;

export const egyptianCities: Record<string, string[]> = {
  Cairo: [
    "Nasr City",
    "Heliopolis",
    "Maadi",
    "New Cairo",
    "6th of October",
    "Zamalek",
    "Downtown",
    "Mokattam",
    "Helwan",
    "Ain Shams",
    "Shubra",
    "Ghamra",
    "Abbasia",
    "Garden City",
    "Manial",
  ],
  Giza: [
    "Dokki",
    "Mohandessin",
    "Agouza",
    "6th of October City",
    "Sheikh Zayed",
    "Haram",
    "Faisal",
    "Imbaba",
    "October Gardens",
    "Smart Village",
  ],
  Alexandria: [
    "Montaza",
    "Miami",
    "Sidi Gaber",
    "Sporting",
    "Stanley",
    "Smouha",
    "San Stefano",
    "Gleem",
    "Camp Caesar",
    "Sidi Bishr",
    "Kafr Abdo",
    "Raml Station",
  ],
  Qalyubia: [
    "Banha",
    "Qalyub",
    "Shubra El Kheima",
    "El Khanka",
    "Qaha",
    "Kafr Shukr",
  ],
  "Port Said": ["Port Said", "Port Fouad"],
  Suez: ["Suez", "Ain Sokhna"],
  Luxor: ["Luxor City", "Karnak", "West Bank"],
  Aswan: ["Aswan City", "Abu Simbel", "Kom Ombo"],
  Asyut: ["Asyut City", "El Badari", "Abnoub"],
  Beheira: ["Damanhour", "Kafr El Dawwar", "Rashid", "Edko"],
  "Beni Suef": ["Beni Suef City", "El Wasta", "Nasser"],
  Dakahlia: ["Mansoura", "Mit Ghamr", "Talkha", "Dekernes", "Aga"],
  Damietta: ["Damietta", "New Damietta", "Ras El Bar"],
  Faiyum: ["Faiyum City", "Ibshaway", "Tamiya"],
  Gharbia: ["Tanta", "El Mahalla El Kubra", "Kafr El Zayat", "Zefta"],
  Ismailia: ["Ismailia City", "Fayed", "El Qantara"],
  "Kafr El Sheikh": ["Kafr El Sheikh", "Desouk", "Fuwwah", "Metobas"],
  Matrouh: ["Marsa Matrouh", "El Alamein", "Sidi Abdel Rahman"],
  Minya: ["Minya City", "Mallawi", "Samalut", "Beni Mazar"],
  Monufia: ["Shibin El Kom", "Menouf", "Ashmoun", "Quesna"],
  "New Valley": ["Kharga", "Dakhla", "Farafra", "Baris"],
  "North Sinai": ["Arish", "Sheikh Zuweid", "Rafah"],
  Qena: ["Qena City", "Nag Hammadi", "Qus", "Dishna"],
  "Red Sea": ["Hurghada", "Safaga", "Marsa Alam", "El Gouna", "Sharm El Naga"],
  Sharqia: [
    "Zagazig",
    "10th of Ramadan City",
    "Bilbeis",
    "Faqous",
    "Abu Hammad",
  ],
  Sohag: ["Sohag City", "Akhmim", "Girga", "El Balyana"],
  "South Sinai": [
    "Sharm El Sheikh",
    "Dahab",
    "Nuweiba",
    "Taba",
    "Saint Catherine",
  ],
};

export function getAllCities(): string[] {
  return Object.values(egyptianCities).flat();
}

export function isValidEgyptianCity(city: string): boolean {
  const allCities = getAllCities();
  return allCities.some(
    (validCity) => validCity.toLowerCase() === city.toLowerCase().trim()
  );
}

export function getGovernorateByCity(city: string): string | null {
  for (const [governorate, cities] of Object.entries(egyptianCities)) {
    if (
      cities.some(
        (validCity) => validCity.toLowerCase() === city.toLowerCase().trim()
      )
    ) {
      return governorate;
    }
  }
  return null;
}