import { Box, Paper, Typography, Divider, Chip, Grid } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import WaterIcon from '@mui/icons-material/Water';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SportsIcon from '@mui/icons-material/Sports';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import ExtensionIcon from '@mui/icons-material/Extension';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import CasinoIcon from '@mui/icons-material/Casino';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import SportsBarIcon from '@mui/icons-material/SportsBar';


export default function FieldDayInfo() {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      gap={3}
      sx={{ m: 1, mb: 5 }}
    >
      {/* Header */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          // background: 'linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%)',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom fontWeight="bold">
          Wedding Field Day
        </Typography>
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
          Join us for a day of fun, friendly competition, and celebration!
        </Typography>
      </Paper>

      {/* Agenda Overview */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4,
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 6
          }
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <AccessTimeIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" color="primary" fontWeight="bold">
            Field Day Agenda
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {/* <Grid container spacing={2} > */}
          {/* <Grid item xs={12} md={12} width="100%"> */}
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2}}>
              <Box sx={{ lineHeight: 1.8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label="1:00 - 1:30" 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1, fontWeight: 'bold' }} 
                  />
                  <Typography component="span" sx={{ fontWeight: 'bold' }}>
                    Gather & Expectation Setting
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label="1:30 - 1:45" 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1, fontWeight: 'bold' }} 
                  />
                  <Typography component="span" sx={{ fontWeight: 'bold' }}>
                    Name Game
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label="1:45 - 2:15" 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1, fontWeight: 'bold' }} 
                  />
                  <Typography component="span" sx={{ fontWeight: 'bold' }}>
                    Grapes in Yo Mouth
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label="2:15 - 3:00" 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1, fontWeight: 'bold' }} 
                  />
                  <Typography component="span" sx={{ fontWeight: 'bold' }}>
                    Flip Cup
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label="3:00 - 4:00" 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1, fontWeight: 'bold' }} 
                  />
                  <Typography component="span" sx={{ fontWeight: 'bold' }}>
                    Finish the Lyric
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label="4:00 - 5:00" 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1, fontWeight: 'bold' }} 
                  />
                  <Typography component="span" sx={{ fontWeight: 'bold' }}>
                    Mini Games
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label="5:00 - 5:20" 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1, fontWeight: 'bold' }} 
                  />
                  <Typography component="span" sx={{ fontWeight: 'bold' }}>
                    Water Balloon Toss
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label="5:20 - 6:00" 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1, fontWeight: 'bold' }} 
                  />
                  <Typography component="span" sx={{ fontWeight: 'bold' }}>
                    Amazing Race
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="6:00 - 7:00" 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1, fontWeight: 'bold' }} 
                  />
                  <Typography component="span" sx={{ fontWeight: 'bold' }}>
                    Relay Race (Culminating Event)
                  </Typography>
                </Box>
              </Box>
            </Box>
          {/* </Grid> */}
        {/* </Grid> */}
      </Paper>

      <Paper elevation={3} sx={{ 
        mb: 3, 
        p: 3,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}>
        <Box display="flex" alignItems="center" mb={2}>
          <GroupsIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" color="primary" fontWeight="bold">
            Name Game
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ bgcolor: '#f8f8f8', p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Planned time: 1:30 - 1:45, scoring begins at 1:40
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <EmojiEventsIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Competition type: Everyone can win
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <ScoreboardIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Scoring: 100 points possible per team (-10 points per error)
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          Go around in a circle and learn each other's names, where you live, and your connection to the
          bride or groom. Each subsequent person gives info for themselves, and all previous people.
        </Typography>
      </Paper>


      <Paper elevation={3} sx={{ 
        mb: 3, 
        p: 3,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}>
        <Box display="flex" alignItems="center" mb={2}>
          <SportsIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" color="primary" fontWeight="bold">
            Grapes in Yo Mouth
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ bgcolor: '#f8f8f8', p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Planned time: 1:45 - 2:15
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <EmojiEventsIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Competition type: Tournament
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <ScoreboardIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Scoring: 100, 80, 60, 50, 40, 30, 20, 10
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          This is a 1 v 1 faceoff against a different team. Each team will get into two single file lines on
          opposite sides of a table. One line will be throwers and the others catchers. On the whistle,
          each team will proceed to ONE AT A TIME have the thrower toss a grape in the air for the
          catcher to catch.
        </Typography>
        <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: 2, my: 2 }}>
          <ul style={{ marginLeft: 20, marginTop: 10, paddingLeft: 0 }}>
            <li>If the catcher catches it, shout out loud the total number you have caught so far</li>
            <li>If the catcher does not catch it, you MUST find the grape on the ground, pick it up and put it in a garbage area on the table.</li>
            <li>Thrower and catcher must be at least ~2 yards apart, will be designated with cones</li>
          </ul>
        </Box>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          After making the throw/catch, the thrower and the catcher go to the back of the line, switching
          spots, next time at the front the catcher will be throwing and vice versa.<br/>
          Winner is the first team to catch 10 in total.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ 
        mb: 3, 
        p: 3,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}>
        <Box display="flex" alignItems="center" mb={2}>
          <LocalDrinkIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" color="primary" fontWeight="bold">
            Flip Cup
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ bgcolor: '#f8f8f8', p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Planned time: 2:15 - 3:00
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <EmojiEventsIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Competition type: Tournament
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <ScoreboardIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Scoring: 100, 80, 60, 50, 40, 30, 20, 10
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          This is a 1 v 1 faceoff against a different team. 6 players from your team will line up around a table. Everyone needs a red solo cup with a light pour in it (you'll be drinking a lot).
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7, mt: 1 }}>
          When we say go, the first person in line will tap their cup on the table, drink their drink, then flip cup. Once they've flipped successfully, the next person in line will flip their cup. Between Team A and Team B, the first team to flip all cups gets a point. First team to 2 points wins.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ 
        mb: 3, 
        p: 3,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}>
        <Box display="flex" alignItems="center" mb={2}>
          <MusicNoteIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" color="primary" fontWeight="bold">
            Finish the Lyric
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ bgcolor: '#f8f8f8', p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Planned time: 3:00 - 4:00
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <EmojiEventsIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Competition type: Everyone can win
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <ScoreboardIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Scoring: 10 points per correct answer
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          Teams will have 10 opportunities to identify the lyrics, 5 for songs Pat's selected and 5 for songs
          Anna's selected. These players will take one end of a pool noodle, stand on the edge of the
          pool, and lean back - held up by their teammate holding the other end of the noodle. A short
          section of a song will be played. When the song stops, the player must sing the following line
          of the song. If they are incorrect, they will be dropped into the pool and no points will be
          awarded. If they are correct they will earn their team 10 points.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ 
        mb: 3, 
        p: 3,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}>
        <Box display="flex" alignItems="center" mb={2}>
          <SportsEsportsIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" color="primary" fontWeight="bold">
            Mini Games
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ bgcolor: '#f8f8f8', p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Planned time: 4:00 - 5:00
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2 }}>
          During a snack break, the teams will split up for a more individual portion. Each team will
          choose people to compete in each of the following games, and also grab drinks/snacks, cheer
          on your other teammates, and mingle in between.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <SportsIcon fontSize="small" sx={{ mr: 1 }} />
                <strong>Mini Game 1: Spike</strong>
              </Typography>
              <Typography variant="body2">
                2 people per team. Tournament.<br/>
                Scoring: 50, 40, 30, 20, 10, 0, 0, 0
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <GolfCourseIcon fontSize="small" sx={{ mr: 1 }} />
                <strong>Mini Game 2: Disc Golf</strong>
              </Typography>
              <Typography variant="body2">
                2 people per team. Ranking.<br/>
                Scoring: 50, 40, 30, 20, 10, 0, 0, 0
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <CasinoIcon fontSize="small" sx={{ mr: 1 }} />
                <strong>Mini Game 3: Liars Dice</strong>
              </Typography>
              <Typography variant="body2">
                1 person per team. Ranking.<br/>
                Scoring: 50, 40, 30, 20, 10, 0, 0, 0
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <ExtensionIcon fontSize="small" sx={{ mr: 1 }} />
                <strong>Mini Game 4: Speed Puzzle</strong>
              </Typography>
              <Typography variant="body2">
                3 people per team. Ranking. Each team will do a 250-piece puzzle as fast as possible.<br/>
                Scoring: 50, 40, 30, 20, 10, 0, 0, 0
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ 
        mb: 3, 
        p: 3,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}>
        <Box display="flex" alignItems="center" mb={2}>
          <WaterIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" color="primary" fontWeight="bold">
            Water Balloon Toss
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ bgcolor: '#f8f8f8', p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Planned time: 5:00 - 5:20
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <EmojiEventsIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Competition type: Ranking
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <ScoreboardIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Scoring: 100, 80, 60, 50, 40, 30, 20, 10
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          All players will pair off and line up across from their partner, 10 feet apart. When we say go, one player will toss a water balloon to their partner. Their partner will then toss it back. After a balloon is successfully thrown back and forth, one of each pair will take a step back. If the water balloon breaks, that pair is out and should sit down. This will continue until only one pair has an unbroken water balloon.
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7, mt: 1 }}>
          Points will be awarded by team (ie first team out gets the lowest points, last team in gets the highest points).
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ 
        mb: 3, 
        p: 3,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}>
        <Box display="flex" alignItems="center" mb={2}>
          <SportsBarIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" color="primary" fontWeight="bold">
            Amazing Race
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ bgcolor: '#f8f8f8', p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Planned time: 5:20 - 6:00
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <EmojiEventsIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Competition type: Tournament
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <ScoreboardIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Scoring: 100, 80, 60, 50, 40, 30, 20, 10
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          This is a 1 v 1 faceoff against a different team. 6 players from your team will line up on one half of a table, 3 on one side, 3 on the other. Everyone needs a red solo cup with a light pour in it (you'll be drinking a lot). You're working with the person across from you.
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7, mt: 1 }}>
          When we say go, everyone on one side of the table will tap their cup on the table, drink their drink, then do flip cup. Once they've flipped successfully, their partner across from them will drink, then flip their cup into their partner's cup. The catcher can bobble the cup around as much as they want trying to catch it, but can't use their hands/body/anything to help get their partner's cup in.
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7, mt: 1 }}>
          Between Team A and Team B, the first team to have all 3 pairs finish first gets a point. First team to 2 points wins.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ 
        mb: 3, 
        p: 3,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}>
        <Box display="flex" alignItems="center" mb={2}>
          <DirectionsRunIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" color="primary" fontWeight="bold">
            Relay Race (Final Event)
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ bgcolor: '#f8f8f8', p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Planned time: 6:00 - 7:00
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <EmojiEventsIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Competition type: 4 teams (teams ranked 1 & 8, 2 & 7, 3 & 6, 4 & 5)
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <ScoreboardIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Scoring: 400, 300, 200, 100
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2 }}>
          The relay race is the big culmination of everything and your team will be paired with one other
          team based on your ranking so far. Many of the games are smaller versions of already
          completed games. You will choose people to do each of the following tasks:
        </Typography>
        <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={6} sm={4}>
              <Typography variant="body2">• Wheelbarrow (2)</Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography variant="body2">• Watermelon Eating (1)</Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography variant="body2">• Grapes (2)</Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography variant="body2">• Relay Flip Cup (2)</Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography variant="body2">• Pool Dive (1)</Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography variant="body2">• Do Do Do Game (3)</Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography variant="body2">• Disc Golf (1)</Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography variant="body2">• Fire Making (3)</Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ 
        mb: 6, 
        p: 3,
        // background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        borderRadius: 2
      }}>
        <Box display="flex" alignItems="center" mb={2}>
          <ScoreboardIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" color="primary" fontWeight="bold">
            Scoring Potential
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ lineHeight: 1.7, fontWeight: 'bold', mb: 1 }}>
          Total Possible: 1480 Points
        </Typography>
        {/* <Grid container spacing={2}> */}
          {/* <Grid item xs={12} sm={6}> */}
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <ul style={{ marginLeft: 0, paddingLeft: 20 }}>
                <li>Wedding Game/Assassin: 40 per person = 280</li>
                <li>Name Game: 100</li>
                <li>Grapes: 100</li>
                <li>Flip Cup: 100</li>
                <li>Finish The Lyric: 100</li>
                <li>Mini Games: 50 * 4 games = 200</li>
                <li>Water Balloon Toss: 100</li>
                <li>Amazing Race: 100</li>
                <li>Relay: 400</li>
              </ul>
            </Box>
          {/* </Grid> */}
        {/* </Grid> */}
      </Paper>
    </Box>
  );
}