// Built-in Croatian names, used when the AI service is unavailable.

const MALE_FIRST_NAMES = [
  'Ivan', 'Marko', 'Josip', 'Luka', 'Ante', 'Matej', 'Petar', 'Stjepan', 'Mario', 'Tomislav',
  'Davor', 'Nikola', 'Filip', 'Mateo', 'Dario', 'Zvonimir', 'Branko', 'Krešimir', 'Hrvoje', 'Dino',
  'Goran', 'Damir', 'Zoran', 'Darko', 'Robert', 'Antun', 'Mihovil', 'Dominik', 'Karlo', 'Fran',
  'Leon', 'Jakov', 'Borna', 'Vedran', 'Ivica', 'Marijan', 'Slaven', 'Tihomir', 'Božidar', 'Dražen',
  'Igor', 'Kristijan', 'Lovro', 'Patrik', 'Roko', 'Šime', 'Tin', 'Vlado', 'Željko', 'Andrija',
  'Domagoj', 'Emil', 'Gabrijel', 'Hrvoslav', 'Ilija', 'Juraj', 'Krunoslav', 'Miroslav', 'Neven', 'Stipe',
];

const FEMALE_FIRST_NAMES = [
  'Ana', 'Marija', 'Ivana', 'Maja', 'Katarina', 'Petra', 'Marina', 'Martina', 'Ivona', 'Nikolina',
  'Tea', 'Lucija', 'Mia', 'Lana', 'Sara', 'Nina', 'Dora', 'Matea', 'Josipa', 'Antonija',
  'Mirjana', 'Jelena', 'Tihana', 'Vesna', 'Sanja', 'Kristina', 'Dijana', 'Snježana', 'Gordana', 'Željka',
  'Mateja', 'Karla', 'Lea', 'Ema', 'Klara', 'Iva', 'Barbara', 'Helena', 'Paula', 'Nika',
  'Tamara', 'Andrea', 'Ankica', 'Branka', 'Danijela', 'Draga', 'Elena', 'Jasna', 'Lidija', 'Marta',
  'Nada', 'Renata', 'Silvija', 'Teuta', 'Vanja', 'Vlasta', 'Zdenka', 'Zrinka', 'Mara', 'Ruža',
];

const LAST_NAMES = [
  'Horvat', 'Kovačević', 'Babić', 'Marić', 'Novak', 'Jurić', 'Kovač', 'Vuković', 'Knežević', 'Marković',
  'Petrović', 'Matić', 'Tomić', 'Pavlović', 'Kovačić', 'Božić', 'Blažević', 'Grgić', 'Pavić', 'Radić',
  'Perić', 'Filipović', 'Šarić', 'Lovrić', 'Vidović', 'Perković', 'Popović', 'Bošnjak', 'Jukić', 'Barišić',
  'Marušić', 'Josipović', 'Tadić', 'Lukić', 'Mikulić', 'Bilić', 'Nikolić', 'Jelić', 'Šimunić', 'Burić',
  'Katić', 'Matošević', 'Mandić', 'Vlahović', 'Žagar', 'Zorić', 'Franjić', 'Ivanković', 'Kralj', 'Dragić',
  'Cvitković', 'Starčević', 'Galić', 'Medved', 'Posavec', 'Šola', 'Županić', 'Rukavina', 'Mrkonjić', 'Delić',
  'Krznarić', 'Lončar', 'Mlinarić', 'Oreški', 'Pranjić', 'Rogić', 'Sertić', 'Tkalčić', 'Uremović', 'Vrdoljak',
  'Zovko', 'Ćosić', 'Đurić', 'Brkić', 'Čizmić', 'Dujmović', 'Eterović', 'Fabijanić', 'Glavaš', 'Habijan',
  'Ilić', 'Jambrek', 'Kos', 'Lacković', 'Majstorović', 'Nemet', 'Obradović', 'Palijan', 'Runje', 'Stanić',
  'Turk', 'Ugrin', 'Vidaković', 'Zeba', 'Šimić', 'Šeparović', 'Mesić', 'Banović', 'Car', 'Dukić',
  'Prpić', 'Ružić', 'Bakić', 'Crnković', 'Duvnjak', 'Erceg', 'Furlan', 'Gojević', 'Hrastić', 'Ivšić',
];

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export const generateLocalNames = (count: number): { firstName: string; lastName: string }[] => {
  const firstNames = [...MALE_FIRST_NAMES, ...FEMALE_FIRST_NAMES];
  const seen = new Set<string>();
  const result: { firstName: string; lastName: string }[] = [];

  // Cap at the number of distinct pairs so the loop below always terminates (the UI allows at most 50).
  const target = Math.min(count, firstNames.length * LAST_NAMES.length);
  while (result.length < target) {
    const firstName = pick(firstNames);
    const lastName = pick(LAST_NAMES);
    const key = `${firstName} ${lastName}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ firstName, lastName });
  }
  return result;
};
