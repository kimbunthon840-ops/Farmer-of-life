# 🌳 Farmer of Life (កសិករជីវិត)
> **Cultivate Your Existence Like a Living Tree**  
> *An organic, philosophical, and practical web sanctuary for deliberate, seasonal human growth.*

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Ready-success?style=for-the-badge&logo=github)](https://pages.github.com/)
[![Telegram](https://img.shields.io/badge/Telegram-@kimbunthonICT-2CA5E0?style=for-the-badge&logo=telegram)](https://t.me/kimbunthonICT)
[![Status](https://img.shields.io/badge/Status-100%25%20Static%20Ready-brightgreen?style=for-the-badge)](index.html)

---

## 📌 មគ្គុទ្ទេសក៍ដោះស្រាយ និងបង្ហោះលើ GitHub (GitHub Pages Deployment & Error Fixes)

### ⚠️ មូលហេតុចម្បងដែលបណ្ដាលឱ្យមាន Error/បាត់បង់ Style នៅលើ GitHub និងដំណោះស្រាយ៖

| # | បញ្ហា (The GitHub Error) | មូលហេតុ (Root Cause) | ដំណោះស្រាយដែលបានកែសម្រួលរួច (Our Applied Fix) |
|---|---|---|---|
| **1** | **ទំព័រចេញតែអក្សរសុទ្ធ ផ្ទៃស គ្មានពណ៌/CSS (ដូចក្នុង Screenshot)** | ពេល Link CSS មាន `onerror` ប្ដូរទៅ `css/style.css` តែលើ GitHub គ្មាន Folder `css/` នាំឱ្យ 404 អស់ | បានបង្កប់ **Critical Base Inlined CSS** ផ្ទាល់លើ `<head>` គ្រប់ទំព័រ (គ្មានថ្ងៃចេញផ្ទៃសទៀតឡើយ) និងរៀបចំ File ទាំងនៅ Root និងក្នុង Folders ស្របគ្នា |
| **2** | **Jekyll Build Failure (Process completed with exit code 1)** | GitHub Pages តាមលំនាំដើមដំណើរការ Jekyll compiler ដែលអាច Error ជាមួយ static syntax | បានបន្ថែមឯកសារ [`.nojekyll`](.nojekyll) នៅ Root នៃ Repository ដើម្បី Bypass Jekyll និងដំណើរការ Static ផ្ទាល់ |
| **3** | **404 Page Not Found នៅលើ URL** | ចូលតាម `https://username.github.io` ជំនួសឱ្យ `https://username.github.io/Farmer/` | URL ត្រឹមត្រូវសម្រាប់ Repository នេះគឺ `https://<username>.github.io/Farmer/` (មានបញ្ជាក់ក្នុងរបារ 404 Auto-Redirect) |
| **4** | **Background Hero Image មិនចេញ** | ក្នុង `style.css` ប្រើ `url('../img/hero.jpg')` ដែលរត់ចេញក្រៅ Repo | បានកែប្រែទៅជា `url('hero.jpg')` និង fallback `url('img/hero.jpg')` ១០០% |
| **5** | **No Workflow Run Error (GitHub Actions)** | ឈ្មោះឯកសារ Workflow មិនត្រូវគ្នា (`static.yml` vs `deploy.yml`) | បានបង្កើតទាំង `.github/workflows/deploy.yml` និង `.github/workflows/static.yml` ធានាជោគជ័យគ្រប់ករណី |
| **6** | **404 Favicon Console Error** | Browser ទាមទារ `/favicon.ico` ពេលបើកលើ GitHub Pages | បានបង្កប់ SVG Tree Favicon ដោយផ្ទាល់លើ `<head>` នៃគ្រប់ទំព័រ |

---

## 🚀 របៀបបើក GitHub Pages ឱ្យដំណើរការ (How to Enable GitHub Pages)

### ជម្រើសទី ១៖ តាមរយៈ Settings (Deploy from a branch - ងាយស្រួលបំផុត)
1. ចូលទៅកាន់ Repository របស់អ្នកនៅលើ GitHub
2. ចុចលើផ្ទាំង **Settings** (នៅខាងលើ)
3. នៅម៉ឺនុយខាងឆ្វេង រំកិលចុះក្រោម រួចចុចលើ **Pages**
4. ត្រង់ចំណុច **Build and deployment**:
   - **Source:** ជ្រើសរើស `Deploy from a branch`
   - **Branch:** ជ្រើសរើស `main` (ឬ `master`), ថតជ្រើសរើស `/ (root)`
   - ចុចប៊ូតុង **Save**
5. រង់ចាំប្រហែល ៣០-៦០ វិនាទី បន្ទាប់មក Refresh ទំព័រ អ្នកនឹងឃើញតំណភ្ជាប់គេហទំព័រផ្ទាល់៖
   ```
   https://<username>.github.io/<repository-name>/
   ```

### ជម្រើសទី ២៖ តាមរយៈ GitHub Actions (ស្វ័យប្រវត្តិ)
1. ចូលទៅកាន់ **Settings** -> **Pages**
2. ត្រង់ **Source:** ជ្រើសរើស **GitHub Actions**
3. ដោយសារគម្រោងនេះមានឯកសារ [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) រួចស្រាប់ វានឹងដំណើរការ Deploy ដោយស្វ័យប្រវត្តិក្តាប់បាន Green Checkmark ✅

---

## 💻 របៀប Push កូដទៅកាន់ GitHub តាម Git Terminal

ប្រសិនបើអ្នកប្រើ Terminal (Command Prompt / PowerShell / Git Bash) សូមវាយពាក្យបញ្ជាខាងក្រោម៖

```bash
# ១. បង្កើត Git Repository
git init

# ២. បន្ថែមឯកសារទាំងអស់
git add .

# ៣. Commit
git commit -m "Farmer of Life - Full Botanical Web Sanctuary with GitHub Actions and .nojekyll"

# ៤. ប្ដូរឈ្មោះ Branch ទៅ main
git branch -M main

# ៥. ភ្ជាប់ទៅ GitHub Remote របស់អ្នក (ជំនួស USERNAME និង REPO របស់អ្នក)
git remote add origin https://github.com/USERNAME/REPOSITORY.git

# ៦. Push ឡើង GitHub
git push -u origin main
```

---

## 🌿 រចនាសម្ព័ន្ធឯកសារគម្រោង (Directory Tree)

```
FarmerOfLife/
├── .github/
│   └── workflows/
│       └── deploy.yml      ← GitHub Actions auto-deploy pipeline
├── .nojekyll               ← Disables Jekyll compiler on GitHub Pages
├── .gitignore              ← Excludes IDE/temp files
├── css/
│   ├── style.css           ← Core botanical design system & tokens
│   └── responsive.css      ← Full mobile & tablet responsiveness
├── img/
│   ├── hero.jpg            ← Ancient forest hero backdrop
│   ├── seeds.jpg           ← Glowing intentional seeds
│   ├── soil.jpg            ← Mineral-rich fertile soil
│   ├── growth.jpg          ← Daily tender sprout
│   ├── seasons.jpg         ← Four seasonal cycles
│   ├── community.jpg       ← Forest mycorrhizal tribe
│   ├── harvest.jpg         ← Golden orchard harvest
│   ├── farmer-portrait.jpg ← Forest steward portrait
│   └── farmers-harvest.jpg ← Joyful Cambodian community harvest
├── js/
│   ├── main.js             ← Web Audio synthesizer, quiz, theme switcher
│   └── tree.js             ← Canvas procedural fractal Tree of Life engine
├── lib/
│   └── animate.css         ← Lightweight botanical animations
├── 404.html                ← The Wild Meadow custom error page
├── index.html              ← Root Trunk: interactive tree & marquees
├── about.html              ← The Farmer & Law of the Farm philosophy
├── soil.html               ← Pillar 1: Soil, Roots & Soil pH Quiz
├── seeds.html              ← Pillar 2: Seeds of Intent & Sprouter
├── growth.html             ← Pillar 3: Daily Habits & Waterings
├── seasons.html            ← Pillar 4: Life Stages & Winter Solace
├── community.html          ← Pillar 5: Mycorrhizal Tribe & Relationships
├── harvest.html            ← Pillar 6: Golden Harvest & Celebration
├── testimonial.html        ← Letters from fellow cultivators
├── contact.html            ← Dispatch a message / Telegram link
└── call-to-action.html     ← The Cultivator's Pledge & Certificate
```

---

## ✨ លក្ខណៈពិសេសៗនៃគម្រោង (Key Features)

1. **Zero-Flash Instant Botanical Theme:**
   - មានបង្កប់ Critical Inlined CSS លើ `<head>` ធានាថាក្រសែភ្នែកអ្នកទស្សនាទទួលបានបទពិសោធន៍ផ្ទៃងងឹតព្រៃឈើដ៏ប្រណិតភ្លាមៗ គ្មានថ្ងៃចេញពណ៌ស unstyled ឡើយ។
2. **Procedural Fractal Tree of Life (`js/tree.js`):**
   - ដើមឈើជីវិតគូរដោយ Canvas 2D តាមរូបមន្តគណិតវិទ្យាប្រាកដ
   - មានប៊ូតុងប្ដូរ ៤ រដូវកាល៖ Spring (ផ្ការីក), Summer (ស្លឹកស្រស់), Autumn (ស្លឹកមាស), Winter (ព្រិលធ្លាក់)
   - មែកឈើមានចលនារេរាំតាមខ្យល់ (Physics Wind Sway) និងមានផ្កា/ស្លឹកធ្លាក់តាមខ្យល់
   - បន្ថែមមុខងារ **4-Season Timelapse Cycle** បង្វិល ៤ រដូវកាលស្វ័យប្រវត្តិកាន់តែរស់រវើក និងគាំទ្រ Touch លើទូរស័ព្ទដៃ ១០០%។
3. **ឧបករណ៍វិភាគរដូវកាលនៃចិត្ត (Interactive Life Season Self-Diagnosis):**
   - ឧបករណ៍វិភាគស្ថានភាពថាមពលជីវិតរបស់អ្នកថាតើកំពុងស្ថិតក្នុងរដូវកាលណា (និទាឃរដូវ, គិម្ហរដូវ, សរទរដូវ, ឬរដូវរងា) រួចផ្ដល់ដំបូន្មានកសិករសមស្រប។
4. **តារាងតាមដានទម្លាប់លូតលាស់ប្រចាំថ្ងៃ (Daily Habit Sprout Tracker):**
   - ធីកទម្លាប់វិជ្ជមានប្រចាំថ្ងៃ និងតាមដានភាគរយនៃការលូតលាស់នៃពន្លកជីវិត ព្រមទាំងរក្សាទុកទិន្នន័យលើ LocalStorage ដោយស្វ័យប្រវត្តិ។
5. **គ្រាប់ពូជនៃប្រាជ្ញាកសិករ (Botanical Wisdom Oracle):**
   - បង្កើត និងចៃដន្យពាក្យស្លោកទស្សនវិជ្ជាពីបុរាណជាភាសាខ្មែរ និងអង់គ្លេស ជាមួយប៊ូតុង Copy ភ្លាមៗ។
6. **របារបញ្ជាអណ្ដែតលើអេក្រង់ (Floating Sanctuary HUD):**
   - របារ HUD នៅជ្រុងខាងក្រោម មាន Equalizer ចលនាសំឡេងខ្យល់ព្រៃ និងប៊ូតុងត្រឡប់ឡើងលើ (Return to Canopy) យ៉ាងរលូន។
7. **របារអក្សររត់ប្រកាសដំណឹង (Dynamic Running Marquee):**
   - របារខាងលើ និងខាងក្រោមបង្ហាញពាក្យស្លោកទស្សនវិជ្ជាជីវិតជាភាសាខ្មែរ និងអង់គ្លេស
   - មានបង្កប់តំណភ្ជាប់សន្ទនា Telegram ផ្ទាល់
8. **ឧបករណ៍បំពងសំឡេងធម្មជាតិ (Forest Ambient Audio):**
   - បង្កើតសំឡេងខ្យល់បក់ និងរលកធម្មជាតិតាមរយៈ Web Audio API ដោយមិនចាំបាច់មាន File `.mp3` ធ្ងន់ៗ
9. **Cambodian Harvest Spotlight:**
   - រូបភាពកសិករខ្មែរប្រមូលផលកសិផលស្រស់បំព្រងក្នុងសហគមន៍

---

## 📞 ទំនាក់ទំនង និងការសន្ទនាផ្ទាល់ (Contact & Conversation)

- **Telegram:** [@kimbunthonICT](https://t.me/kimbunthonICT)
- **Email:** [kimbunthon840@gmail.com](mailto:kimbunthon840@gmail.com)
- **Project:** Farmer of Life Sanctuary

---
*© 2026 Farmer of Life Sanctuary. Handcrafted with reverence for natural law.*
