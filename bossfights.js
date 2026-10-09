/**
 * Boss Fight System for Arcadia-5000
 * Includes multiple boss types, combat mechanics, and rewards
 */

class Boss {
  constructor(name, level, maxHealth, attackPower, specialAbility) {
    this.name = name;
    this.level = level;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.attackPower = attackPower;
    this.specialAbility = specialAbility;
    this.isDefeated = false;
    this.actionQueue = [];
  }

  takeDamage(damage) {
    const actualDamage = Math.max(1, damage - Math.floor(this.level * 0.5));
    this.health -= actualDamage;
    return actualDamage;
  }

  getHealth() {
    return Math.max(0, this.health);
  }

  getHealthPercentage() {
    return (this.getHealth() / this.maxHealth) * 100;
  }

  isAlive() {
    return this.health > 0;
  }

  attack() {
    const variance = this.attackPower * 0.2;
    const damage = this.attackPower + (Math.random() - 0.5) * variance * 2;
    return Math.floor(damage);
  }

  useSpecialAbility() {
    return this.specialAbility.execute(this);
  }
}

class Player {
  constructor(name, maxHealth, attackPower, defense) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.attackPower = attackPower;
    this.defense = defense;
    this.level = 1;
    this.experience = 0;
    this.gold = 0;
    this.skills = [];
  }

  takeDamage(bossDamage) {
    const reducedDamage = Math.max(1, bossDamage - this.defense);
    this.health -= reducedDamage;
    return reducedDamage;
  }

  healHealth(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  getHealth() {
    return Math.max(0, this.health);
  }

  getHealthPercentage() {
    return (this.getHealth() / this.maxHealth) * 100;
  }

  isAlive() {
    return this.health > 0;
  }

  attack() {
    const variance = this.attackPower * 0.3;
    const damage = this.attackPower + (Math.random() - 0.5) * variance * 2;
    return Math.floor(damage);
  }

  gainExperience(amount) {
    this.experience += amount;
    const expNeeded = 100 * this.level;
    if (this.experience >= expNeeded) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.experience = 0;
    this.maxHealth += 50;
    this.health = this.maxHealth;
    this.attackPower += 10;
    this.defense += 2;
  }

  addGold(amount) {
    this.gold += amount;
  }

  addSkill(skill) {
    this.skills.push(skill);
  }
}

class Skill {
  constructor(name, cooldown, effect) {
    this.name = name;
    this.cooldown = cooldown;
    this.currentCooldown = 0;
    this.effect = effect;
  }

  use(player, target) {
    if (this.currentCooldown > 0) {
      return { success: false, message: `${this.name} is on cooldown for ${this.currentCooldown} more turns.` };
    }
    const result = this.effect(player, target);
    this.currentCooldown = this.cooldown;
    return result;
  }

  reduceCooldown() {
    if (this.currentCooldown > 0) {
      this.currentCooldown--;
    }
  }

  isReady() {
    return this.currentCooldown === 0;
  }
}

class SpecialAbility {
  constructor(name, cooldown, effect) {
    this.name = name;
    this.cooldown = cooldown;
    this.turnCounter = 0;
  }

  execute(boss) {
    return this.effect(boss);
  }
}

// Boss Types
class IceKing extends Boss {
  constructor(level) {
    const ability = new SpecialAbility('Blizzard', 3, (boss) => {
      return {
        name: 'Blizzard',
        damage: boss.attackPower * 1.5,
        description: 'The Ice King summons a devastating blizzard!'
      };
    });
    super('Ice King', level, 300 + level * 50, 45 + level * 5, ability);
  }
}

class InfernoQueen extends Boss {
  constructor(level) {
    const ability = new SpecialAbility('Meteor Storm', 3, (boss) => {
      return {
        name: 'Meteor Storm',
        damage: boss.attackPower * 1.8,
        description: 'The Inferno Queen unleashes meteors from the sky!'
      };
    });
    super('Inferno Queen', level, 350 + level * 60, 55 + level * 6, ability);
  }
}

class ShadowLord extends Boss {
  constructor(level) {
    const ability = new SpecialAbility('Shadow Clone', 2, (boss) => {
      return {
        name: 'Shadow Clone',
        damage: boss.attackPower * 2.0,
        description: 'The Shadow Lord splits into clones, multiplying attacks!'
      };
    });
    super('Shadow Lord', level, 400 + level * 70, 60 + level * 7, ability);
  }
}

class CrystalGolem extends Boss {
  constructor(level) {
    const ability = new SpecialAbility('Crystalline Barrier', 4, (boss) => {
      return {
        name: 'Crystalline Barrier',
        damage: boss.attackPower * 0.5,
        shield: boss.maxHealth * 0.3,
        description: 'The Crystal Golem forms a protective barrier!'
      };
    });
    super('Crystal Golem', level, 500 + level * 80, 35 + level * 3, ability);
  }
}

