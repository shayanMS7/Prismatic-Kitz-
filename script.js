document.getElementById('yr').textContent = new Date().getFullYear();

/* ---- Team lists (edit freely) ---- */
const TEAMS = {
  Soccer: {
    "Clubs": ["Arsenal","Aston Villa","Chelsea","Liverpool","Manchester City","Manchester United","Newcastle United","Nottingham Forest","Tottenham Hotspur","Real Madrid","FC Barcelona","Atlético Madrid","Bayern Munich","Borussia Dortmund","Paris Saint-Germain","Juventus","AC Milan","Inter Milan","Napoli","AS Roma","Benfica","Porto","Ajax","Celtic","Al Nassr","Inter Miami","Toronto FC","CF Montréal","Vancouver Whitecaps","LA Galaxy"],
    "National teams": ["Canada","Argentina","Brazil","Portugal","France","England","Spain","Germany","Italy","Netherlands","Belgium","Croatia","Morocco","Mexico","USA","Japan","Pakistan","India"]
  },
  Basketball: {"NBA": ["Atlanta Hawks","Boston Celtics","Brooklyn Nets","Charlotte Hornets","Chicago Bulls","Cleveland Cavaliers","Dallas Mavericks","Denver Nuggets","Detroit Pistons","Golden State Warriors","Houston Rockets","Indiana Pacers","LA Clippers","Los Angeles Lakers","Memphis Grizzlies","Miami Heat","Milwaukee Bucks","Minnesota Timberwolves","New Orleans Pelicans","New York Knicks","Oklahoma City Thunder","Orlando Magic","Philadelphia 76ers","Phoenix Suns","Portland Trail Blazers","Sacramento Kings","San Antonio Spurs","Toronto Raptors","Utah Jazz","Washington Wizards"]},
  Baseball: {"MLB": ["Arizona Diamondbacks","Athletics","Atlanta Braves","Baltimore Orioles","Boston Red Sox","Chicago Cubs","Chicago White Sox","Cincinnati Reds","Cleveland Guardians","Colorado Rockies","Detroit Tigers","Houston Astros","Kansas City Royals","Los Angeles Angels","Los Angeles Dodgers","Miami Marlins","Milwaukee Brewers","Minnesota Twins","New York Mets","New York Yankees","Philadelphia Phillies","Pittsburgh Pirates","San Diego Padres","San Francisco Giants","Seattle Mariners","St. Louis Cardinals","Tampa Bay Rays","Texas Rangers","Toronto Blue Jays","Washington Nationals"]},
  Hockey: {"NHL": ["Anaheim Ducks","Boston Bruins","Buffalo Sabres","Calgary Flames","Carolina Hurricanes","Chicago Blackhawks","Colorado Avalanche","Columbus Blue Jackets","Dallas Stars","Detroit Red Wings","Edmonton Oilers","Florida Panthers","Los Angeles Kings","Minnesota Wild","Montréal Canadiens","Nashville Predators","New Jersey Devils","New York Islanders","New York Rangers","Ottawa Senators","Philadelphia Flyers","Pittsburgh Penguins","San Jose Sharks","Seattle Kraken","St. Louis Blues","Tampa Bay Lightning","Toronto Maple Leafs","Utah Mammoth","Vancouver Canucks","Vegas Golden Knights","Washington Capitals","Winnipeg Jets"]},
  Football: {"NFL": ["Arizona Cardinals","Atlanta Falcons","Baltimore Ravens","Buffalo Bills","Carolina Panthers","Chicago Bears","Cincinnati Bengals","Cleveland Browns","Dallas Cowboys","Denver Broncos","Detroit Lions","Green Bay Packers","Houston Texans","Indianapolis Colts","Jacksonville Jaguars","Kansas City Chiefs","Las Vegas Raiders","Los Angeles Chargers","Los Angeles Rams","Miami Dolphins","Minnesota Vikings","New England Patriots","New Orleans Saints","New York Giants","New York Jets","Philadelphia Eagles","Pittsburgh Steelers","San Francisco 49ers","Seattle Seahawks","Tampa Bay Buccaneers","Tennessee Titans","Washington Commanders"]}
};
/* Prices in CAD */
const PRICES = {Soccer:60, Basketball:75, Baseball:75, Hockey:85, Football:75};
const OTHER = "Other team (type it in)";

/* Sizes offered in the form for each sport (match the size guide) */
const SIZES = {
  Soccer: {"Adult": ["S","M","L","XL","2XL","3XL","4XL"], "Kids": ["16 (age 3–4)","18 (age 4–5)","22 (age 6–7)","24 (age 8–9)","26 (age 10–11)","28 (age 12–13)"]},
  Basketball: {"Adult": ["S / 44","M / 48","L / 50","XL / 52","2XL / 54"]},
  Hockey: {"Adult": ["48 / S","50 / M","52 / L","54 / XL","56 / 2XL","58 / 3XL","60 / 4XL"], "Youth": ["Youth S/M","Youth L/XL"]},
  Baseball: {"Men's": ["46 / S","48 / M","50 / L","52 / XL","54 / 2XL","56 / 3XL","58 / 4XL"], "Women's": ["Women's S","Women's M","Women's L","Women's XL"], "Youth": ["Youth S (6–8)","Youth M (10–12)","Youth L (14–16)","Youth XL (16–18)"]},
  Football: {"Adult": ["40 / M","44 / L","48 / XL","52 / 2XL","56 / 3XL"]}
};
/* Which size-guide tab each sport opens */
const GUIDE_TAB = {Soccer:"soccer", Basketball:"basketball", Hockey:"hockey", Baseball:"baseball", Football:"football"};

