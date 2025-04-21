import { system, world } from "@minecraft/server";
//変数
const HP_OBJECTIVE = "hp";
const MP_OBJECTIVE = "mp";
const LV_OBJECTIVE = "lv";

const HP_MAX = 5+(lv*5);
const MP_MAX = 10+(lv*10);
const LV_MAX = 100;

const BAR_CHAR = "|";
const BAR_LENGTH = 20;

//アクションバーにステータスを表示
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
      
      // === lvスコア取得 ===
      const lvScore = world.scoreboard.getObjective(LV_OBJECTIVE)?.getScore(identity) ?? 0;

      const lvText = `§f${lvScore}§7`;

      // === 最終表示 ===
      const barText = `§aLV.${lvText} §cHP§f[${hpBar}] ${hpText} MP[${mpBar}] ${mpText}`;
      player.onScreenDisplay.setActionBar(barText);

    } catch (err) {
      console.warn(`LV/HP/MPバー表示エラー: ${err}`);
    }
  }
}, 5); // 0.25秒ごとに更新