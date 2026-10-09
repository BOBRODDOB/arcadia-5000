/**
 * Arcadia-5000 Boss Fight Game Logic
 * Handles UI updates, player interactions, and game flow
 */

let gameState = {
  player: null,
  currentBoss: null,
  currentFight: null,
  gameActive: false
};

function startGame() {
  document.getElementById('menuScreen').classList.add('hidden');
  document.getElementById('characterSetup').classList.remove('hidden');
}

function createCharacter() {
  const playerName = document.getElementById('playerName').value || 'Adventurer';

  // Create player with starting stats
  gameState.player = new Player(playerName, 200, 20, 5);

  // Add starter skills
  gameState.player.addSkill(new Skill('Power Strike', 2, (player, boss) => {
    const damage = player.attackPower * 1.5;
    boss.takeDamage(damage);
    return {
      success: true,
      message: `Landed a powerful strike for ${Math.floor(damage)} damage!`,
      damage: damage
    };
  }));

  gameState.player.addSkill(new Skill('Defensive Stance', 3, (player, boss) => {
    player.defense += 10;
    return {
      success: true,
      message: 'Defense increased by 10 for the next round!',
      effect: 'defense_boost'
    };
  }));

  document.getElementById('characterSetup').classList.add('hidden');
  document.getElementById('bossSelection').classList.remove('hidden');
}

function selectBoss(bossType, level) {
  // Create boss based on selection
  const bossMap = {
    'IceKing': () => new IceKing(level),
    'InfernoQueen': () => new InfernoQueen(level),
    'ShadowLord': () => new ShadowLord(level),
    'CrystalGolem': () => new CrystalGolem(level),
    'StormSorcerer': () => new StormSorcerer(level)
  };

  if (bossMap[bossType]) {
    gameState.currentBoss = bossMap[bossType]();
    gameState.currentFight = new BossFight(gameState.player, gameState.currentBoss);
    gameState.gameActive = true;

    document.getElementById('bossSelection').classList.add('hidden');
    document.getElementById('battleScreen').classList.remove('hidden');

    initBattleUI();
  }
}

function initBattleUI() {
  // Update player display
  updatePlayerUI();

  // Update boss display
  updateBossUI();

  // Clear battle log
  document.getElementById('battleLog').innerHTML = '';
  addBattleLog('Battle Start!', 'special');
  addBattleLog(`${gameState.player.name} faces ${gameState.currentBoss.name}!`, 'special');
}

function updatePlayerUI() {
  const player = gameState.player;
  const fight = gameState.currentFight;

  document.getElementById('playerDisplayName').textContent = player.name;
  document.getElementById('playerLevel').textContent = player.level;
  document.getElementById('playerHealthText').textContent = `${player.getHealth()}/${player.maxHealth}`;
  document.getElementById('playerAttack').textContent = player.attackPower;
  document.getElementById('playerDefense').textContent = player.defense;
  document.getElementById('playerGold').textContent = player.gold;
  document.getElementById('playerExp').textContent = player.experience;
  document.getElementById('roundCounter').textContent = `Round: ${fight.round}`;

  // Update health bar
  const healthPercent = player.getHealthPercentage();
  const healthBar = document.getElementById('playerHealthBar');
  healthBar.style.width = healthPercent + '%';
  healthBar.textContent = Math.floor(healthPercent) + '%';

  if (healthPercent > 50) {
    healthBar.className = 'health-bar normal';
  } else if (healthPercent > 25) {
    healthBar.className = 'health-bar';
    healthBar.style.background = 'linear-gradient(90deg, #ff6600, #ff8800)';
  } else {
    healthBar.className = 'health-bar critical';
  }
}

function updateBossUI() {
  const boss = gameState.currentBoss;

  document.getElementById('bossName').textContent = boss.name;
  document.getElementById('bossLevel').textContent = boss.level;
  document.getElementById('bossHealthText').textContent = `${boss.getHealth()}/${boss.maxHealth}`;
  document.getElementById('bossAttack').textContent = boss.attackPower;

  // Update health bar
  const healthPercent = boss.getHealthPercentage();
  const bossHealthBar = document.getElementById('bossHealthBar');
  bossHealthBar.style.width = healthPercent + '%';
  bossHealthBar.textContent = Math.floor(healthPercent) + '%';
}

