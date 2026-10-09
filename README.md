# Arcadia-5000: Boss Fights

A large generated browser game with 5000+ lines of code featuring an epic boss fight system.

## 🎮 Game Features

### Boss Fight System
- **5 Unique Bosses** with distinct abilities:
  - ❄️ **Ice King** - Blizzard attacks
  - ⚡ **Storm Sorcerer** - Lightning chain strikes
  - 🔥 **Inferno Queen** - Meteor storms
  - 🌑 **Shadow Lord** - Shadow clones
  - 💎 **Crystal Golem** - Protective barriers

### Player Progression
- Level up by defeating bosses and gaining experience
- Improve stats: Health, Attack, Defense
- Unlock skills through combat
- Collect gold rewards from victories

### Combat System
- **Real-time Battle UI** with health bars
- **Action-based combat**: Attack, Heal, Flee
- **Special Skills** with cooldown mechanics
- **Dynamic AI** boss behaviors
- **Rich Battle Log** showing all actions

### Skills & Abilities
- **Player Skills**: Power Strike, Defensive Stance (expandable)
- **Boss Abilities**: Unique special attacks per boss type
  - Blizzard: AOE frost damage
  - Meteor Storm: High damage explosion
  - Shadow Clone: Multiplied attacks
  - Crystalline Barrier: Damage reduction
  - Lightning Chain: Multiple hits

## 🎯 How to Play

1. **Create Your Character** - Choose your adventurer's name
2. **Select a Boss** - Pick your difficulty level (1-5)
3. **Battle** - Use strategic actions to defeat the boss:
   - Attack: Deal damage
   - Heal: Restore health
   - Flee: Escape (60% success rate)
4. **Win Rewards** - Gain experience, gold, and potential item drops
5. **Continue** - Climb the difficulty ladder

## 📊 Game Balance

### Health Scaling
- Player starts with 200 HP
- Boss health scales with level (300-500+ base)
- Damage reduced by defense rating

### Combat Mechanics
- Normal attacks have variance for realism
- Boss special abilities trigger every ~3 rounds
- Critical battles occur when health < 25%
- Gold rewards: `level × 50 + random 0-200`
- Experience rewards: `level × 200 + random 0-100`

## 🛠️ Technical Architecture

### Core Classes

**Boss** - Base boss class with health, attacks, and abilities
```javascript
const boss = new IceKing(level);
boss.takeDamage(damage);
boss.useSpecialAbility();
```

**Player** - Character with stats, skills, and progression
```javascript
const player = new Player(name, maxHealth, attack, defense);
player.gainExperience(amount);
player.levelUp();
```

**Skill** - Reusable abilities with cooldowns
```javascript
const skill = new Skill(name, cooldown, effectFunction);
skill.use(player, target);
```

**BossFight** - Combat engine managing battles
```javascript
const fight = new BossFight(player, boss);
fight.playerAttack();
fight.getBattleState();
```

### File Structure
- `bossfights.js` - Core game classes and mechanics
- `game.js` - UI logic and game flow
- `index.html` - Game interface and styling

## 🎨 UI Design
- Retro cyberpunk terminal aesthetic
- Real-time health bar animations
- Color-coded UI elements (Blue: Player, Red: Boss)
- Responsive grid layout for mobile
- Battle log with color-coded entries

## 🚀 Features to Expand

- Item system with equipment
- Boss loot tables
- Multiplayer battles
- Achievement system
- Leaderboards
- Boss arena environments
- Enhanced visual effects
- Sound effects & music
- Additional boss types
- Player ability trees

## 📝 License

MIT License - See LICENSE file for details

## 🎮 Start Playing

Open `index.html` in your browser and begin your adventure!

---

**Arcadia-5000** - Where legends are born through epic boss battles.
