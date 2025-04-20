import { world, system , EntityComponentTypes } from "@minecraft/server";

system.runInterval(() => {
    for (const player of world.getPlayers()) {
      try {
        const healthComp = player.getComponent(EntityComponentTypes.Health);
  
        if (!healthComp) {
          player.onScreenDisplay.setActionBar("§c⚠ HP情報が取得できません");
          continue;
        }
  
        const current = Math.floor(healthComp.currentValue);
        const max = Math.floor(healthComp.defaultValue);
        const ratio = current / max;
  
        // 色分け
        let color = "§a"; // 緑（通常）
        if (ratio < 0.25) color = "§c"; // 赤（ピンチ）
        else if (ratio < 0.5) color = "§e"; // 黄（注意）
  
        // ★ ここを20本に固定
        const barLength = 20;
        const filledBars = Math.round(ratio * barLength);
        const emptyBars = barLength - filledBars;
  
        // ｜ をゲージとして使用。減った部分はグレーに
        const bar = `${color}${"|".repeat(filledBars)}§7${"|".repeat(emptyBars)}`;
  
        // アクションバーに表示
        player.onScreenDisplay.setActionBar(`§6[${bar}] §f${current}§7/§c${max}`);
      } catch (error) {
        console.warn(`HPバー表示時にエラー: ${error}`);
      }
    }
  }, 5); // 0.25秒ごとに更新
  