function addBattleLog(message, type = 'normal') {
  const battleLog = document.getElementById('battleLog');
  const entry = document.createElement('div');
  entry.className = 'log-entry ' + type;
  entry.textContent = message;
  battleLog.appendChild(entry);
  battleLog.scrollTop = battleLog.scrollHeight;
}

function battleAction(action) {
  if (!gameState.gameActive) return;

  const player = gameState.player;
  const fight = gameState.currentFight;
  let result = null;

  switch (action) {
    case 'attack':
      result = fight.playerAttack();
      if (result.success) {
        addBattleLog(fight.battleLog[fight.battleLog.length - 1], 'damage');
      }
      break;

    case 'heal':
      const healAmount = 50;
      if (player.health >= player.maxHealth * 0.95) {
        addBattleLog('Already at full health!', 'normal');
        return;
      }
      result = fight.playerHeal(healAmount);
      if (result.success) {
        fight.battleLog.slice(-2).forEach(log => addBattleLog(log, 'heal'));
      }
      break;

    case 'flee':
      if (Math.random() < 0.6) {
        addBattleLog('Escaped from battle!', 'special');
        endBattle(false);
        return;
      } else {
        addBattleLog('Could not escape!', 'damage');
        result = fight.playerAttack();
      }
      break;
  }

  if (result && result.battleEnded) {
    endBattle(result.victory);
  } else {
    updatePlayerUI();
    updateBossUI();
  }
}

function endBattle(playerWon) {
  gameState.gameActive = false;
  document.getElementById('battleScreen').classList.add('hidden');

  let endContent = '';

  if (playerWon) {
    endContent = `
      <div class="victory-screen">
        <h2>🎉 VICTORY! 🎉</h2>
        <p style="font-size: 1.2em; margin: 20px 0;">You defeated the ${gameState.currentBoss.name}!</p>
        <div style="background: rgba(0, 100, 0, 0.3); border: 1px solid #00ff41; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 10px 0;">Experience Gained: <span style="color: #ffaa00;">+${gameState.currentFight.rewards.experience}</span></p>
          <p style="margin: 10px 0;">Gold Earned: <span style="color: #ffaa00;">+${gameState.currentFight.rewards.gold}</span></p>
          <p style="margin: 10px 0;">Player Level: <span style="color: #0088ff;">${gameState.player.level}</span></p>
          <p style="margin: 10px 0;">Player Health: <span style="color: #0088ff;">${gameState.player.getHealth()}/${gameState.player.maxHealth}</span></p>
        </div>
      </div>
    `;
  } else {
    endContent = `
      <div class="defeat-screen">
        <h2>💀 DEFEAT 💀</h2>
        <p style="font-size: 1.2em; margin: 20px 0;">You were defeated by the ${gameState.currentBoss.name}...</p>
        <div style="background: rgba(100, 0, 0, 0.3); border: 1px solid #ff0000; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 10px 0;">Rounds Survived: <span style="color: #ffaa00;">${gameState.currentFight.round}</span></p>
          <p style="margin: 10px 0;">Better luck next time!</p>
        </div>
      </div>
    `;
  }

  document.getElementById('endScreenContent').innerHTML = endContent;
  document.getElementById('endScreen').classList.remove('hidden');
}

function returnToMenu() {
  // Reset game state
  gameState = {
    player: gameState.player, // Keep player stats
    currentBoss: null,
    currentFight: null,
    gameActive: false
  };

  // Show boss selection again
  document.getElementById('endScreen').classList.add('hidden');
  document.getElementById('bossSelection').classList.remove('hidden');
}

// Initialize on page load
window.addEventListener('load', () => {
  console.log('Arcadia-5000: Boss Fights Loaded');
  console.log('Boss Fight System Ready!');
});
