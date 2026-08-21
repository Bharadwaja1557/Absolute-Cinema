// Absolute Cinema — your archive.
// The ONLY data file the site reads. Your list is wrapped in
// "window.ACMovies = [ ... ];" so the page works straight from disk.
//
// Films are ordered newest-first by watchedDate, and the gallery groups by
// the year you watched. Fields:
//   title       (required) — film title
//   watchedDate (required) — "YYYY-MM-DD"; drives order & grouping
//   year        (required) — film's release year (used for the poster filename)
//   language    (required) — shown as the tag on the poster; also the release tag
//   poster      (required) — release asset FILENAME only, no folder, no parentheses,
//                            e.g. "Ant_Man_and_the_Wasp_Quantumania_2023.webp".
//                            The site builds the URL from language + filename:
//                            language "English" + "Ant_Man_..._2023.webp"
//                              -> .../releases/download/english/Ant_Man_..._2023.webp
//                            (A full http(s) URL is also accepted and used as-is.)
//   format      (required) — "2D" / "IMAX" / "3D" / "4DX"; only IMAX/3D/4DX show a chip
//   theatre     (required) — hall/theatre name (shown under the title)
//   city        (required) — appended after the theatre
//   rerelease   optional   — true shows a "Re-release" pill
//
// NOTE: Tweak any watchedDate and the order updates itself.

