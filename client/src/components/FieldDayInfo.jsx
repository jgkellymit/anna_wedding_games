import { Box, Paper, Typography } from '@mui/material';

export default function FieldDayInfo() {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      gap={3}
      sx={{ m: 1, mb: 5 }}
    >

      {/* Agenda Overview */}
      <Paper elevation={3} sx={{ p: 2, mb: 4}}>
        <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
          Field Day Agenda
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          <strong>1:00 - 1:30:</strong> Gather & Expectation Setting<br/>
          <strong>1:30 - 1:45:</strong> Name Game<br/>
          <strong>1:45 - 2:15:</strong> Grapes in Yo Mouth<br/>
          <strong>2:15 - 3:00:</strong> Flip Cup<br/>
          <strong>3:00 - 4:00:</strong> Finish the Lyric<br/>
          <strong>4:00 - 5:00:</strong> Mini Games (Spike, Disc Golf, Liars Dice, Pickleball, Speed Puzzle)<br/>
          <strong>5:00 - 5:20:</strong> Water Balloon Toss<br/>
          <strong>5:20 - 6:00:</strong> Amazing Race<br/>
          <strong>6:00 - 7:00:</strong> Relay Race (Culminating Event)
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ mb: 3, p: 2}}>
        <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
          Name Game
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          Planned time: 1:30 - 1:45, scoring begins at 10:40<br/>
          Competition type: Everyone can win<br/>
          Scoring: Anna or Pat will pick one person from each team to go around and say everyone's
          names and where they live. -10 points per errored person (aka if you miss their name and their
          location, it's still just -1). 100 points possible per team.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
          Go around in a circle and learn each other's names, where you live, and your connection to the
          bride or groom. Each subsequent person gives info for themselves, and all previous people.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
          Grapes in Yo Mouth
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          Planned time: 1:45 - 2:15<br/>
          Competition type: Tournament<br/>
          Scoring: 100, 80, 60, 50, 40, 30, 20, 10
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
          This is a 1 v 1 faceoff against a different team. Each team will get into two single file lines on
          opposite sides of a table. One line will be throwers and the others catchers. On the whistle,
          each team will proceed to ONE AT A TIME have the thrower toss a grape in the air for the
          catcher to catch.
        </Typography>
        <ul style={{ marginLeft: 20, marginTop: 10 }}>
          <li>If the catcher catches it, shout out loud the total number you have caught so far</li>
          <li>If the catcher does not catch it, you MUST find the grape on the ground, pick it up and put it in a garbage area on the table.</li>
          <li>Thrower and catcher must be at least ~2 yards apart, will be designated with cones</li>
        </ul>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
          After making the throw/catch, the thrower and the catcher go to the back of the line, switching
          spots, next time at the front the catcher will be throwing and vice versa.<br/>
          Winner is the first team to catch 10 in total.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
          Flip Cup
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          Planned time: 2:15 - 3:00<br/>
          Competition type: Tournament<br/>
          Scoring: 100, 80, 60, 50, 40, 30, 20, 10
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
          This is a 1 v 1 faceoff against a different team. 6 players from your team will line up around a
          table. Everyone needs a red solo cup with a light pour in it (you'll be drinking a lot).
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
          When we say go, the first person in line will tap their cup on the table, drink their drink, then flip
          cup. Once they've flipped successfully, the next person in line will flip their cup. Between Team
          A and Team B, the first team to flip all cups gets a point. First team to 2 points wins.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ mb: 3,   p: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
          Finish the Lyric
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          Planned time: 3:00 - 4:00<br/>
          Competition type: Everyone can win<br/>
          Scoring: 10 points per correct answer
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
          Teams will have 10 opportunities to identify the lyrics, 5 for songs Pat's selected and 5 for songs
          Anna's selected. These players will take one end of a pool noodle, stand on the edge of the
          pool, and lean back - held up by their teammate holding the other end of the noodle. A short
          section of a song will be played. When the song stops, the player must sing the following line
          of the song. If they are incorrect, they will be dropped into the pool and no points will be
          awarded. If they are correct they will earn their team 10 points.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
          Mini Games
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          Planned time: 4:00 - 5:00
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
          During a snack break, the teams will split up for a more individual portion. Each team will
          choose people to compete in each of the following games, and also grab drinks/snacks, cheer
          on your other teammates, and mingle in between.
        </Typography>
        <ul style={{ marginLeft: 20, marginTop: 10 }}>
          <li><strong>Mini Game 1: Spike</strong> — 2 people per team. Tournament. Scoring: 50, 40, 30, 20, 10, 0, 0, 0</li>
          <li><strong>Mini Game 2: Disc Golf</strong> — 2 people per team. Ranking. Scoring: 50, 40, 30, 20, 10, 0, 0, 0</li>
          <li><strong>Mini Game 3: Liars Dice</strong> — 1 person per team. Ranking. Scoring: 50, 40, 30, 20, 10, 0, 0, 0</li>
          <li><strong>Mini Game 4: Pickleball (Don't Drop)</strong> — 2 people per team. Ranking. Scoring: 50, 40, 30, 20, 10, 0, 0, 0</li>
          <li><strong>Mini Game 5: Speed Puzzle</strong> — 3 people per team. Ranking. Each team will do a 250-piece puzzle as fast as possible. Scoring: 50, 40, 30, 20, 10, 0, 0, 0</li>
        </ul>
      </Paper>

      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
          Water Balloon Toss
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          Planned time: 5:00 - 5:20<br/>
          Competition type: Ranking<br/>
          Scoring: 100, 80, 60, 50, 40, 30, 20, 10
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
          All players will pair off and line up across from their partner, 10 feet apart. When we say go, one
          player will toss a water balloon to their partner. Their partner will then toss it back. After a
          balloon is successfully thrown back and forth, one of each pair will take a step back. If the
          water balloon breaks, that pair is out and should sit down. This will continue until only one pair
          has an unbroken water balloon.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
          Points will be awarded by team (i.e., first team out gets the lowest points, last team in gets the
          highest points).
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
          Amazing Race
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          Planned time: 5:20 - 6:00<br/>
          Competition type: Tournament<br/>
          Scoring: 100, 80, 60, 50, 40, 30, 20, 10
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
          This is a 1 v 1 faceoff against a different team. 6 players from your team will line up on one half
          of a table, 3 on one side, 3 on the other. Everyone needs a red solo cup with a light pour in it.
          You're working with the person across from you.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
          When we say go, everyone on one side of the table will tap their cup on the table, drink their
          drink, then do flip cup. Once they've flipped successfully, their partner across from them will
          drink, then flip their cup into their partner's cup. The catcher can bobble the cup around as much
          as they want trying to catch it, but can't use their hands/body/anything to help get their
          partner's cup in.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
          Between Team A and Team B, the first team to have all 3 pairs finish first gets a point. First team
          to 2 points wins.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
          Relay Race
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          Planned time: 6:00 - 7:00<br/>
          Competition type: 4 teams (teams ranked 1 & 8, 2 & 7, 3 & 6, 4 & 5)<br/>
          Scoring: 400, 300, 200, 100
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
          The relay race is the big culmination of everything and your team will be paired with one other
          team based on your ranking so far. Many of the games are smaller versions of already
          completed games. You will choose people to do each of the following tasks:
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Activity (Number of People)</strong><br/>
          Wheelbarrow (2)<br/>
          Watermelon Eating Contest (1)<br/>
          Grapes (2)<br/>
          Relay Flip Cup (2)<br/>
          Pool Dive (1)<br/>
          Do Do Do Game (3)<br/>
          Disc Golf (1)<br/>
          Fire Making (4)
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ mb: 6, p: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
          Scoring Potential
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          Total Possible: 1506 Points
        </Typography>
        <ul style={{ marginLeft: 20, marginTop: 10 }}>
          <li>Assassin → Connections: 32 per person = 256</li>
          <li>Name Game: 100</li>
          <li>Grapes: 100</li>
          <li>Flip Cup: 100</li>
          <li>Finish The Lyric: 100</li>
          <li>Mini Games: 50 * 5 games = 250</li>
          <li>Water Balloon Toss: 100</li>
          <li>Amazing Race: 100</li>
          <li>Relay: 400</li>
        </ul>
      </Paper>
    </Box>
  );
}