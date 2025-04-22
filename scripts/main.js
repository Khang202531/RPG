import { system, world } from "@minecraft/server";

// 定数
const HP_OBJECTIVE = "hp";
const MP_OBJECTIVE = "mp";
const LV_OBJECTIVE = "lv";
const XP_OBJECTIVE = "xp";

const BAR_LENGTH = 20;
const BAR_CHAR = "|";

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    try {
      const identity = player.scoreboardIdentity;

      // === LV & XP取得 ===
      const lvScore = world.scoreboard.getObjective(LV_OBJECTIVE)?.getScore(identity) ?? 1;
      const xpScore = world.scoreboard.getObjective(XP_OBJECTIVE)?.getScore(identity) ?? 0;
      const xpNeeded = lvScore * 10; // 必要経験値の計算

      // === レベルアップ処理 ===
      if (xpScore >= xpNeeded && lvScore < 100) {
        world.scoreboard.getObjective(LV_OBJECTIVE)?.setScore(identity, lvScore + 1);
        world.scoreboard.getObjective(XP_OBJECTIVE)?.setScore(identity, xpScore - xpNeeded);
      }

      // === 表示用 LV 表記 ===
      const lvText = `§aLV.${lvScore} §7[${xpScore}/${xpNeeded}]`;

      // === HP処理 ===
      const HP_MAX = 5 + (lvScore * 5);
      const hpScore = world.scoreboard.getObjective(HP_OBJECTIVE)?.getScore(identity) ?? 0;
      const hpRatio = hpScore / HP_MAX;
      const filledHP = Math.round(hpRatio * BAR_LENGTH);
      const emptyHP = BAR_LENGTH - filledHP;

      let hpColor = "§a";
      if (hpRatio < 0.25) hpColor = "§c";
      else if (hpRatio < 0.5) hpColor = "§e";

      const hpBar = `${hpColor}${BAR_CHAR.repeat(filledHP)}§7${BAR_CHAR.repeat(emptyHP)}`;
      const hpText = `§f${hpScore}§7/§c${HP_MAX}`;

      // === MP処理 ===
      const MP_MAX = 10 + (lvScore * 10);
      const mpScore = world.scoreboard.getObjective(MP_OBJECTIVE)?.getScore(identity) ?? 0;
      const mpRatio = mpScore / MP_MAX;
      const filledMP = Math.round(mpRatio * BAR_LENGTH);
      const emptyMP = BAR_LENGTH - filledMP;

      const mpBar = `§9${BAR_CHAR.repeat(filledMP)}§7${BAR_CHAR.repeat(emptyMP)}`;
      const mpText = `§f${mpScore}§7/§9${MP_MAX}`;

      // === 最終表示 ===
      const barText = `${lvText} §cHP§f[${hpBar}] ${hpText} MP[${mpBar}] ${mpText}`;
      player.onScreenDisplay.setActionBar(barText);

    } catch (err) {
      console.warn(`LV/HP/MPバー表示エラー: ${err}`);
    }
  }
}, 5); // 0.25秒ごとに更新

// 1秒ごとにHP回復処理
system.runInterval(() => {
  for (const player of world.getPlayers()) {
    try {
      const identity = player.scoreboardIdentity;

      const lvScore = world.scoreboard.getObjective("lv")?.getScore(identity) ?? 1;
      const hpObjective = world.scoreboard.getObjective("hp");
      if (!hpObjective) continue;

      const hpScore = hpObjective.getScore(identity) ?? 0;
      const HP_MAX = 5 + (lvScore * 5);
      const healAmount = 5;

      // HPが最大未満のときのみ回復
      if (hpScore < HP_MAX) {
        const newHP = Math.min(hpScore + healAmount, HP_MAX);
        hpObjective.setScore(identity, newHP);
      }

    } catch (err) {
      console.warn(`HP自動回復エラー: ${err}`);
    }
  }
}, 20); // 1秒ごとに実行（20tick）
