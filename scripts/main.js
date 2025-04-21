import { system, world } from "@minecraft/server";
//変数
const HP_OBJECTIVE = "hp";
const HP_MAX = 20;

const MP_OBJECTIVE = "mp";
const MP_MAX = 100;

const LEVER_OBJECTIVE = "lv";
const LEVER_MAX = 100;

const BAR_CHAR = "|";
const BAR_LENGTH = 20;

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    try {
      const identity = player.scoreboardIdentity;

      // === HPスコア取得 ===
      const hpScore = world.scoreboard.getObjective(HP_OBJECTIVE)?.getScore(identity) ?? 0;
      const hpRatio = hpScore / HP_MAX;
      const filledHP = Math.round(hpRatio * BAR_LENGTH);
      const emptyHP = BAR_LENGTH - filledHP;

      let hpColor = "§a";
      if (hpRatio < 0.25) hpColor = "§c";
      else if (hpRatio < 0.5) hpColor = "§e";

      const hpBar = `${hpColor}${BAR_CHAR.repeat(filledHP)}§7${BAR_CHAR.repeat(emptyHP)}`;
      const hpText = `§f${hpScore}§7/§c${HP_MAX}`;

      // === MPスコア取得 ===
      const mpScore = world.scoreboard.getObjective(MP_OBJECTIVE)?.getScore(identity) ?? 0;
      const mpRatio = mpScore / MP_MAX;
      const filledMP = Math.round(mpRatio * BAR_LENGTH);
      const emptyMP = BAR_LENGTH - filledMP;

      const mpBar = `§9${BAR_CHAR.repeat(filledMP)}§7${BAR_CHAR.repeat(emptyMP)}`;
      const mpText = `§f${mpScore}§7/§9${MP_MAX}`;

      // === 最終表示 ===
      const barText = `§6HP[${hpBar}] ${hpText} MP[${mpBar}] ${mpText}`;
      player.onScreenDisplay.setActionBar(barText);

    } catch (err) {
      console.warn(`HP/MPバー表示エラー: ${err}`);
    }
  }
}, 5); // 0.25秒ごとに更新