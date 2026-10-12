# 创业摇篮 · Startup Cradle

策展式**早期潜力公司**目录站（创业坟场的反面）。静态站，部署在 **GitHub Pages**。

> 本站仅为公开信息策展，**不构成投资建议、融资背书或尽调结论**。

## 质量门（上线前必须过）

1. 每条有可点开的官网 + ≥1 条可点开核验的公开信号  
2. 「为何有潜力」只写可核实事实 + 一句判断，禁止空话  
3. 宁缺毋滥：不够格不凑数  
4. 页脚免责声明固定展示  
5. 死链 / 缺字段：**不上线**

本地门禁：

```bash
python3 scripts/validate.py
python3 scripts/validate.py --check-links   # 发布前跑
```

## 数据字段

见 `data/companies.schema.json`。主数据：`data/companies.json`。

| 字段 | 说明 |
|---|---|
| `name_zh` / `name_en` | 名称 |
| `tagline` | 一句话 |
| `founded_year` / `round` | 成立年 / 轮次 |
| `region` / `sector` | 地区 / 赛道 |
| `why_potential` | 为何有潜力 |
| `signals[]` | `{label,url}` 公开信号 |
| `website` | 官网 |
| `listed_at` | 收录日 `YYYY-MM-DD` |
| `status` | `watching` \| `graduated` \| `archived` |

## 本地预览

任意静态服务器即可，例如：

```bash
python3 -m http.server 8080 --directory .
# 打开 http://127.0.0.1:8080
```

## 发布 GitHub Pages

仓库设为 **public** 后：

1. Settings → Pages → Source: **Deploy from a branch**  
2. Branch: `main` / folder: `/ (root)`  
3. 保存后站点约为：`https://apheatech.github.io/<repo>/`

也可用 Actions 的 `peaceiris/actions-gh-pages` 或官方 `actions/deploy-pages`；本仓库默认「根目录直出」，无需构建。

## 目录

```
.
├── index.html
├── assets/
│   ├── styles.css
│   └── app.js
├── data/
│   ├── companies.json
│   └── companies.schema.json
├── scripts/validate.py
└── README.md
```
