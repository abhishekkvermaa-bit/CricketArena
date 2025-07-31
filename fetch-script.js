const fs = require('fs');

const playerNames = [
  'Virat Kohli', 'Rohit Sharma', 'MS Dhoni', 'Sachin Tendulkar', 'Yuvraj Singh',
  'Virender Sehwag', 'Gautam Gambhir', 'Suresh Raina', 'Zaheer Khan', 'Harbhajan Singh',
  'Ravichandran Ashwin', 'Ravindra Jadeja', 'Jasprit Bumrah', 'KL Rahul', 'Shikhar Dhawan',
  'Hardik Pandya', 'Rishabh Pant', 'Shreyas Iyer', 'Mohammed Shami', 'Bhuvneshwar Kumar',
  'Ajinkya Rahane', 'Cheteshwar Pujara', 'Ishant Sharma', 'Suryakumar Yadav', 'Yuzvendra Chahal',
  'Kuldeep Yadav', 'Shubman Gill', 'Axar Patel', 'Mohammed Siraj', 'Sanju Samson',
  'Steve Smith', 'David Warner', 'Pat Cummins', 'Glenn Maxwell', 'Mitchell Starc',
  'Ricky Ponting', 'Michael Clarke', 'Shane Watson', 'Mitchell Johnson', 'Michael Hussey',
  'Josh Hazlewood', 'Aaron Finch', 'Nathan Lyon', 'Usman Khawaja', 'Travis Head',
  'Marnus Labuschagne', 'Matthew Wade', 'Marcus Stoinis', 'Adam Zampa', 'Mitchell Marsh',
  'Chris Lynn', 'Cameron Green', 'Ben Stokes', 'Joe Root', 'Jos Buttler',
  'James Anderson', 'Stuart Broad', 'Kevin Pietersen', 'Alastair Cook', 'Eoin Morgan',
  'Jonny Bairstow', 'Moeen Ali', 'Chris Woakes', 'Adil Rashid', 'Jason Roy',
  'Mark Wood', 'Dawid Malan', 'Liam Livingstone', 'Sam Curran', 'Jofra Archer',
  'Harry Brook', 'Reece Topley', 'Phil Salt', 'Zak Crawley', 'AB de Villiers',
  'Dale Steyn', 'Hashim Amla', 'Faf du Plessis', 'Quinton de Kock', 'Kagiso Rabada',
  'Jacques Kallis', 'Graeme Smith', 'Morne Morkel', 'Imran Tahir', 'David Miller',
  'Aiden Markram', 'Lungi Ngidi', 'Anrich Nortje', 'Rassie van der Dussen', 'Heinrich Klaasen',
  'Tabraiz Shamsi', 'Keshav Maharaj', 'Marco Jansen', 'Vernon Philander', 'Kane Williamson',
  'Brendon McCullum', 'Ross Taylor', 'Trent Boult', 'Tim Southee', 'Martin Guptill',
  'Daniel Vettori', 'Mitchell Santner', 'Tom Latham', 'Devon Conway', 'Daryl Mitchell',
  'Lockie Ferguson', 'Ish Sodhi', 'Colin de Grandhomme', 'Glenn Phillips', 'BJ Watling',
  'Colin Munro', 'Kyle Jamieson', 'Rachin Ravindra', 'Finn Allen', 'Babar Azam',
  'Shaheen Afridi', 'Mohammad Rizwan', 'Misbah-ul-Haq', 'Younis Khan', 'Shahid Afridi',
  'Saeed Ajmal', 'Mohammad Hafeez', 'Shoaib Malik', 'Mohammad Amir', 'Sarfaraz Ahmed',
  'Shadab Khan', 'Fakhar Zaman', 'Haris Rauf', 'Naseem Shah', 'Hasan Ali',
  'Azhar Ali', 'Imam-ul-Haq', 'Asif Ali', 'Iftikhar Ahmed', 'Chris Gayle',
  'Dwayne Bravo', 'Kieron Pollard', 'Sunil Narine', 'Andre Russell', 'Jason Holder',
  'Shivnarine Chanderpaul', 'Darren Sammy', 'Nicholas Pooran', 'Shimron Hetmyer', 'Shai Hope',
  'Evin Lewis', 'Rovman Powell', 'Alzarri Joseph', 'Carlos Brathwaite', 'Brandon King',
  'Akeal Hosein', 'Kumar Sangakkara', 'Mahela Jayawardene', 'Lasith Malinga', 'Tillakaratne Dilshan',
  'Angelo Mathews', 'Rangana Herath', 'Wanindu Hasaranga', 'Dasun Shanaka', 'Thisara Perera',
  'Kusal Perera', 'Kusal Mendis', 'Dimuth Karunaratne', 'Dushmantha Chameera', 'Pathum Nissanka',
  'Maheesh Theekshana', 'Matheesha Pathirana', 'Bhanuka Rajapaksa', 'Niroshan Dickwella', 'Shakib Al Hasan',
  'Tamim Iqbal', 'Mushfiqur Rahim', 'Mahmudullah', 'Mashrafe Mortaza', 'Mustafizur Rahman',
  'Litton Das', 'Taskin Ahmed', 'Mehidy Hasan Miraz', 'Soumya Sarkar', 'Najmul Hossain Shanto',
  'Shoriful Islam', 'Rashid Khan', 'Mohammad Nabi', 'Mujeeb Ur Rahman', 'Rahmanullah Gurbaz',
  'Naveen-ul-Haq', 'Ibrahim Zadran', 'Hazratullah Zazai', 'Sikandar Raza', 'Brendan Taylor',
  'Sean Williams', 'Craig Ervine', 'Blessing Muzarabani', 'Paul Stirling', 'Andy Balbirnie',
  "Kevin O'Brien", 'Harry Tector', 'Joshua Little', 'Sandeep Lamichhane', 'Ryan ten Doeschate'
];