class StormSorcerer extends Boss {
  constructor(level) {
    const ability = new SpecialAbility('Lightning Chain', 2, (boss) => {
      return {
        name: 'Lightning Chain',
        damage: boss.attackPower * 1.3,
        hits: Math.floor(Math.random() * 3) + 2,
        description: 'The Storm Sorcerer unleashes chained lightning strikes!'
      };
    });
    super('Storm Sorcerer', level, 280 + level * 45, 65 + level * 8, ability);
  }
}

// Boss Fight Engine
class BossFight {
  constructor(player, boss) {
    this.player = player;
    this.boss = boss;
    this.round = 0;
    this.battleLog = [];
    this.combatActive = true;
    this.rewards = {
      experience: boss.level * 200 + Math.floor(Math.random() * 100),
      gold: boss.level * 50 + Math.floor(Math.random() * 200),
      itemDropChance: Math.random() > 0.5
    };
  }

  addLog(message) {
    this.battleLog.push(`[Round ${this.round}] ${message}`);
  }

  playerAttack() {
    if (!this.combatActive) return { success: false };

    const playerDamage = this.player.attack();
    const actualDamage = this.boss.takeDamage(playerDamage);
    this.addLog(`${this.player.name} attacks for ${actualDamage} damage!`);

    if (!this.boss.isAlive()) {
      this.endFight(true);
      return { success: true, battleEnded: true, victory: true };
    }

    this.executeBossAction();
    this.round++;

    return { success: true, battleEnded: false };
  }

  playerUseSkill(skillIndex) {
    if (!this.combatActive || skillIndex >= this.player.skills.length) {
      return { success: false };
    }

    const skill = this.player.skills[skillIndex];
    const result = skill.use(this.player, this.boss);

    if (!result.success) {
      this.addLog(result.message);
      return result;
    }

    this.addLog(`${this.player.name} uses ${skill.name}!`);

    if (!this.boss.isAlive()) {
      this.endFight(true);
      return { success: true, battleEnded: true, victory: true };
    }

    this.executeBossAction();
    this.round++;

    return { success: true, battleEnded: false };
  }

  playerHeal(amount) {
    if (!this.combatActive) return { success: false };

    this.player.healHealth(amount);
    this.addLog(`${this.player.name} heals for ${amount} health!`);

    this.executeBossAction();
    this.round++;

    return { success: true, battleEnded: false };
  }

  executeBossAction() {
    // Boss decides between normal attack or special ability
    const useSpecial = Math.random() < 0.3 && this.round % 3 === 0;

    let bossAction;
    if (useSpecial) {
      bossAction = this.boss.useSpecialAbility();
      this.addLog(`🔥 ${bossAction.description}`);
      this.addLog(`${this.boss.name} deals ${Math.floor(bossAction.damage)} damage with ${bossAction.name}!`);
    } else {
      bossAction = { damage: this.boss.attack() };
      this.addLog(`${this.boss.name} attacks for ${bossAction.damage} damage!`);
    }

    const damageToPlayer = this.player.takeDamage(bossAction.damage);

    if (!this.player.isAlive()) {
      this.endFight(false);
    }
  }

  endFight(playerWon) {
    this.combatActive = false;

    if (playerWon) {
      this.addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.addLog(`🎉 VICTORY! ${this.player.name} defeated the ${this.boss.name}!`);
      this.player.gainExperience(this.rewards.experience);
      this.player.addGold(this.rewards.gold);
      this.addLog(`+${this.rewards.experience} Experience gained!`);
      this.addLog(`+${this.rewards.gold} Gold earned!`);
      if (this.rewards.itemDropChance) {
        this.addLog('🎁 A legendary item drops from the boss!');
      }
    } else {
      this.addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.addLog(`💀 DEFEAT! ${this.player.name} was defeated by the ${this.boss.name}.`);
      this.addLog('Better luck next time!');
    }
  }

  getBattleState() {
    return {
      round: this.round,
      playerHealth: this.player.getHealth(),
      playerMaxHealth: this.player.maxHealth,
      playerHealthPercent: this.player.getHealthPercentage(),
      bossHealth: this.boss.getHealth(),
      bossMaxHealth: this.boss.maxHealth,
      bossHealthPercent: this.boss.getHealthPercentage(),
      bossName: this.boss.name,
      combatActive: this.combatActive,
      battleLog: this.battleLog
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Boss, Player, Skill, SpecialAbility, BossFight,
    IceKing, InfernoQueen, ShadowLord, CrystalGolem, StormSorcerer
  };
}
