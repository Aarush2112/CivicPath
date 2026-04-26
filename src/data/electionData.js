export const electionData = {
  "california": {
    "name": "California",
    "registration_deadline": "October 21, 2026",
    "early_voting_start": "October 5, 2026",
    "early_voting_end": "November 2, 2026",
    "mail_ballot_request_deadline": "October 27, 2026",
    "election_day": "November 3, 2026",
    "certification_deadline": "December 3, 2026",
    "official_sources": [
      { "name": "California Secretary of State", "url": "https://www.sos.ca.gov/elections" },
      { "name": "Voter Status Tool", "url": "https://voterstatus.sos.ca.gov/" }
    ],
    "voting_methods": {
      "mail": "Every active registered voter will be mailed a ballot starting 29 days before Election Day.",
      "in_person": "You can vote in person at any voting center in your county.",
      "early": "Early voting is available starting 29 days before the election."
    }
  },
  "texas": {
    "name": "Texas",
    "registration_deadline": "October 5, 2026",
    "early_voting_start": "October 19, 2026",
    "early_voting_end": "October 30, 2026",
    "mail_ballot_request_deadline": "October 23, 2026",
    "election_day": "November 3, 2026",
    "certification_deadline": "December 3, 2026",
    "official_sources": [
      { "name": "Texas Secretary of State", "url": "https://www.sos.state.tx.us/elections/index.shtml" },
      { "name": "VoteTexas.gov", "url": "https://www.votetexas.gov/" }
    ],
    "voting_methods": {
      "mail": "Absentee voting is available for voters who meet specific eligibility requirements.",
      "in_person": "Voters must present an acceptable form of photo ID at the polls.",
      "early": "Early voting is available at designated locations in each county."
    }
  },
  "new_york": {
    "name": "New York",
    "registration_deadline": "October 9, 2026",
    "early_voting_start": "October 24, 2026",
    "early_voting_end": "November 1, 2026",
    "mail_ballot_request_deadline": "October 27, 2026",
    "election_day": "November 3, 2026",
    "certification_deadline": "December 7, 2026",
    "official_sources": [
      { "name": "NY State Board of Elections", "url": "https://www.elections.ny.gov/" },
      { "name": "NY Voter Registration Search", "url": "https://voterlookup.elections.ny.gov/" }
    ],
    "voting_methods": {
      "mail": "You can request an absentee ballot online, by mail, or in person.",
      "in_person": "Polls are open from 6 AM to 9 PM on Election Day.",
      "early": "Early voting is available for 9 days prior to the election."
    }
  },
  "florida": {
    "name": "Florida",
    "registration_deadline": "October 5, 2026",
    "early_voting_start": "October 24, 2026",
    "early_voting_end": "October 31, 2026",
    "mail_ballot_request_deadline": "October 24, 2026",
    "election_day": "November 3, 2026",
    "certification_deadline": "November 17, 2026",
    "official_sources": [
      { "name": "Florida Division of Elections", "url": "https://dos.myflorida.com/elections/" },
      { "name": "Check Your Voter Status", "url": "https://registration.elections.myflorida.com/CheckVoterStatus" }
    ],
    "voting_methods": {
      "mail": "All registered voters are eligible to vote by mail. Requests must be received by the deadline.",
      "in_person": "You must bring a valid photo ID with a signature to the polls.",
      "early": "Early voting is required for at least 8 days, starting 10 days before the election."
    }
  },
  "pennsylvania": {
    "name": "Pennsylvania",
    "registration_deadline": "October 19, 2026",
    "early_voting_start": "September 14, 2026",
    "early_voting_end": "October 27, 2026",
    "mail_ballot_request_deadline": "October 27, 2026",
    "election_day": "November 3, 2026",
    "certification_deadline": "November 23, 2026",
    "official_sources": [
      { "name": "PA Department of State", "url": "https://www.vote.pa.gov/" },
      { "name": "PA Voter Information", "url": "https://www.pavoterservices.pa.gov/" }
    ],
    "voting_methods": {
      "mail": "Pennsylvania offers no-excuse mail-in balloting for all registered voters.",
      "in_person": "Polls are open from 7 AM to 8 PM on Election Day.",
      "early": "Pennsylvania does not have traditional early voting, but you can vote by mail-in ballot in person at your county election office."
    }
  }
};

export const generalFAQs = [
  {
    "q": "What is voter registration?",
    "a": "Voter registration is the process that allows eligible citizens to sign up to vote in elections. Requirements and deadlines vary by state."
  },
  {
    "q": "What is early voting?",
    "a": "Early voting allows you to cast your ballot in person before Election Day at designated locations. It helps avoid long lines and provides more flexibility."
  },
  {
    "q": "Why do results take time to count?",
    "a": "Election officials must verify every ballot, including those sent by mail or cast provisionally. This careful process ensures accuracy and integrity, which can take several days or weeks."
  }
];

export const glossary = [
  { "term": "Ballot", "definition": "A document used to cast a vote in an election." },
  { "term": "Precinct", "definition": "A specific geographic area that determines where you go to vote." },
  { "term": "Certification", "definition": "The formal process of confirming the final and official results of an election." },
  { "term": "Provisional Ballot", "definition": "A ballot used when there are questions about a voter's eligibility, which is counted after verification." }
];