const API_KEY = '20fc158ca7msha85acf70ccb89eap1eaa7djsn55dd8c9b9b2c';
const API_HOST = 'cricbuzz-cricket.p.rapidapi.com';

const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST,
  },
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// --- NEW: Helper function to simplify the stats data ---
function transformStats(statsData) {
  if (!statsData || !statsData.headers || !statsData.values) {
    return {};
  }

  const simplifiedStats = {};
  const headers = statsData.headers.slice(1); // Skip the "ROWHEADER"

  headers.forEach((format, index) => {
    simplifiedStats[format] = {};
    statsData.values.forEach(statRow => {
      const statName = statRow.values[0];
      const statValue = statRow.values[index + 1];
      simplifiedStats[format][statName] = statValue;
    });
  });

  return simplifiedStats;
}
// --------------------------------------------------------

async function fetchAllData() {
  const allPlayerData = [];

  for (const playerName of playerNames) {
    try {
      console.log(`Fetching data for ${playerName}...`);

      const searchUrl = `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/search?plrN=${encodeURIComponent(playerName)}`;
      const searchResponse = await fetch(searchUrl, options);
      const searchResult = await searchResponse.json();

      if (!searchResult.player || searchResult.player.length === 0) {
        console.log(`-- Could not find player: ${playerName}`);
        continue;
      }

      const playerId = searchResult.player[0].id;
      
      const infoUrl = `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${playerId}`;
      const battingUrl = `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${playerId}/batting`;
      const bowlingUrl = `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${playerId}/bowling`;

      const [infoRes, battingRes, bowlingRes] = await Promise.all([
        fetch(infoUrl, options),
        fetch(battingUrl, options),
        fetch(bowlingUrl, options),
      ]);

      const info = await infoRes.json();
      const batting = await battingRes.json();
      const bowling = await bowlingRes.json();

      const imageId = info.faceImageId;

      const playerData = {
        id: info.id,
        name: info.name,
        imageUrl: `https://cricbuzz-cricket.p.rapidapi.com/img/v1/i1/c${imageId}/i.jpg?p=det`,
        info,
        // --- Use our new helper function to clean the data ---
        battingStats: transformStats(batting),
        bowlingStats: transformStats(bowling),
      };

      allPlayerData.push(playerData);
      console.log(`-- Successfully fetched data for ${playerName}`);

      await delay(1000);

    } catch (error) {
      console.error(`-- Failed to fetch data for ${playerName}:`, error.message);
    }
  }

  fs.writeFileSync('playerData.json', JSON.stringify(allPlayerData, null, 2));
  console.log('\nAll done! Data saved to playerData.json');
}

fetchAllData();