window.ACMovies = [
  {
    "title": "Irumudi",
    "year": 2026,
    "watchedDate": "2026-08-21",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Ratan Elegance",
    "city": "Kanpur",
    "poster": "Irumudi_2026.webp"
  },
  {
    "title": "Spider-Man: Brand New Day",
    "year": 2026,
    "watchedDate": "2026-07-30",
    "language": "English",
    "format": "4DX",
    "theatre": "PVR SUPERPLEX",
    "city": "Lucknow",
    "poster": "Spiderman_Brand_New_Day_2026.webp"
  },
  {
    "title": "The Odyssey",
    "year": 2026,
    "watchedDate": "2026-07-17",
    "language": "English",
    "format": "2D",
    "theatre": "INOX Z Square",
    "city": "Kanpur",
    "poster": "The_Odyssey_2026.webp"
  },
  {
    "title": "Minions & Monsters",
    "year": 2026,
    "watchedDate": "2026-07-03",
    "language": "English",
    "format": "3D",
    "theatre": "INOX Z Square",
    "city": "Kanpur",
    "poster": "Minions_and_Monsters_2026.webp"
  },
  {
    "title": "Obsession",
    "year": 2026,
    "watchedDate": "2026-06-17",
    "language": "English",
    "format": "2D",
    "theatre": "INOX Z Square",
    "city": "Kanpur",
    "poster": "Obsession_2026.webp"
  },
  {
    "title": "Peddi",
    "year": 2026,
    "watchedDate": "2026-06-04",
    "language": "Telugu",
    "format": "2D",
    "theatre": "PVR Deep",
    "city": "Kanpur",
    "poster": "Peddi_2026.webp"
  },
  {
    "title": "Dhurandhar: The Revenge",
    "year": 2026,
    "watchedDate": "2026-03-19",
    "language": "Hindi",
    "format": "2D",
    "theatre": "INOX Z Square",
    "city": "Kanpur",
    "poster": "Dhurandhar_The_Revenge_2026.webp"
  },
  {
    "title": "Dhurandhar",
    "year": 2025,
    "watchedDate": "2025-12-24",
    "language": "Hindi",
    "format": "2D",
    "theatre": "MGB",
    "city": "Nellore",
    "poster": "Dhurandhar_2025.webp"
  },
  {
    "title": "Akhanda 2: Thaandavam",
    "year": 2025,
    "watchedDate": "2025-12-15",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Rain Square",
    "city": "Nellore",
    "poster": "Akhanda_2_Thaandavam_2025.webp"
  },
  {
    "title": "Baahubali: The Epic",
    "year": 2025,
    "watchedDate": "2025-10-31",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Rave 3",
    "city": "Kanpur",
    "poster": "Baahubali_The_Epic_2025.webp",
    "rerelease": true
  },
  {
    "title": "Kantara: Chapter 1",
    "year": 2025,
    "watchedDate": "2025-10-03",
    "language": "Kannada",
    "format": "2D",
    "theatre": "PVR Deep",
    "city": "Kanpur",
    "poster": "Kantara_Chapter_1_2025.webp"
  },
  {
    "title": "They Call Him OG",
    "year": 2025,
    "watchedDate": "2025-09-26",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Rave 3",
    "city": "Kanpur",
    "poster": "They_Call_Him_OG_2025.webp"
  },
  {
    "title": "The Bengal Files",
    "year": 2025,
    "watchedDate": "2025-09-06",
    "language": "Hindi",
    "format": "2D",
    "theatre": "PVR Unknown",
    "city": "Kanpur",
    "poster": "The_Bengal_Files_2025.webp"
  },
  {
    "title": "Coolie",
    "year": 2025,
    "watchedDate": "2025-08-15",
    "language": "Tamil",
    "format": "2D",
    "theatre": "Rave 3",
    "city": "Kanpur",
    "poster": "Coolie_2025.webp"
  },
  {
    "title": "Single",
    "year": 2025,
    "watchedDate": "2025-05-10",
    "language": "Telugu",
    "format": "2D",
    "theatre": "MGB",
    "city": "Nellore",
    "poster": "Single_2025.webp"
  },
  {
    "title": "Thunderbolts",
    "year": 2025,
    "watchedDate": "2025-05-02",
    "language": "English",
    "format": "2D",
    "theatre": "Gowri",
    "city": "Ananthapur",
    "poster": "Thunderbolts_2025.webp"
  },
  {
    "title": "MAD Square",
    "year": 2025,
    "watchedDate": "2025-04-02",
    "language": "Telugu",
    "format": "2D",
    "theatre": "PVR",
    "city": "Jaipur",
    "poster": "MAD_Square_2025.webp"
  },
  {
    "title": "Captain America: Brave New World",
    "year": 2025,
    "watchedDate": "2025-02-15",
    "language": "English",
    "format": "2D",
    "theatre": "MGB",
    "city": "Nellore",
    "poster": "Captain_America_Brave_New_World_2025.webp"
  },
  {
    "title": "Seethamma Vakitlo Sirimalle Chettu",
    "year": 2013,
    "watchedDate": "2025-01-10",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Sandhya",
    "city": "Hyderabad",
    "poster": "Seethamma_Vakitlo_Sirimalle_Chettu_2013.webp",
    "rerelease": true
  },
  {
    "title": "Pushpa 2: The Rule",
    "year": 2024,
    "watchedDate": "2024-12-06",
    "language": "Telugu",
    "format": "2D",
    "theatre": "S2",
    "city": "Nellore",
    "poster": "Pushpa_2_The_Rule_2024.webp"
  },
  {
    "title": "Khaleja",
    "year": 2010,
    "watchedDate": "2024-09-13",
    "language": "Telugu",
    "format": "2D",
    "theatre": "S2",
    "city": "Nellore",
    "poster": "Khaleja_2010.webp",
    "rerelease": true
  },
  {
    "title": "Kushi",
    "year": 2001,
    "watchedDate": "2024-09-02",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Sujatha",
    "city": "Pulivendula",
    "poster": "Kushi_2001.webp",
    "rerelease": true
  },
  {
    "title": "Committee Kurrollu",
    "year": 2024,
    "watchedDate": "2024-08-31",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Sujatha",
    "city": "Pulivendula",
    "poster": "Committee_Kurrollu_2024.webp"
  },
  {
    "title": "Kalki 2898 AD",
    "year": 2024,
    "watchedDate": "2024-06-28",
    "language": "Telugu",
    "format": "3D",
    "theatre": "MGB",
    "city": "Nellore",
    "poster": "Kalki_2898_AD_2024.webp"
  },
  {
    "title": "Gaami",
    "year": 2024,
    "watchedDate": "2024-03-10",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Maruthi",
    "city": "Pulivendula",
    "poster": "Gaami_2024.webp"
  },
  {
    "title": "Animal",
    "year": 2023,
    "watchedDate": "2023-12-02",
    "language": "Hindi",
    "format": "2D",
    "theatre": "Maruthi",
    "city": "Pulivendula",
    "poster": "Animal_2023.webp"
  },
  {
    "title": "Miss Shetty Mr Polishetty",
    "year": 2023,
    "watchedDate": "2023-09-09",
    "language": "Telugu",
    "format": "2D",
    "theatre": "S2",
    "city": "Nellore",
    "poster": "Miss_Shetty_Mr_Polishetty_2023.webp"
  },
  {
    "title": "Jawan",
    "year": 2023,
    "watchedDate": "2023-09-08",
    "language": "Hindi",
    "format": "2D",
    "theatre": "Sujatha",
    "city": "Pulivendula",
    "poster": "Jawan_2023.webp"
  },
  {
    "title": "Kushi",
    "year": 2023,
    "watchedDate": "2023-09-02",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Unknown",
    "city": "Vijaywada",
    "poster": "Kushi_2023.webp"
  },
  {
    "title": "Oppenheimer",
    "year": 2023,
    "watchedDate": "2023-07-22",
    "language": "English",
    "format": "2D",
    "theatre": "S2",
    "city": "Nellore",
    "poster": "Oppenheimer_2023.webp"
  },
  {
    "title": "Adipurush",
    "year": 2023,
    "watchedDate": "2023-06-17",
    "language": "Telugu",
    "format": "2D",
    "theatre": "MGB",
    "city": "Nellore",
    "poster": "Adipurush_2023.webp"
  },
  {
    "title": "Virupaksha",
    "year": 2023,
    "watchedDate": "2023-04-22",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Maruthi",
    "city": "Pulivendula",
    "poster": "Virupaksha_2023.webp"
  },
  {
    "title": "Shaakuntalam",
    "year": 2023,
    "watchedDate": "2023-04-15",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Maruthi",
    "city": "Pulivendula",
    "poster": "Shaakuntalam_2023.webp"
  },
  {
    "title": "Ant-Man and the Wasp: Quantumania",
    "year": 2023,
    "watchedDate": "2023-02-18",
    "language": "English",
    "format": "2D",
    "theatre": "Maruthi",
    "city": "Pulivendula",
    "poster": "Ant_Man_and_the_Wasp_Quantumania_2023.webp"
  },
  {
    "title": "Varisu",
    "year": 2023,
    "watchedDate": "2023-01-12",
    "language": "Tamil",
    "format": "2D",
    "theatre": "MGB",
    "city": "Nellore",
    "poster": "Varisu_2023.webp"
  },
  {
    "title": "Sardar",
    "year": 2022,
    "watchedDate": "2022-10-22",
    "language": "Tamil",
    "format": "2D",
    "theatre": "Maruthi",
    "city": "Pulivendula",
    "poster": "Sardar_2022.webp"
  },
  {
    "title": "Kantara",
    "year": 2022,
    "watchedDate": "2022-10-16",
    "language": "Kannada",
    "format": "2D",
    "theatre": "Sujatha",
    "city": "Pulivendula",
    "poster": "Kantara_2022.webp"
  },
  {
    "title": "Oke Oka Jeevitham",
    "year": 2022,
    "watchedDate": "2022-09-10",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Maruthi",
    "city": "Pulivendula",
    "poster": "Oke_Oka_Jeevitham_2022.webp"
  },
  {
    "title": "Sita Ramam",
    "year": 2022,
    "watchedDate": "2022-08-06",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Maruthi",
    "city": "Pulivendula",
    "poster": "Sita_Ramam_2022.webp"
  },
  {
    "title": "Thor: Love and Thunder",
    "year": 2022,
    "watchedDate": "2022-07-09",
    "language": "English",
    "format": "2D",
    "theatre": "MGB",
    "city": "Nellore",
    "poster": "Thor_Love_and_Thunder_2022.webp"
  },
  {
    "title": "Manchi Rojulochaie",
    "year": 2021,
    "watchedDate": "2021-12-25",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Maruthi",
    "city": "Pulivendula",
    "poster": "Manchi_Rojulochaie_2021.webp"
  },
  {
    "title": "Spider-Man: No Way Home",
    "year": 2021,
    "watchedDate": "2021-12-17",
    "language": "English",
    "format": "2D",
    "theatre": "Maruthi",
    "city": "Pulivendula",
    "poster": "Spider_Man_No_Way_Home_2021.webp"
  },
  {
    "title": "RED",
    "year": 2021,
    "watchedDate": "2021-01-15",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Special theatre",
    "city": "Mypadu",
    "poster": "RED_2021.webp"
  },
  {
    "title": "Vinaya Vidheya Rama",
    "year": 2019,
    "watchedDate": "2019-01-12",
    "language": "Telugu",
    "format": "2D",
    "theatre": "MGB",
    "city": "Nellore",
    "poster": "Vinaya_Vidheya_Rama_2019.webp"
  },
  {
    "title": "Mahanati",
    "year": 2018,
    "watchedDate": "2018-05-10",
    "language": "Telugu",
    "format": "2D",
    "theatre": "MGB",
    "city": "Nellore",
    "poster": "Mahanati_2018.webp"
  },
  {
    "title": "Rangasthalam",
    "year": 2018,
    "watchedDate": "2018-03-31",
    "language": "Telugu",
    "format": "2D",
    "theatre": "S2",
    "city": "Nellore",
    "poster": "Rangasthalam_2018.webp"
  },
  {
    "title": "Baahubali 2: The Conclusion",
    "year": 2017,
    "watchedDate": "2017-04-29",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Leela Mahal",
    "city": "Nellore",
    "poster": "Baahubali_2_The_Conclusion_2017.webp"
  },
  {
    "title": "The Fate of the Furious",
    "year": 2017,
    "watchedDate": "2017-04-15",
    "language": "English",
    "format": "2D",
    "theatre": "S2",
    "city": "Nellore",
    "poster": "The_Fate_of_the_Furious_2017.webp"
  },
  {
    "title": "Gautamiputra Satakarni",
    "year": 2017,
    "watchedDate": "2017-01-13",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Special theatre",
    "city": "Mypadu",
    "poster": "Gautamiputra_Satakarni_2017.webp"
  },
  {
    "title": "Hyper",
    "year": 2016,
    "watchedDate": "2016-09-10",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Special theatre",
    "city": "Mypadu",
    "poster": "Hyper_2016.webp"
  },
  {
    "title": "Baahubali: The Beginning",
    "year": 2015,
    "watchedDate": "2015-07-11",
    "language": "Telugu",
    "format": "2D",
    "theatre": "S2",
    "city": "Nellore",
    "poster": "Baahubali_The_Beginning_2015.webp"
  },
  {
    "title": "Epic",
    "year": 2013,
    "watchedDate": "2013-05-25",
    "language": "English",
    "format": "3D",
    "theatre": "S2",
    "city": "Nellore",
    "poster": "Epic_2013.webp"
  },
  {
    "title": "Cameraman Gangatho Rambabu",
    "year": 2012,
    "watchedDate": "2012-10-18",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Special theatre",
    "city": "Mypadu",
    "poster": "Cameraman_Gangatho_Rambabu_2012.webp"
  },
  {
    "title": "Gabbar Singh",
    "year": 2012,
    "watchedDate": "2012-05-11",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Leela Mahal",
    "city": "Nellore",
    "poster": "Gabbar_Singh_2012.webp"
  },
  {
    "title": "Dhammu",
    "year": 2012,
    "watchedDate": "2012-04-28",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Special theatre",
    "city": "Mypadu",
    "poster": "Dhammu_2012.webp"
  },
  {
    "title": "Racha",
    "year": 2012,
    "watchedDate": "2012-03-31",
    "language": "Telugu",
    "format": "2D",
    "theatre": "S2",
    "city": "Nellore",
    "poster": "Racha_2012.webp"
  },
  {
    "title": "Journey 2: The Mysterious Island",
    "year": 2012,
    "watchedDate": "2012-02-11",
    "language": "English",
    "format": "3D",
    "theatre": "S2",
    "city": "Nellore",
    "poster": "Journey_2_The_Mysterious_Island_2012.webp"
  },
  {
    "title": "Shakti",
    "year": 2011,
    "watchedDate": "2011-09-24",
    "language": "Telugu",
    "format": "2D",
    "theatre": "Special theatre",
    "city": "Mypadu",
    "poster": "Shakti_2011.webp"
  }
];