function fillSizes(s){
  const sel = document.getElementById('size');
  sel.innerHTML = '<option value="">Choose a size</option>';
  for (const [group, list] of Object.entries(SIZES[s] || {})) {
    const og = document.createElement('optgroup'); og.label = group;
    list.forEach(v => og.append(new Option(v, v)));
    sel.append(og);
  }
  sel.append(new Option('Not sure, help me pick', 'Not sure, help me pick'));
}

/* Size guide tabs */
function showChart(key){
  document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', t.dataset.chart === key));
  document.querySelectorAll('.chart').forEach(c => c.classList.toggle('active', c.id === 'chart-' + key));
}
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => showChart(t.dataset.chart)));
document.querySelectorAll('[data-size-guide]').forEach(a => a.addEventListener('click', e => {
  const key = GUIDE_TAB[document.getElementById('sport').value] || 'soccer';
  if (document.getElementById('chart-' + key)) {   // already on the size guide page
    e.preventDefault(); showChart(key); document.getElementById('request').close();
  } else {
    a.target = '_blank'; a.href = 'sizes.html#' + key;   // open in a new tab so the form isn't lost
  }
}));
const startKey = location.hash.slice(1);
if (document.getElementById('chart-' + startKey)) showChart(startKey);

const $ = id => document.getElementById(id);
const dlg = $('request'), form = $('reqForm');
const show = (el, on) => { el.classList.toggle('hidden', !on); if (on) el.classList.add('reveal'); };

document.querySelectorAll('[data-open-request]').forEach(b => b.addEventListener('click', () => {
  $('formView').classList.remove('hidden'); $('doneView').classList.add('hidden');
  dlg.showModal();
}));
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => dlg.close()));
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

$('sport').addEventListener('change', e => {
  const s = e.target.value, isCustom = s === 'Custom order', hasTeams = !!TEAMS[s];
  const team = $('team');
  team.innerHTML = '<option value="">Choose a team</option>';
  if (hasTeams) {
    for (const [group, list] of Object.entries(TEAMS[s])) {
      const og = document.createElement('optgroup'); og.label = group;
      list.forEach(t => og.append(new Option(t, t)));
      team.append(og);
    }
    team.append(new Option(OTHER, OTHER));
    fillSizes(s);
  }
  show($('teamWrap'), hasTeams);
  show($('otherTeamWrap'), false);
  show($('detailsWrap'), hasTeams);
  show($('customWrap'), isCustom);
  updateQuote();
});
$('team').addEventListener('change', e => show($('otherTeamWrap'), e.target.value === OTHER));
form.querySelectorAll('input[name="delivery"]').forEach(r => r.addEventListener('change', updateQuote));

function updateQuote(){
  const p = PRICES[$('sport').value];
  const ship = form.delivery.value.startsWith('Ship') ? 10 : 0;
  show($('quote'), typeof p === 'number');
  if (typeof p === 'number') $('quoteAmt').textContent = '$' + (p + ship) + ' CAD';
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const err = $('err'), s = $('sport').value;
  let msg = '';
  if (!s) msg = 'Please choose a sport.';
  else if (TEAMS[s] && !$('team').value) msg = 'Please choose a team.';
  else if ($('team').value === OTHER && !$('otherTeam').value.trim()) msg = 'Please type in the team you want.';
  else if (s === 'Custom order' && !$('custom').value.trim()) msg = 'Please tell us what you\'re looking for.';
  else if (TEAMS[s] && !$('size').value) msg = 'Please choose a size.';
  else if (!$('cname').value.trim()) msg = 'Please add your name.';
  else if (!$('email').value.trim() && !$('phone').value.trim()) msg = 'Please add an email or phone number so we can reach you.';
  else if ($('email').value.trim() && !$('email').checkValidity()) msg = 'That email doesn\'t look quite right.';
  err.textContent = msg; show(err, !!msg);
  if (msg) return;

  const btn = $('submitBtn'); btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams(new FormData(form)).toString()
    });
    if (!res.ok) throw new Error();
    form.reset(); ['teamWrap','otherTeamWrap','detailsWrap','customWrap','quote'].forEach(id => show($(id), false));
    $('formView').classList.add('hidden'); $('doneView').classList.remove('hidden');
  } catch {
    err.textContent = 'Something went wrong sending your request. Please try again, or DM us on Instagram @prismatic.kitz.';
    show(err, true);
  } finally {
    btn.disabled = false; btn.textContent = 'Send request';
  }
});

/* Mobile menu */
(() => {
  const nav = document.querySelector('nav'), btn = document.querySelector('.menu-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); btn.setAttribute('aria-expanded', false);
  }));
})();
