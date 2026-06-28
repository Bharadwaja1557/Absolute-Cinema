// Absolute Cinema — your archive.
// The ONLY data file the site reads. Your list is wrapped in
// "window.ACMovies = [ ... ];" so the page works straight from disk.
//
// Films are ordered newest-first by watchedDate, and the gallery groups by
// the year you watched. Fields:
//   title       (required) — film title
//   watchedDate (required) — "YYYY-MM-DD"; drives order & grouping
//   year        (required) — film's release year (used for the poster filename)
//   language    (required) — shown as the tag on the poster
//   poster      (required) — relative path, jpg or png; the site tries both
//   format      (required) — "2D" / "IMAX" / "3D" / "4DX"; only IMAX/3D/4DX show a chip
//   theater     (required) — hall/theatre name (shown under the title)
//   city        (required) — appended after the theatre
//   rerelease   optional   — true shows a "Re-release" pill
//
// NOTE: Tweak any watchedDate and the order updates itself.

window.ACMovies = [
  {
    "title": "Obsession",
    "year": 2026,
    "watchedDate": "2026-06-17",
    "language": "English",
    "format": "2D",
    "theater": "INOX Z Square",
    "city": "Kanpur",
    "poster": "posters/English/Obsession_(2026).png"
  },
  {
    "title": "Peddi",
    "year": 2026,
    "watchedDate": "2026-06-04",
    "language": "Telugu",
    "format": "2D",
    "theater": "PVR Deep",
    "city": "Kanpur",
    "poster": "posters/Telugu/Peddi_(2026).jpg"
  },
  {
    "title": "Dhurandhar: The Revenge",
    "year": 2026,
    "watchedDate": "2026-03-19",
    "language": "Hindi",
    "format": "2D",
    "theater": "INOX Z Square",
    "city": "Kanpur",
    "poster": "posters/Hindi/Dhurandhar_The_Revenge_(2026).jpg"
  },
  {
    "title": "Dhurandhar",
    "year": 2025,
    "watchedDate": "2025-12-24",
    "language": "Hindi",
    "format": "2D",
    "theater": "MGB",
    "city": "Nellore",
    "poster": "posters/Hindi/Dhurandhar_(2025).jpg"
  },
  {
    "title": "Akhanda 2: Thaandavam",
    "year": 2025,
    "watchedDate": "2025-12-15",
    "language": "Telugu",
    "format": "2D",
    "theater": "Rain Square",
    "city": "Nellore",
    "poster": "posters/Telugu/Akhanda_2_Thaandavam_(2025).jpg"
  },
  {
    "title": "Baahubali: The Epic",
    "year": 2025,
    "watchedDate": "2025-10-31",
    "language": "Telugu",
    "format": "2D",
    "theater": "Rave 3",
    "city": "Kanpur",
    "poster": "posters/Telugu/Baahubali_The_Epic_(2025).jpg",
    "rerelease": true
  },
  {
    "title": "Kantara: Chapter 1",
    "year": 2025,
    "watchedDate": "2025-10-03",
    "language": "Kannada",
    "poster": "posters/Kannada/Kantara_Chapter_1_(2025).jpg"
  },
  {
    "title": "They Call Him OG",
    "year": 2025,
    "watchedDate": "2025-09-26",
    "language": "Telugu",
    "poster": "posters/Telugu/They_Call_Him_OG_(2025).jpg"
  },
  {
    "title": "The Bengal Files",
    "year": 2025,
    "watchedDate": "2025-09-06",
    "language": "Hindi",
    "poster": "posters/Hindi/The_Bengal_Files_(2025).jpg"
  },
  {
    "title": "Coolie",
    "year": 2025,
    "watchedDate": "2025-08-15",
    "language": "Tamil",
    "poster": "posters/Tamil/Coolie_(2025).jpg"
  },
  {
    "title": "MAD Square",
    "year": 2025,
    "watchedDate": "2025-05-10",
    "language": "Telugu",
    "poster": "posters/Telugu/MAD_Square_(2025).jpg"
  },
  {
    "title": "Captain America: Brave New World",
    "year": 2025,
    "watchedDate": "2025-02-15",
    "language": "English",
    "poster": "posters/English/Captain_America_Brave_New_World_(2025).jpg"
  },
  {
    "title": "Seethamma Vakitlo Sirimalle Chettu",
    "year": 2013,
    "watchedDate": "2025-01-10",
    "language": "Telugu",
    "poster": "posters/Telugu/Seethamma_Vakitlo_Sirimalle_Chettu_(2013).jpg",
    "rerelease": true
  },
  {
    "title": "Pushpa 2: The Rule",
    "year": 2024,
    "watchedDate": "2024-12-06",
    "language": "Telugu",
    "poster": "posters/Telugu/Pushpa_2_The_Rule_(2024).jpg"
  },
  {
    "title": "Khaleja",
    "year": 2010,
    "watchedDate": "2024-09-13",
    "language": "Telugu",
    "poster": "posters/Telugu/Khaleja_(2010).jpg",
    "rerelease": true
  },
  {
    "title": "Kushi",
    "year": 2001,
    "watchedDate": "2024-09-02",
    "language": "Telugu",
    "poster": "posters/Telugu/Kushi_(2001).jpg",
    "rerelease": true
  },
  {
    "title": "Committee Kurrollu",
    "year": 2024,
    "watchedDate": "2024-08-31",
    "language": "Telugu",
    "poster": "posters/Telugu/Committee_Kurrollu_(2024).jpg"
  },
  {
    "title": "Kalki 2898 AD",
    "year": 2024,
    "watchedDate": "2024-06-28",
    "language": "Telugu",
    "format": "IMAX",
    "theater": "PVR",
    "city": "Hyderabad",
    "poster": "posters/Telugu/Kalki_2898_AD_(2024).jpg"
  },
  {
    "title": "Animal",
    "year": 2023,
    "watchedDate": "2023-12-02",
    "language": "Hindi",
    "format": "2D",
    "theater": "",
    "city": "",
    "poster": "posters/Hindi/Animal_(2023).jpg"
  },
  {
    "title": "Miss Shetty Mr Polishetty",
    "year": 2023,
    "watchedDate": "2023-09-09",
    "language": "Telugu",
    "poster": "posters/Telugu/Miss_Shetty_Mr_Polishetty_(2023).jpg"
  },
  {
    "title": "Jawan",
    "year": 2023,
    "watchedDate": "2023-09-08",
    "language": "Hindi",
    "poster": "posters/Hindi/Jawan_(2023).jpg"
  },
  {
    "title": "Kushi",
    "year": 2023,
    "watchedDate": "2023-09-02",
    "language": "Telugu",
    "poster": "posters/Telugu/Kushi_(2023).jpg"
  },
  {
    "title": "Oppenheimer",
    "year": 2023,
    "watchedDate": "2023-07-22",
    "language": "English",
    "poster": "posters/English/Oppenheimer_(2023).jpg"
  },
  {
    "title": "Adipurush",
    "year": 2023,
    "watchedDate": "2023-06-17",
    "language": "Telugu",
    "poster": "posters/Telugu/Adipurush_(2023).jpg"
  },
  {
    "title": "Virupaksha",
    "year": 2023,
    "watchedDate": "2023-04-22",
    "language": "Telugu",
    "poster": "posters/Telugu/Virupaksha_(2023).jpg"
  },
  {
    "title": "Shaakuntalam",
    "year": 2023,
    "watchedDate": "2023-04-15",
    "language": "Telugu",
    "poster": "posters/Telugu/Shaakuntalam_(2023).jpg"
  },
  {
    "title": "Ant-Man and the Wasp: Quantumania",
    "year": 2023,
    "watchedDate": "2023-02-18",
    "language": "English",
    "poster": "posters/English/Ant_Man_and_the_Wasp_Quantumania_(2023).png"
  },
  {
    "title": "Varisu",
    "year": 2023,
    "watchedDate": "2023-01-12",
    "language": "Tamil",
    "poster": "posters/Tamil/Varisu_(2023).jpg"
  },
  {
    "title": "Sardar",
    "year": 2022,
    "watchedDate": "2022-10-22",
    "language": "Tamil",
    "poster": "posters/Tamil/Sardar_(2022).jpg"
  },
  {
    "title": "Kantara",
    "year": 2022,
    "watchedDate": "2022-10-16",
    "language": "Kannada",
    "poster": "posters/Kannada/Kantara_(2022).jpg"
  },
  {
    "title": "Oke Oka Jeevitham",
    "year": 2022,
    "watchedDate": "2022-09-10",
    "language": "Telugu",
    "poster": "posters/Telugu/Oke_Oka_Jeevitham_(2022).jpg"
  },
  {
    "title": "Sita Ramam",
    "year": 2022,
    "watchedDate": "2022-08-06",
    "language": "Telugu",
    "poster": "posters/Telugu/Sita_Ramam_(2022).jpg"
  },
  {
    "title": "Thor: Love and Thunder",
    "year": 2022,
    "watchedDate": "2022-07-09",
    "language": "English",
    "poster": "posters/English/Thor_Love_and_Thunder_(2022).jpg"
  },
  {
    "title": "Manchi Rojulochaie",
    "year": 2021,
    "watchedDate": "2021-12-25",
    "language": "Telugu",
    "poster": "posters/Telugu/Manchi_Rojulochaie_(2021).jpg"
  },
  {
    "title": "Spider-Man: No Way Home",
    "year": 2021,
    "watchedDate": "2021-12-17",
    "language": "English",
    "poster": "posters/English/Spider_Man_No_Way_Home_(2021).jpg"
  },
  {
    "title": "RED",
    "year": 2021,
    "watchedDate": "2021-01-15",
    "language": "Telugu",
    "poster": "posters/Telugu/RED_(2021).jpg"
  },
  {
    "title": "Vinaya Vidheya Rama",
    "year": 2019,
    "watchedDate": "2019-01-12",
    "language": "Telugu",
    "poster": "posters/Telugu/Vinaya_Vidheya_Rama_(2019).jpg"
  },
  {
    "title": "Mahanati",
    "year": 2018,
    "watchedDate": "2018-05-10",
    "language": "Telugu",
    "poster": "posters/Telugu/Mahanati_(2018).jpg"
  },
  {
    "title": "Rangasthalam",
    "year": 2018,
    "watchedDate": "2018-03-31",
    "language": "Telugu",
    "poster": "posters/Telugu/Rangasthalam_(2018).jpg"
  },
  {
    "title": "Baahubali 2: The Conclusion",
    "year": 2017,
    "watchedDate": "2017-04-29",
    "language": "Telugu",
    "poster": "posters/Telugu/Baahubali_2_The_Conclusion_(2017).jpg"
  },
  {
    "title": "The Fate of the Furious",
    "year": 2017,
    "watchedDate": "2017-04-15",
    "language": "English",
    "poster": "posters/English/The_Fate_of_the_Furious_(2017).png"
  },
  {
    "title": "Gautamiputra Satakarni",
    "year": 2017,
    "watchedDate": "2017-01-13",
    "language": "Telugu",
    "poster": "posters/Telugu/Gautamiputra_Satakarni_(2017).jpg"
  },
  {
    "title": "Hyper",
    "year": 2016,
    "watchedDate": "2016-09-10",
    "language": "Telugu",
    "poster": "posters/Telugu/Hyper_(2016).jpg"
  },
  {
    "title": "Baahubali: The Beginning",
    "year": 2015,
    "watchedDate": "2015-07-11",
    "language": "Telugu",
    "poster": "posters/Telugu/Baahubali_The_Beginning_(2015).jpg"
  },
  {
    "title": "Epic",
    "year": 2013,
    "watchedDate": "2013-05-25",
    "language": "English",
    "poster": "posters/English/Epic_(2013).jpg"
  },
  {
    "title": "Cameraman Gangatho Rambabu",
    "year": 2012,
    "watchedDate": "2012-10-18",
    "language": "Telugu",
    "poster": "posters/Telugu/Cameraman_Gangatho_Rambabu_(2012).jpg"
  },
  {
    "title": "Gabbar Singh",
    "year": 2012,
    "watchedDate": "2012-05-11",
    "language": "Telugu",
    "poster": "posters/Telugu/Gabbar_Singh_(2012).jpg"
  },
  {
    "title": "Dhammu",
    "year": 2012,
    "watchedDate": "2012-04-28",
    "language": "Telugu",
    "poster": "posters/Telugu/Dhammu_(2012).jpg"
  },
  {
    "title": "Racha",
    "year": 2012,
    "watchedDate": "2012-03-31",
    "language": "Telugu",
    "poster": "posters/Telugu/Racha_(2012).jpg"
  },
  {
    "title": "Journey 2: The Mysterious Island",
    "year": 2012,
    "watchedDate": "2012-02-11",
    "language": "English",
    "poster": "posters/English/Journey_2_The_Mysterious_Island_(2012).png"
  },
  {
    "title": "Shakti",
    "year": 2011,
    "watchedDate": "2011-09-24",
    "language": "Telugu",
    "poster": "posters/Telugu/Shakti_(2011).jpg"
  }
];
