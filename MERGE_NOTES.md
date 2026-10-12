# MERGE_NOTES · 创业摇篮入库终稿（2026-10-12）

## 最终条数
- **31** 条写入 `/workspace/startup-cradle/companies.json`（苏晚契约：JSON 数组，`stage` / `links` / `added_at`）
- 同步 **31** 条到 `/workspace/startup-cradle/data/companies.json`（站点契约：`{meta, companies}`，`round`←`stage`，`website`←`links.website`，`listed_at`←`added_at`，并生成 `id`）

## 砍掉（按指令 + 质量门）
| 名称 | 原因 |
|------|------|
| **Acrely** | 域名漂移（YC 名 Acrely / 站 lupitor.com）；指令必砍；草稿有 → 删除 |
| **Mem0** | 指令必砍；草稿无；阿营候选表观感偏后期（Series A）→ 不补入 |
| **深朴智能** | 指令必砍；草稿无；Pre-A+ 卡早期观感 → 不补入 |
| **Nirva** | 指令必砍；草稿无；预购≠可访产物 → 不补入 |

## 必保留（抽样门禁定稿覆盖）
1. **Mastra** — why 中文；signals YC+GitHub；website https://mastra.ai/
2. **圆木智能** — signals 今天排 + 新浪融资稿；website https://www.yuanmu.ai/
3. **密瓜智能** — signals HAMi repo + Dynamia 博客；links.repo=HAMi；website https://dynamia.ai/
4. **Adam** — **草稿无，本轮补入**；website https://adam.new/；founded 2025；YC + TechCrunch
5. **Browser Use** — founded_year **2024**；YC + GitHub browser-use；website https://browser-use.com/
6. **人工生产力** — **草稿无，本轮补入**；website https://artificial-productivity.com/；signals 36氪（未找到独立商城/商品详情页：`/products` 与首页同 SPA，故未硬加假链）

## 从草稿保留并改写
其余草稿条目全部保留（Acrely 除外），统一：
- `tagline` / `why_potential` 中文
- `signals` → `[{label, url}]`（YC / GitHub / 36氪 / 投中网 / 财联社等可点 URL）
- `added_at`: 2026-10-12，`status`: watching

保留名单（25）：AgentMail, Autumn, assistant-ui, ZeroEntropy, Pave Robotics, Asteroid, Maritime Fusion, Red Barn Robotics, Misprint, Solidroad, Subtrace, AthenaHQ, Confident AI, Weave, Autosana, Airweave, BlindPay, 模感科技, 厘清智能, 佰晟智算, 珀乐互动, 中科天算, 格式塔科技, 深庭纪智能, 诺因智能。

## 官网 / 信号抽检
- 对本批全部 `website` 做 HEAD/GET：均为 **HTTP 200**（含 Adam / 人工生产力 / 圆木 / 密瓜等）。
- 对抽样必保留信号链（YC/GitHub/TC/新浪/HAMi/36氪）抽检：**200**。
- 对草稿 CN 报道链与多数 YC 页抽检：**200**。
- 额外为 Confident AI / assistant-ui / Subtrace / Airweave / Browser Use 挂上可访 GitHub 作为第二信号（可点）。

## 风险备注
1. **非投资建议**：文案已克制；站内免责声明需固定展示（阿川页脚）。
2. **中科天算**：主体名与品牌 ComoSpace 并存；官网与 36氪均可访，已收录并在 why 中注明——若后续主体对不上可归档。
3. **模感科技 / 厘清智能**：`founded_year=2026` 极新，公开成立年口径需后续复核；天使报道未写死金额。
4. **诺因智能 / 深庭纪**：消费具身硬件，交付与量产风险高；单报道信号刚过线，月度复检官网。
5. **人工生产力**：仅 1 条 36氪信号（门禁刚过）；官网有产品矩阵叙事但无独立商城 URL。
6. **Maritime Fusion**：深科技/远期，产品「可访」仅为公司站，非可购装置——观察向。
7. **ZeroEntropy / Pave Robotics**：`founded_year=null`（不确定不编造）。
8. **契约双轨**：苏晚群聊契约文件在仓库根 `companies.json`；阿川站点读 `data/companies.json`。改数据请两处对齐或从根文件再导出。
9. **未收录**：REJECTED.md 中蓝霄/第五纪/它石/Kando 等仍因无稳定官网或不可核，继续排除。

## 未做
- 未跑买量、未开投稿。
- 空仓/Pages 推送仍等 ApheaTech；本机数据已可 `python3 scripts/validate.py [--check-links]`。
