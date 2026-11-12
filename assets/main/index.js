System.register("chunks:///_virtual/FarmGame.ts", ["cc"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var FarmGame_1, cc_1, ccclass, FARM_HALF_X, FARM_HALF_Z, FENCE_X, FENCE_Z, PORTRAIT_HALF_WIDTH, PORTRAIT_PITCH, PORTRAIT_NDC_BOTTOM, PORTRAIT_NDC_TOP, DESIGN_WIDTH_LANDSCAPE, DESIGN_HEIGHT_LANDSCAPE, DESIGN_WIDTH_PORTRAIT, DESIGN_HEIGHT_PORTRAIT, CURTAIN_DROP_SECONDS, CURTAIN_LIFT_SECONDS, CREDITS_SPEED, CREDITS, ROUND_SECONDS, EGG_SECONDS, POINTS_PER_CHICK, HEN_SPEED, MOVE_KEYS, GAME_KEYS, KEY_BY_LETTER, KEY_BY_CODE, CC_KEY_NAMES, KEY_EGG_COOLDOWN, HEN_FOLLOW_SPEED, MAX_BUBBLES, MAX_HEARTS, SCORE_FLOAT_COLORS, CHICK_TALK_GAP, CHICK_CHATTER, HATCH_LINES, VOLUME_STORAGE_KEY, LAY_EGG_SOUND_URL, GameAudio, SUPABASE_URL, SUPABASE_ANON_KEY, PLAYER_STORAGE_KEY, LADDER_STORAGE_KEY, LADDER_MAX_RECORDS, LADDER_SHOW_ROWS, NAME_MAX_WIDTH, DAY_MS, WEEK_SHIFT_MS, NAME_ADJECTIVES, NAME_CHARACTERS, NAME_BLOCKLIST, LocalLadderStore, SupabaseLadderStore, LadderOverlay, FarmGame;
    var __moduleName = context_1 && context_1.id;
    /** Normalise a DOM key event; falls back to key / keyCode when code is missing (some IMEs and remote desktops). */
    function domKeyName(event) {
        var _a, _b;
        if (event.code && event.code !== 'Unidentified')
            return event.code;
        return (_b = (_a = KEY_BY_LETTER[(event.key || '').toLowerCase()]) !== null && _a !== void 0 ? _a : KEY_BY_CODE[event.keyCode]) !== null && _b !== void 0 ? _b : '';
    }
    function charWidth(ch) {
        var _a;
        const code = (_a = ch.codePointAt(0)) !== null && _a !== void 0 ? _a : 0;
        return code > 0x2e7f ? 2 : 1;
    }
    /** Trim to NAME_MAX_WIDTH units, mask blocked words, add "…" when cut. 我是吉依卡哇啦 → 我是吉依卡哇… */
    function fitName(raw) {
        let name = (raw || '').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim();
        for (const word of NAME_BLOCKLIST) {
            name = name.replace(new RegExp(word, 'gi'), '…');
        }
        let width = 0;
        let out = '';
        for (const ch of Array.from(name)) {
            const w = charWidth(ch);
            if (width + w > NAME_MAX_WIDTH)
                return out + '…';
            width += w;
            out += ch;
        }
        return out;
    }
    function randomName() {
        const a = NAME_ADJECTIVES[Math.floor(Math.random() * NAME_ADJECTIVES.length)];
        const c = NAME_CHARACTERS[Math.floor(Math.random() * NAME_CHARACTERS.length)];
        return fitName(a + c);
    }
    function randomId() {
        const c = typeof crypto !== 'undefined' ? crypto : null;
        if (c && typeof c.randomUUID === 'function')
            return c.randomUUID();
        return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    }
    /** Week number that flips every Monday 06:00 Taipei time. */
    function ladderWeek(now = Date.now()) {
        const day = Math.floor((now + WEEK_SHIFT_MS) / DAY_MS);
        // 1970-01-01 was a Thursday; +3 makes Monday the first day of a week.
        return Math.floor((day + 3) / 7);
    }
    function ladderWeekStart(week) {
        return (week * 7 - 3) * DAY_MS - WEEK_SHIFT_MS;
    }
    function loadPlayer() {
        var _a;
        try {
            const saved = JSON.parse((_a = localStorage.getItem(PLAYER_STORAGE_KEY)) !== null && _a !== void 0 ? _a : 'null');
            if (saved && typeof saved.id === 'string' && typeof saved.name === 'string')
                return { id: saved.id, name: fitName(saved.name) };
        }
        catch ( /* storage blocked */_b) { /* storage blocked */ }
        return null;
    }
    function savePlayer(player) {
        try {
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(player));
        }
        catch ( /* storage blocked */_a) { /* storage blocked */ }
    }
    function escapeHtml(text) {
        return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }
    return {
        setters: [
            function (cc_1_1) {
                cc_1 = cc_1_1;
            }
        ],
        execute: function () {
            ccclass = cc_1._decorator.ccclass;
            FARM_HALF_X = 9.6;
            FARM_HALF_Z = 6.4;
            FENCE_X = FARM_HALF_X + 0.05;
            FENCE_Z = FARM_HALF_Z + 0.2;
            /** Portrait (phone) mode: no fence, the whole screen is the farm. These tune the near-top-down camera. */
            PORTRAIT_HALF_WIDTH = 5.2;
            PORTRAIT_PITCH = 45;
            PORTRAIT_NDC_BOTTOM = -0.9;
            PORTRAIT_NDC_TOP = 0.15;
            DESIGN_WIDTH_LANDSCAPE = 1280;
            DESIGN_HEIGHT_LANDSCAPE = 720;
            DESIGN_WIDTH_PORTRAIT = 640;
            DESIGN_HEIGHT_PORTRAIT = 1136;
            CURTAIN_DROP_SECONDS = 0.9;
            CURTAIN_LIFT_SECONDS = 0.7;
            CREDITS_SPEED = 95;
            /** Edit these lines to change the end credits. */
            CREDITS = [
                ['快樂小雞農場', 56],
                ['', 30],
                ['— 製作團隊 —', 34],
                ['遊戲企劃　Tiger', 30],
                ['程式開發　Tiger × Claude', 30],
                ['3D 場景與角色　程式即時生成', 30],
                ['遊戲引擎　Cocos Creator 3.8.8', 30],
                ['', 30],
                ['— 演出 —', 34],
                ['母雞媽媽　飾演　滑鼠游標', 30],
                ['小雞們　本局共 {hatched} 隻', 30],
                ['', 30],
                ['特別感謝　每一位來玩的你', 30],
                ['', 30],
                ['謝謝觀賞', 44],
            ];
            ROUND_SECONDS = 30;
            EGG_SECONDS = 3;
            POINTS_PER_CHICK = 100;
            HEN_SPEED = 6.5;
            MOVE_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
            GAME_KEYS = [...MOVE_KEYS, 'Space'];
            KEY_BY_LETTER = { w: 'KeyW', a: 'KeyA', s: 'KeyS', d: 'KeyD', ' ': 'Space', enter: 'Enter',
                arrowup: 'ArrowUp', arrowdown: 'ArrowDown', arrowleft: 'ArrowLeft', arrowright: 'ArrowRight' };
            KEY_BY_CODE = { 87: 'KeyW', 65: 'KeyA', 83: 'KeyS', 68: 'KeyD', 32: 'Space', 13: 'Enter',
                38: 'ArrowUp', 40: 'ArrowDown', 37: 'ArrowLeft', 39: 'ArrowRight' };
            /** Fallback mapping for platforms without DOM keyboard events. */
            CC_KEY_NAMES = {
                [cc_1.KeyCode.KEY_W]: 'KeyW', [cc_1.KeyCode.KEY_A]: 'KeyA', [cc_1.KeyCode.KEY_S]: 'KeyS', [cc_1.KeyCode.KEY_D]: 'KeyD',
                [cc_1.KeyCode.ARROW_UP]: 'ArrowUp', [cc_1.KeyCode.ARROW_DOWN]: 'ArrowDown', [cc_1.KeyCode.ARROW_LEFT]: 'ArrowLeft', [cc_1.KeyCode.ARROW_RIGHT]: 'ArrowRight',
                [cc_1.KeyCode.SPACE]: 'Space', [cc_1.KeyCode.ENTER]: 'Enter',
            };
            KEY_EGG_COOLDOWN = 0.15;
            HEN_FOLLOW_SPEED = 24;
            MAX_BUBBLES = 8;
            MAX_HEARTS = 40;
            SCORE_FLOAT_COLORS = ['#ffffff', '#fff2a8', '#ffd6e8', '#c9f4ff', '#d9ffc9'];
            /** Each chick says at most one line in this many seconds. */
            CHICK_TALK_GAP = 10;
            /** Things chicks say on their own, picked at random. */
            CHICK_CHATTER = ['啾啾！', '肚子餓了～', '這裡好好玩！', '媽媽在哪？', '我跑最快！', '草好軟喔', '嗨～你好！', '一起玩嘛！',
                '今天天氣真好', '啾？', '我想要蟲蟲', '追我追我！', '好睏喔…', '看我的！', '咕嚕咕嚕', '我是最可愛的'];
            HATCH_LINES = ['啾！我出生了！', '哇，好亮喔！', '嗨，世界！', '媽媽～', '殼殼破掉了！'];
            VOLUME_STORAGE_KEY = 'happy-chick-volume';
            /** Egg-laying sound, served next to index.html (kept in build-templates/web-mobile/sounds so rebuilds keep it). */
            LAY_EGG_SOUND_URL = 'sounds/hen-lay.mp3';
            /** Tiny Web Audio synth: background music and sound effects without any audio files. */
            GameAudio = class GameAudio {
                constructor() {
                    var _a;
                    this.ctx = null;
                    this.musicGain = null;
                    this.sfxGain = null;
                    this.musicTimer = null;
                    this.nextNoteTime = 0;
                    this.step = 0;
                    this.layBuffer = null;
                    this.musicVolume = 0.5;
                    this.sfxVolume = 0.8;
                    // 32 eighth notes in C major (MIDI numbers, 0 = rest) and a bass note per quarter.
                    this.melody = [72, 76, 79, 76, 77, 81, 79, 0, 76, 79, 84, 79, 77, 76, 74, 0,
                        74, 77, 81, 77, 76, 79, 77, 76, 74, 76, 72, 74, 76, 74, 72, 0];
                    this.bass = [48, 48, 53, 53, 55, 55, 48, 48, 50, 50, 55, 55, 48, 43, 48, 48];
                    try {
                        const saved = JSON.parse((_a = localStorage.getItem(VOLUME_STORAGE_KEY)) !== null && _a !== void 0 ? _a : 'null');
                        if (saved && typeof saved.music === 'number')
                            this.musicVolume = saved.music;
                        if (saved && typeof saved.sfx === 'number')
                            this.sfxVolume = saved.sfx;
                    }
                    catch ( /* storage unavailable: keep defaults */_b) { /* storage unavailable: keep defaults */ }
                }
                /** Must be called from a user gesture (click, tap or key) because browsers block autoplay. */
                unlock() {
                    if (typeof window === 'undefined')
                        return;
                    if (!this.ctx) {
                        const Ctor = window.AudioContext || window.webkitAudioContext;
                        if (!Ctor)
                            return;
                        this.ctx = new Ctor();
                        this.musicGain = this.ctx.createGain();
                        this.sfxGain = this.ctx.createGain();
                        this.musicGain.connect(this.ctx.destination);
                        this.sfxGain.connect(this.ctx.destination);
                        this.applyVolumes();
                        this.loadLaySound();
                    }
                    if (this.ctx.state === 'suspended')
                        this.ctx.resume();
                    if (!this.musicTimer)
                        this.startMusic();
                }
                setVolumes(music, sfx) {
                    this.musicVolume = music;
                    this.sfxVolume = sfx;
                    this.applyVolumes();
                    try {
                        localStorage.setItem(VOLUME_STORAGE_KEY, JSON.stringify({ music, sfx }));
                    }
                    catch ( /* ignore */_a) { /* ignore */ }
                }
                applyVolumes() {
                    if (!this.ctx)
                        return;
                    this.musicGain.gain.setTargetAtTime(this.musicVolume * this.musicVolume * 0.6, this.ctx.currentTime, 0.02);
                    this.sfxGain.gain.setTargetAtTime(this.sfxVolume * this.sfxVolume, this.ctx.currentTime, 0.02);
                }
                stop() {
                    var _a;
                    if (this.musicTimer)
                        clearInterval(this.musicTimer);
                    this.musicTimer = null;
                    (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.close();
                    this.ctx = null;
                }
                startMusic() {
                    this.nextNoteTime = this.ctx.currentTime + 0.1;
                    this.musicTimer = setInterval(() => this.scheduleMusic(), 60);
                }
                scheduleMusic() {
                    const ctx = this.ctx;
                    if (!ctx)
                        return;
                    const eighth = 60 / 138 / 2;
                    while (this.nextNoteTime < ctx.currentTime + 0.25) {
                        const t = this.nextNoteTime;
                        const note = this.melody[this.step % 32];
                        if (note)
                            this.tone(this.musicGain, 'square', this.midi(note), t, eighth * 0.85, 0.07);
                        if (this.step % 2 === 0)
                            this.tone(this.musicGain, 'triangle', this.midi(this.bass[(this.step / 2) % 16]), t, eighth * 1.7, 0.22);
                        if (this.step % 2 === 1)
                            this.noise(this.musicGain, t, 0.03, 0.05, 7000);
                        if (this.step % 8 === 4)
                            this.noise(this.musicGain, t, 0.08, 0.1, 1800);
                        this.step++;
                        this.nextNoteTime += eighth;
                    }
                }
                loadLaySound() {
                    const ctx = this.ctx;
                    if (!ctx || typeof fetch === 'undefined')
                        return;
                    fetch(LAY_EGG_SOUND_URL)
                        .then((response) => {
                        if (!response.ok)
                            throw new Error(`HTTP ${response.status}`);
                        return response.arrayBuffer();
                    })
                        .then((data) => new Promise((resolve, reject) => ctx.decodeAudioData(data, resolve, reject)))
                        .then((buffer) => { this.layBuffer = buffer; })
                        .catch((error) => console.warn('[Happy Chick] Egg sound not loaded, using synth cluck:', error));
                }
                /** Hen sound when she lays an egg: the recorded clip, or a synth "bok bok bawk" until it has loaded. */
                cluck() {
                    const ctx = this.ctx;
                    if (!ctx)
                        return;
                    if (this.layBuffer) {
                        const source = ctx.createBufferSource();
                        source.buffer = this.layBuffer;
                        source.playbackRate.value = 0.95 + Math.random() * 0.1;
                        source.connect(this.sfxGain);
                        source.start();
                        return;
                    }
                    const t = ctx.currentTime;
                    const pitch = 0.9 + Math.random() * 0.2;
                    this.sweep('sawtooth', 620 * pitch, 380 * pitch, t, 0.08, 0.28);
                    this.sweep('sawtooth', 640 * pitch, 390 * pitch, t + 0.13, 0.08, 0.28);
                    this.sweep('sawtooth', 520 * pitch, 980 * pitch, t + 0.28, 0.12, 0.32, 640 * pitch, 0.22);
                    this.noise(this.sfxGain, t + 0.28, 0.2, 0.08, 2500);
                    this.sweep('sine', 300, 120, t + 0.55, 0.12, 0.35); // egg plop
                }
                /** Bright chirp when a chick hatches. */
                chirp() {
                    const ctx = this.ctx;
                    if (!ctx)
                        return;
                    const t = ctx.currentTime;
                    this.sweep('sine', 1800, 2600, t, 0.07, 0.22);
                    this.sweep('sine', 2000, 3000, t + 0.1, 0.07, 0.2);
                }
                click() {
                    if (!this.ctx)
                        return;
                    this.sweep('triangle', 900, 1300, this.ctx.currentTime, 0.05, 0.18);
                }
                midi(note) {
                    return 440 * Math.pow(2, (note - 69) / 12);
                }
                tone(out, type, freq, t, length, level) {
                    const ctx = this.ctx;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = type;
                    osc.frequency.setValueAtTime(freq, t);
                    gain.gain.setValueAtTime(0.0001, t);
                    gain.gain.exponentialRampToValueAtTime(level, t + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
                    osc.connect(gain).connect(out);
                    osc.start(t);
                    osc.stop(t + length + 0.02);
                }
                sweep(type, from, to, t, length, level, end, tail = 0) {
                    const ctx = this.ctx;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    const filter = ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.value = 2400;
                    osc.type = type;
                    osc.frequency.setValueAtTime(from, t);
                    osc.frequency.exponentialRampToValueAtTime(to, t + length);
                    if (end)
                        osc.frequency.exponentialRampToValueAtTime(end, t + length + tail);
                    const total = length + tail;
                    gain.gain.setValueAtTime(0.0001, t);
                    gain.gain.exponentialRampToValueAtTime(level, t + 0.012);
                    gain.gain.exponentialRampToValueAtTime(0.0001, t + total);
                    osc.connect(filter).connect(gain).connect(this.sfxGain);
                    osc.start(t);
                    osc.stop(t + total + 0.02);
                }
                noise(out, t, length, level, cutoff) {
                    const ctx = this.ctx;
                    const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * length)), ctx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < data.length; i++)
                        data[i] = Math.random() * 2 - 1;
                    const source = ctx.createBufferSource();
                    source.buffer = buffer;
                    const filter = ctx.createBiquadFilter();
                    filter.type = 'highpass';
                    filter.frequency.value = cutoff;
                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(level, t);
                    gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
                    source.connect(filter).connect(gain).connect(out);
                    source.start(t);
                }
            };
            // ---------------------------------------------------------------------------
            // Weekly ladder (天梯): player name, week math, score store and a DOM panel.
            // ---------------------------------------------------------------------------
            /**
             * Shared weekly ladder on Supabase (free tier). Fill in the project URL and the public "anon" / publishable key
             * from Project Settings → API. Leave them empty to keep scores on this device only.
             * The key is meant to be public: the database only allows the three functions in supabase/ladder.sql.
             */
            SUPABASE_URL = 'https://xnjlyrnvzicdlyrqrpjh.supabase.co';
            SUPABASE_ANON_KEY = 'sb_publishable_5c7Aah4hiB8nWQGYWmctww_ThipVOHl';
            PLAYER_STORAGE_KEY = 'happy-chick-player';
            LADDER_STORAGE_KEY = 'happy-chick-ladder';
            /** Records kept per week. */
            LADDER_MAX_RECORDS = 1000;
            /** Rows drawn in the panel. */
            LADDER_SHOW_ROWS = 100;
            /** Name width: a CJK character counts 2, a letter or digit 1. 12 = six Chinese characters. */
            NAME_MAX_WIDTH = 12;
            DAY_MS = 86400000;
            /** The week starts Monday 06:00 Taipei time (UTC+8), i.e. Sunday 22:00 UTC. */
            WEEK_SHIFT_MS = (8 - 6) * 3600000;
            NAME_ADJECTIVES = [
                '快樂', '愛睡', '勇敢', '害羞', '貪吃', '閃亮', '飛快', '溫柔', '調皮', '迷糊',
                '超萌', '神氣', '開心', '安靜', '好奇', '熱情', '帥氣', '可愛', '酷酷', '暖暖',
                '圓滾', '蓬鬆', '金黃', '粉紅', '天藍', '彩虹', '星星', '月光', '晨光', '微風',
                '跳跳', '咕咕', '啾啾', '嘰嘰', '小小', '大大', '胖胖', '瘦瘦', '早起', '夜貓',
            ];
            NAME_CHARACTERS = [
                '小雞', '母雞', '蛋蛋', '雞仔', '雞寶', '公雞', '雞腿', '布丁', '麻糬', '湯圓',
                '鬆餅', '饅頭', '豆花', '芋圓', '奶茶', '玉米', '稻草', '農夫', '牧場主', '雞蛋糕',
                '小黃', '咕嚕', '啾比', '嘰咪', '蛋黃', '雞米花', '小羽', '小冠', '阿雞', '雞大王',
            ];
            /** Very small word filter: matches are replaced with "…". */
            NAME_BLOCKLIST = ['幹', '靠北', '機掰', '雞掰', '白癡', '智障', '去死', 'fuck', 'shit', 'bitch'];
            LocalLadderStore = class LocalLadderStore {
                constructor() {
                    this.shared = false;
                }
                read(week) {
                    var _a;
                    try {
                        const saved = JSON.parse((_a = localStorage.getItem(LADDER_STORAGE_KEY)) !== null && _a !== void 0 ? _a : 'null');
                        if (saved && saved.week === week && Array.isArray(saved.entries))
                            return saved.entries;
                    }
                    catch ( /* storage blocked */_b) { /* storage blocked */ }
                    return [];
                }
                async submit(week, entry) {
                    const entries = this.read(week);
                    const mine = entries.find((e) => e.id === entry.id);
                    // One row per player per week: keep the best score, but always show the latest name.
                    if (mine) {
                        mine.name = entry.name;
                        if (entry.score > mine.score) {
                            mine.score = entry.score;
                            mine.hatched = entry.hatched;
                            mine.at = entry.at;
                        }
                    }
                    else {
                        entries.push(entry);
                    }
                    entries.sort((a, b) => b.score - a.score || a.at - b.at);
                    entries.length = Math.min(entries.length, LADDER_MAX_RECORDS);
                    try {
                        localStorage.setItem(LADDER_STORAGE_KEY, JSON.stringify({ week, entries }));
                    }
                    catch ( /* storage blocked */_a) { /* storage blocked */ }
                }
                async top(week, _playerId) {
                    return this.read(week).map((e, i) => (Object.assign(Object.assign({}, e), { rank: i + 1 })));
                }
                async rename(week, player) {
                    const entries = this.read(week);
                    const mine = entries.find((e) => e.id === player.id);
                    if (!mine)
                        return;
                    mine.name = player.name;
                    try {
                        localStorage.setItem(LADDER_STORAGE_KEY, JSON.stringify({ week, entries }));
                    }
                    catch ( /* storage blocked */_a) { /* storage blocked */ }
                }
            };
            /** Calls the database functions in supabase/ladder.sql over Supabase's REST API (no SDK needed). */
            SupabaseLadderStore = class SupabaseLadderStore {
                constructor(url, key) {
                    this.url = url;
                    this.key = key;
                    this.shared = true;
                    this.local = new LocalLadderStore();
                }
                async rpc(fn, body) {
                    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
                    const timer = setTimeout(() => controller === null || controller === void 0 ? void 0 : controller.abort(), 8000);
                    try {
                        const res = await fetch(`${this.url.replace(/\/$/, '')}/rest/v1/rpc/${fn}`, {
                            method: 'POST',
                            // New sb_publishable_ keys go in apikey only; legacy anon JWT keys are also sent as a bearer token.
                            headers: this.key.startsWith('eyJ')
                                ? { apikey: this.key, Authorization: `Bearer ${this.key}`, 'Content-Type': 'application/json' }
                                : { apikey: this.key, 'Content-Type': 'application/json' },
                            body: JSON.stringify(body),
                            signal: controller === null || controller === void 0 ? void 0 : controller.signal,
                        });
                        if (!res.ok)
                            throw new Error(`${fn} ${res.status}`);
                        const text = await res.text();
                        return (text ? JSON.parse(text) : null);
                    }
                    finally {
                        clearTimeout(timer);
                    }
                }
                async submit(week, entry) {
                    // Keep a copy on the device too, so an offline round still shows up locally.
                    await this.local.submit(week, entry);
                    await this.rpc('submit_score', { p_player: entry.id, p_name: entry.name, p_score: entry.score, p_hatched: entry.hatched });
                }
                async top(_week, playerId) {
                    const rows = await this.rpc('get_ladder', { p_player: playerId, p_limit: LADDER_SHOW_ROWS });
                    return (rows || []).map((r) => ({
                        id: r.is_me && playerId ? playerId : `rank-${r.rank}`,
                        name: r.name,
                        score: r.score,
                        hatched: r.hatched,
                        at: 0,
                        rank: r.rank,
                    }));
                }
                async rename(week, player) {
                    await this.local.rename(week, player);
                    await this.rpc('rename_player', { p_player: player.id, p_name: player.name });
                }
            };
            /** HTML overlays for the name prompt and the ladder: native text input handles Chinese IME and scrolling. */
            LadderOverlay = class LadderOverlay {
                constructor() {
                    this.root = null;
                    this.onClose = null;
                }
                get open() { return !!this.root; }
                mount(html) {
                    this.close(false);
                    if (!document.getElementById('hc-ladder-style')) {
                        const style = document.createElement('style');
                        style.id = 'hc-ladder-style';
                        style.textContent = `
.hc-mask{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;background:rgba(10,24,36,.55);cursor:auto;font-family:"PingFang TC","Microsoft JhengHei","Noto Sans TC",sans-serif;padding:16px;box-sizing:border-box}
.hc-card{width:min(440px,100%);max-height:min(640px,calc(100vh - 32px));display:flex;flex-direction:column;background:#163246;color:#fff6d2;border-radius:22px;box-shadow:0 10px 0 rgba(0,0,0,.25);padding:20px 20px 16px;box-sizing:border-box}
.hc-card h2{margin:0 0 4px;font-size:26px;text-align:center;color:#ffd666}
.hc-sub{margin:0 0 14px;text-align:center;font-size:14px;opacity:.8}
.hc-row{display:flex;gap:8px}
.hc-input{flex:1;min-width:0;font-size:20px;padding:10px 12px;border-radius:12px;border:3px solid #ffd666;background:#fffaf0;color:#5b391f;outline:none;font-family:inherit}
.hc-btn{font-size:18px;font-family:inherit;border:0;border-radius:14px;padding:10px 16px;cursor:pointer;background:#ffcc4a;color:#5b391f;font-weight:600;box-shadow:0 4px 0 rgba(0,0,0,.25);white-space:nowrap}
.hc-btn:active{transform:translateY(2px);box-shadow:0 2px 0 rgba(0,0,0,.25)}
.hc-btn.alt{background:#7cc8ec;color:#163246}
.hc-btn.ghost{background:rgba(255,255,255,.15);color:#fff6d2}
.hc-preview{margin:10px 2px 16px;font-size:15px;opacity:.85;min-height:20px}
.hc-actions{display:flex;gap:10px;justify-content:center;margin-top:12px}
.hc-list{flex:1;overflow-y:auto;margin:0 -6px;padding:0 6px;-webkit-overflow-scrolling:touch}
.hc-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;font-size:17px}
.hc-item:nth-child(odd){background:rgba(255,255,255,.06)}
.hc-item.me{background:rgba(255,214,102,.28);outline:2px solid #ffd666}
.hc-rank{width:44px;text-align:center;font-weight:700;color:#ffd666}
.hc-name{flex:1;min-width:0;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hc-score{font-variant-numeric:tabular-nums;font-weight:600}
.hc-mine{margin-top:10px}
.hc-empty{text-align:center;padding:30px 0;opacity:.75}
.hc-note{font-size:12px;opacity:.6;text-align:center;margin-top:8px}`;
                        document.head.appendChild(style);
                    }
                    const root = document.createElement('div');
                    root.className = 'hc-mask';
                    root.innerHTML = `<div class="hc-card">${html}</div>`;
                    // Keep taps and keys inside the overlay away from the game.
                    for (const type of ['pointerdown', 'mousedown', 'touchstart', 'mousemove', 'touchmove']) {
                        root.addEventListener(type, (e) => e.stopPropagation());
                    }
                    document.body.appendChild(root);
                    this.root = root;
                    return root;
                }
                close(notify = true) {
                    var _a;
                    if (!this.root)
                        return;
                    this.root.remove();
                    this.root = null;
                    if (notify)
                        (_a = this.onClose) === null || _a === void 0 ? void 0 : _a.call(this);
                }
                /** First-visit (or rename) prompt: type a name or roll a random one. */
                askName(current, onDone) {
                    const first = !current;
                    const root = this.mount(`
<h2>${first ? '歡迎來到快樂小雞農場！' : '修改名字'}</h2>
<p class="hc-sub">取個名字，上天梯排行榜用<br>最多 6 個中文字或 12 個英文字母</p>
<div class="hc-row"><input class="hc-input" maxlength="40" placeholder="輸入名字…"><button class="hc-btn alt" data-act="dice" title="隨機名字">🎲</button></div>
<div class="hc-preview"></div>
<div class="hc-actions">${first ? '' : '<button class="hc-btn ghost" data-act="cancel">取消</button>'}<button class="hc-btn" data-act="ok">確定</button></div>`);
                    const input = root.querySelector('input');
                    const preview = root.querySelector('.hc-preview');
                    input.value = current !== null && current !== void 0 ? current : randomName();
                    const refresh = () => {
                        const fitted = fitName(input.value);
                        preview.textContent = fitted ? `排行榜上會顯示：${fitted}` : '名字不能空白，可以按 🎲 隨機產生';
                    };
                    refresh();
                    input.addEventListener('input', refresh);
                    const confirm = () => {
                        var _a;
                        const fitted = fitName(input.value) || randomName();
                        this.close(false);
                        onDone(fitted);
                        (_a = this.onClose) === null || _a === void 0 ? void 0 : _a.call(this);
                    };
                    input.addEventListener('keydown', (e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter' && !e.isComposing)
                            confirm();
                    });
                    root.addEventListener('click', (e) => {
                        var _a;
                        const act = (_a = e.target.closest('[data-act]')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-act');
                        if (act === 'dice') {
                            input.value = randomName();
                            refresh();
                        }
                        if (act === 'ok')
                            confirm();
                        if (act === 'cancel')
                            this.close();
                    });
                    setTimeout(() => { input.focus(); input.select(); }, 50);
                }
                /** The weekly ladder: top rows, the player's own rank and the reset countdown. */
                showLadder(entries, me, shared, onRename) {
                    const week = ladderWeek();
                    const left = ladderWeekStart(week + 1) - Date.now();
                    const days = Math.floor(left / DAY_MS);
                    const hours = Math.floor((left % DAY_MS) / 3600000);
                    const minutes = Math.floor((left % 3600000) / 60000);
                    const countdown = days > 0 ? `${days} 天 ${hours} 小時` : `${hours} 小時 ${minutes} 分`;
                    const row = (e, rank) => {
                        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : String(rank);
                        const mine = me && e.id === me.id ? ' me' : '';
                        return `<div class="hc-item${mine}"><span class="hc-rank">${medal}</span><span class="hc-name">${escapeHtml(fitName(e.name))}</span><span class="hc-score">${e.score.toLocaleString()} 分</span></div>`;
                    };
                    const rankOf = (e, i) => { var _a; return (_a = e.rank) !== null && _a !== void 0 ? _a : i + 1; };
                    const shown = entries.filter((e, i) => rankOf(e, i) <= LADDER_SHOW_ROWS);
                    const myIndex = me ? entries.findIndex((e) => e.id === me.id) : -1;
                    const myRank = myIndex >= 0 ? rankOf(entries[myIndex], myIndex) : -1;
                    const mineRow = myRank > LADDER_SHOW_ROWS ? `<div class="hc-mine">${row(entries[myIndex], myRank)}</div>` : '';
                    const status = myRank > 0 ? `你目前第 ${myRank} 名` : '本週還沒有你的成績，玩一局就上榜！';
                    const root = this.mount(`
<h2>🏆 本週天梯</h2>
<p class="hc-sub">每週一早上 6:00 重新排名<br>距離刷新還有 ${countdown}<br>${me ? escapeHtml(me.name) + '，' : ''}${escapeHtml(status)}</p>
<div class="hc-list">${shown.length ? shown.map((e, i) => row(e, rankOf(e, i))).join('') : '<div class="hc-empty">本週還沒有人上榜</div>'}</div>
${mineRow}
<div class="hc-actions"><button class="hc-btn ghost" data-act="rename">✏️ 改名</button><button class="hc-btn" data-act="close">關閉</button></div>
${shared ? '' : '<div class="hc-note">目前是本機紀錄，只會顯示這台裝置上的成績</div>'}`);
                    root.addEventListener('click', (e) => {
                        var _a;
                        const target = e.target;
                        if (target === root) {
                            this.close();
                            return;
                        }
                        const act = (_a = target.closest('[data-act]')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-act');
                        if (act === 'close')
                            this.close();
                        if (act === 'rename')
                            onRename();
                    });
                }
            };
            FarmGame = FarmGame_1 = class FarmGame extends cc_1.Component {
                constructor() {
                    super(...arguments);
                    this.state = 'ready';
                    this.secondsLeft = ROUND_SECONDS;
                    this.score = 0;
                    this.hatched = 0;
                    this.timer = 0;
                    this.eggs = [];
                    this.chicks = [];
                    this.materials = new Map();
                    this.meshes = new Map();
                    this.farmRoot = null;
                    this.eggRoot = null;
                    this.chickRoot = null;
                    this.camera = null;
                    this.uiRoot = null;
                    this.hud = null;
                    this.overlay = null;
                    this.titleLabel = null;
                    this.detailLabel = null;
                    this.hudLabel = null;
                    this.hintLabel = null;
                    this.buttonLabel = null;
                    this.toastLabel = null;
                    this.curtain = null;
                    this.curtainGraphics = null;
                    this.letterboxGraphics = null;
                    this.resultPanel = null;
                    this.resultTitle = null;
                    this.resultHatched = null;
                    this.resultScore = null;
                    this.creditsPanel = null;
                    this.creditsScroll = null;
                    this.creditsLabels = [];
                    this.creditsHeight = 0;
                    this.creditsBack = null;
                    this.animations = [];
                    this.customCursor = '';
                    this.handCursor = '';
                    this.currentCursor = '';
                    this.audio = new GameAudio();
                    this.hen = null;
                    this.henBody = null;
                    this.henVisible = false;
                    this.henPhase = 0;
                    this.mouseTarget = null;
                    this.bubbleRoot = null;
                    this.bubbles = [];
                    this.portrait = false;
                    this.layoutKey = '';
                    this.bounds = { minX: -FARM_HALF_X, maxX: FARM_HALF_X, minZ: -FARM_HALF_Z, maxZ: FARM_HALF_Z, topHalfX: FARM_HALF_X, bottomHalfX: FARM_HALF_X };
                    this.portraitScenery = null;
                    this.fenceRoot = null;
                    this.cloudRoot = null;
                    this.portraitFlowers = null;
                    this.decor = [];
                    this.volumeScale = 1;
                    this.bubbleBoost = 1;
                    this.heartRoot = null;
                    this.hearts = [];
                    this.pendingFloats = 0;
                    this.floatCooldown = 0;
                    this.volumeBodyY = -90;
                    this.replayButton = null;
                    this.creditsButton = null;
                    this.lastSpoke = new Map();
                    this.bubblePoint = new cc_1.Vec3();
                    this.keyEggCooldown = 0;
                    this.keys = new Set();
                    this.volumePanel = null;
                    this.volumeBody = null;
                    this.trophyIcon = null;
                    this.ladderStore = SUPABASE_URL && SUPABASE_ANON_KEY ? new SupabaseLadderStore(SUPABASE_URL, SUPABASE_ANON_KEY) : new LocalLadderStore();
                    this.ladderOverlay = new LadderOverlay();
                    this.player = null;
                    this.resultRank = null;
                    this.volumeOpen = false;
                    this.hudDrop = 0;
                    this.fpsButton = null;
                    this.fpsLabel = null;
                    this.fpsVisible = false;
                    this.sliderFills = [];
                    this.unlockAudio = () => this.audio.unlock();
                    this.screenPoint = new cc_1.Vec3();
                    this.onDomKeyDown = (event) => {
                        // Typing a name or reading the ladder must not start or play the game.
                        if (this.ladderOverlay.open)
                            return;
                        const code = domKeyName(event);
                        if (GAME_KEYS.indexOf(code) >= 0)
                            event.preventDefault();
                        if (event.repeat && this.keys.has(code))
                            return;
                        this.onKeyDown(code);
                    };
                    this.onDomKeyUp = (event) => {
                        this.keys.delete(domKeyName(event));
                    };
                    this.onDomBlur = () => {
                        this.keys.clear();
                    };
                    this.hideToast = () => {
                        this.unschedule(this.hideToast);
                        if (this.toastLabel)
                            this.toastLabel.node.active = false;
                    };
                }
                onLoad() {
                    var _a, _b;
                    this.camera = (_b = (_a = this.node.getChildByName('Main Camera')) === null || _a === void 0 ? void 0 : _a.getComponent(cc_1.Camera)) !== null && _b !== void 0 ? _b : null;
                    if (!this.camera) {
                        console.error('[Happy Chick] Main Camera is missing from the scene.');
                        return;
                    }
                    this.camera.node.setPosition(0, 19, 16.5);
                    this.camera.node.setRotationFromEuler(-48, 0, 0);
                    this.camera.clearFlags = cc_1.Camera.ClearFlag.SOLID_COLOR;
                    this.camera.clearColor = new cc_1.Color(95, 200, 240, 255);
                    this.farmRoot = new cc_1.Node('Farm');
                    this.node.addChild(this.farmRoot);
                    this.eggRoot = new cc_1.Node('Eggs');
                    this.farmRoot.addChild(this.eggRoot);
                    this.chickRoot = new cc_1.Node('Chicks');
                    this.farmRoot.addChild(this.chickRoot);
                    this.buildFarm();
                    this.buildUI();
                    this.installHenCursor();
                    this.buildHen();
                    this.setupPlayer();
                    if (typeof document !== 'undefined') {
                        document.addEventListener('pointerdown', this.unlockAudio);
                        document.addEventListener('keydown', this.unlockAudio);
                    }
                    // Listen on window so keys work even before the canvas has focus (keyboard-only players).
                    if (typeof window !== 'undefined') {
                        window.addEventListener('keydown', this.onDomKeyDown, true);
                        window.addEventListener('keyup', this.onDomKeyUp, true);
                        window.addEventListener('blur', this.onDomBlur);
                    }
                    else {
                        cc_1.input.on(cc_1.Input.EventType.KEY_DOWN, this.onCcKeyDown, this);
                        cc_1.input.on(cc_1.Input.EventType.KEY_UP, this.onCcKeyUp, this);
                    }
                    cc_1.input.on(cc_1.Input.EventType.TOUCH_START, this.onPointerDown, this);
                    cc_1.input.on(cc_1.Input.EventType.TOUCH_MOVE, this.onPointerMove, this);
                    cc_1.input.on(cc_1.Input.EventType.MOUSE_MOVE, this.onPointerMove, this);
                    cc_1.view.on('canvas-resize', this.onCanvasResize, this);
                    this.applyLayoutMode();
                    this.layoutUI();
                }
                onDestroy() {
                    cc_1.input.off(cc_1.Input.EventType.TOUCH_START, this.onPointerDown, this);
                    cc_1.input.off(cc_1.Input.EventType.TOUCH_MOVE, this.onPointerMove, this);
                    cc_1.input.off(cc_1.Input.EventType.MOUSE_MOVE, this.onPointerMove, this);
                    if (typeof window !== 'undefined') {
                        window.removeEventListener('keydown', this.onDomKeyDown, true);
                        window.removeEventListener('keyup', this.onDomKeyUp, true);
                        window.removeEventListener('blur', this.onDomBlur);
                    }
                    else {
                        cc_1.input.off(cc_1.Input.EventType.KEY_DOWN, this.onCcKeyDown, this);
                        cc_1.input.off(cc_1.Input.EventType.KEY_UP, this.onCcKeyUp, this);
                    }
                    if (typeof document !== 'undefined') {
                        document.removeEventListener('pointerdown', this.unlockAudio);
                        document.removeEventListener('keydown', this.unlockAudio);
                    }
                    this.audio.stop();
                    cc_1.view.off('canvas-resize', this.onCanvasResize, this);
                    if (typeof document !== 'undefined' && this.customCursor) {
                        document.body.style.cursor = '';
                    }
                }
                update(deltaTime) {
                    this.updateAnimations(deltaTime);
                    this.updateCredits(deltaTime);
                    if (this.state !== 'playing')
                        return;
                    this.secondsLeft = Math.max(0, this.secondsLeft - deltaTime);
                    this.timer += deltaTime;
                    this.updateEggs(deltaTime);
                    this.updateChicks(deltaTime);
                    this.updateHen(deltaTime);
                    this.updateBubbles(deltaTime);
                    this.updateHearts(deltaTime);
                    this.refreshHud();
                    if (this.secondsLeft <= 0)
                        this.endRound();
                }
                /** Called by the stable, script-free main scene entry after the bundle has loaded. */
                static mount(host) {
                    var _a, _b;
                    const gameNode = (_a = host.getChildByName('Farm Game')) !== null && _a !== void 0 ? _a : new cc_1.Node('Farm Game');
                    if (!gameNode.parent)
                        host.addChild(gameNode);
                    const cameraNode = (_b = gameNode.getChildByName('Main Camera')) !== null && _b !== void 0 ? _b : new cc_1.Node('Main Camera');
                    if (!cameraNode.parent)
                        gameNode.addChild(cameraNode);
                    if (!cameraNode.getComponent(cc_1.Camera))
                        cameraNode.addComponent(cc_1.Camera);
                    cameraNode.setPosition(0, 19, 16.5);
                    cameraNode.setRotationFromEuler(-48, 0, 0);
                    let game = gameNode.getComponent(FarmGame_1);
                    if (!game)
                        game = gameNode.addComponent(FarmGame_1);
                    return game;
                }
                buildFarm() {
                    const root = this.farmRoot;
                    this.addBox(root, 'Soft Grass', 0, -0.18, -20, 160, 0.3, 160, '#77c66e');
                    // Everything that belongs to the walled pen is grouped so phone mode can drop it in one go.
                    const fence = new cc_1.Node('Fence and gate');
                    root.addChild(fence);
                    this.fenceRoot = fence;
                    this.addBox(fence, 'Sunny Meadow', 0, 0.005, 0, FENCE_X * 2 - 0.3, 0.04, FENCE_Z * 2 - 0.3, '#8bd878');
                    this.addBox(fence, 'Farm Path', 0, 0.03, FENCE_Z + 2.6, 2.1, 0.05, 5.0, '#dcb66d');
                    this.buildFence(fence);
                    // Scenery outside the pen; phone mode hides whatever would land on top of the playable screen.
                    this.addDecor(root, 'Barn', -6.4, -FENCE_Z - 2.6, (node) => {
                        this.addBox(node, 'Barn Yard', -6.4, 0.03, -FENCE_Z - 2.3, 5.0, 0.04, 2.8, '#e4c77d');
                        this.buildBarn(node, -6.4, -FENCE_Z - 2.6);
                    });
                    this.addDecor(root, 'Tree', 6.6, -FENCE_Z - 2.4, (node) => this.buildTree(node, 6.6, -FENCE_Z - 2.4));
                    this.addDecor(root, 'Tree', 11.6, -3.2, (node) => this.buildTree(node, 11.6, -3.2));
                    this.addDecor(root, 'Tree', -12.0, -1.0, (node) => this.buildTree(node, -12.0, -1.0));
                    this.addDecor(root, 'Hay', FENCE_X + 1.9, 2.4, (node) => this.buildHay(node, FENCE_X + 1.9, 2.4));
                    this.addDecor(root, 'Hay', -FENCE_X - 1.9, 3.6, (node) => this.buildHay(node, -FENCE_X - 1.9, 3.6));
                    this.buildFlowers(root);
                    this.buildPortraitFlowers(root);
                    const clouds = new cc_1.Node('Clouds');
                    root.addChild(clouds);
                    this.cloudRoot = clouds;
                    this.buildClouds(clouds);
                }
                addDecor(root, name, x, z, build) {
                    const node = new cc_1.Node(name);
                    root.addChild(node);
                    build(node);
                    this.decor.push({ node, x, z });
                }
                /** Extra flowers sprinkled over the playable area, only used in phone mode where the fence's grass is gone. */
                buildPortraitFlowers(root) {
                    const group = new cc_1.Node('Phone flowers');
                    root.addChild(group);
                    this.portraitFlowers = group;
                    const colors = ['#f7f0dc', '#ffc858', '#ee7ca0', '#91d7f5'];
                    for (let i = 0; i < 46; i++) {
                        const x = -5.6 + Math.random() * 11.2;
                        const z = -13 + Math.random() * 26;
                        this.addCylinder(group, 'Flower stem', x, 0.16, z, 0.025, 0.32, '#4c9a4d');
                        this.addSphere(group, 'Flower', x, 0.35, z, 0.12, colors[i % colors.length]);
                    }
                    group.active = false;
                }
                buildFence(root) {
                    const postsX = Math.round(FENCE_X * 2 / 1.2);
                    for (let i = 0; i <= postsX; i++) {
                        const x = -FENCE_X + (FENCE_X * 2 / postsX) * i;
                        this.addBox(root, 'Fence post', x, 0.62, -FENCE_Z, 0.18, 1.22, 0.18, '#9b5a32');
                        if (Math.abs(x) > 1.0)
                            this.addBox(root, 'Fence post front', x, 0.62, FENCE_Z, 0.18, 1.22, 0.18, '#9b5a32');
                    }
                    const sideLength = FENCE_X - 1.0;
                    for (const y of [0.42, 0.88]) {
                        this.addBox(root, 'Back fence rail', 0, y, -FENCE_Z, FENCE_X * 2 + 0.1, 0.16, 0.14, '#bd7841');
                        this.addBox(root, 'Front fence rail left', -1.0 - sideLength / 2, y, FENCE_Z, sideLength, 0.16, 0.14, '#bd7841');
                        this.addBox(root, 'Front fence rail right', 1.0 + sideLength / 2, y, FENCE_Z, sideLength, 0.16, 0.14, '#bd7841');
                    }
                    const postsZ = Math.round(FENCE_Z * 2 / 1.2);
                    for (let i = 1; i < postsZ; i++) {
                        const z = -FENCE_Z + (FENCE_Z * 2 / postsZ) * i;
                        this.addBox(root, 'Left fence post', -FENCE_X, 0.62, z, 0.18, 1.22, 0.18, '#9b5a32');
                        this.addBox(root, 'Right fence post', FENCE_X, 0.62, z, 0.18, 1.22, 0.18, '#9b5a32');
                    }
                    for (const y of [0.42, 0.88]) {
                        this.addBox(root, 'Left fence rail', -FENCE_X, y, 0, 0.14, 0.16, FENCE_Z * 2, '#bd7841');
                        this.addBox(root, 'Right fence rail', FENCE_X, y, 0, 0.14, 0.16, FENCE_Z * 2, '#bd7841');
                    }
                    this.addBox(root, 'Gate post left', -1.0, 0.9, FENCE_Z, 0.24, 1.8, 0.24, '#9b5a32');
                    this.addBox(root, 'Gate post right', 1.0, 0.9, FENCE_Z, 0.24, 1.8, 0.24, '#9b5a32');
                    this.addBox(root, 'Gate sign', 0, 1.75, FENCE_Z, 2.4, 0.6, 0.12, '#f5d889');
                }
                buildBarn(root, x, z) {
                    this.addBox(root, 'Little chicken coop', x, 1.0, z, 2.8, 1.9, 2.1, '#e77d50');
                    const roof = this.addBox(root, 'Barn roof', x, 2.15, z, 3.25, 0.32, 2.5, '#754734');
                    roof.setRotationFromEuler(0, 0, -8);
                    this.addBox(root, 'Coop door', x + 0.4, 0.5, z + 1.08, 0.72, 1.0, 0.08, '#72442d');
                    this.addBox(root, 'Coop window', x - 0.72, 1.25, z + 1.09, 0.5, 0.42, 0.08, '#a9e9f5');
                    this.addBox(root, 'Window crossbar', x - 0.72, 1.25, z + 1.15, 0.06, 0.48, 0.04, '#fff0bd');
                    this.addBox(root, 'Window sill', x - 0.72, 1.25, z + 1.15, 0.54, 0.06, 0.04, '#fff0bd');
                }
                /** Phone scenery: a farmhouse at the back, a low fence in front of it, trees and hills behind; rebuilt whenever the walkable area changes. */
                rebuildPortraitScenery(portrait) {
                    if (this.portraitScenery) {
                        this.portraitScenery.destroy();
                        this.portraitScenery = null;
                    }
                    if (!portrait || !this.farmRoot)
                        return;
                    const root = new cc_1.Node('Phone scenery');
                    this.farmRoot.addChild(root);
                    this.portraitScenery = root;
                    const b = this.bounds;
                    const back = b.minZ;
                    const wide = b.topHalfX + 6;
                    // Ground bands give the view depth: brighter meadow where chicks play, a dirt yard by the house, darker fields behind.
                    this.addBox(root, 'Play meadow', 0, 0.004, (b.minZ + b.maxZ) / 2 + 1, wide * 2, 0.03, b.maxZ - b.minZ + 4, '#8bd878');
                    this.addBox(root, 'House yard', 0, 0.01, back - 3.0, 9.5, 0.03, 5.0, '#e4c77d');
                    this.addBox(root, 'Yard path', 0, 0.015, back - 0.4, 1.5, 0.03, 1.8, '#dcb66d');
                    for (let i = 0; i < 4; i++) {
                        const z = back - 12 - i * 3.2;
                        this.addBox(root, 'Field row', 0, 0.01, z, wide * 2.4, 0.03, 1.5, i % 2 ? '#5fae5a' : '#6dbb5f');
                    }
                    this.addSphere(root, 'Hill', -14, -2.5, back - 30, 10, '#5aa457', [1.6, 0.7, 1]);
                    this.addSphere(root, 'Hill', 12, -3, back - 33, 11, '#4f9a50', [1.7, 0.75, 1]);
                    this.addSphere(root, 'Hill', 0, -4, back - 38, 12, '#66b35e', [2.2, 0.7, 1]);
                    // Low fence right behind the chicks' meadow, with a gap for the path to the door.
                    const fenceZ = back - 0.6;
                    const fenceHalf = b.topHalfX + 4;
                    for (let x = -fenceHalf; x <= fenceHalf + 0.01; x += 1.1) {
                        if (Math.abs(x) < 0.8)
                            continue;
                        this.addBox(root, 'Low fence post', x, 0.32, fenceZ, 0.16, 0.64, 0.16, '#9b5a32');
                        this.addBox(root, 'Low fence cap', x, 0.66, fenceZ, 0.2, 0.06, 0.2, '#7a4526');
                    }
                    const railLength = fenceHalf - 0.8;
                    for (const y of [0.24, 0.5]) {
                        this.addBox(root, 'Low fence rail', -0.8 - railLength / 2, y, fenceZ, railLength, 0.1, 0.1, '#c68548');
                        this.addBox(root, 'Low fence rail', 0.8 + railLength / 2, y, fenceZ, railLength, 0.1, 0.1, '#c68548');
                    }
                    this.buildFarmhouse(root, 0, back - 4.6);
                    this.buildTree(root, -6.2, back - 3.4);
                    this.buildTree(root, 6.4, back - 4.2);
                    this.buildTree(root, -10.5, back - 7.5);
                    this.buildTree(root, 10.8, back - 8.5);
                    this.buildTree(root, -3.8, back - 10.5);
                    this.buildHay(root, 4.0, back - 2.2);
                    this.buildHay(root, -4.2, back - 1.9);
                    // A few flowers on the meadow and along the fence.
                    const colors = ['#f7f0dc', '#ffc858', '#ee7ca0', '#91d7f5'];
                    for (let i = 0; i < 34; i++) {
                        const z = b.minZ + Math.random() * (b.maxZ - b.minZ);
                        const half = this.halfXAt(z);
                        const x = -half + Math.random() * half * 2;
                        this.addCylinder(root, 'Flower stem', x, 0.12, z, 0.025, 0.24, '#4c9a4d');
                        this.addSphere(root, 'Flower', x, 0.27, z, 0.1, colors[i % colors.length]);
                    }
                    for (let i = 0; i < 16; i++) {
                        const x = -fenceHalf + Math.random() * fenceHalf * 2;
                        if (Math.abs(x) < 1.2)
                            continue;
                        this.addSphere(root, 'Fence flower', x, 0.18, fenceZ - 0.35, 0.16, colors[(i + 1) % colors.length]);
                    }
                }
                /** Cream farmhouse with a red gable roof, facing the camera; darker side panels fake light on the unlit material. */
                buildFarmhouse(root, x, z) {
                    const w = 5.0;
                    const h = 2.8;
                    const d = 3.4;
                    this.addBox(root, 'House base', x, 0.08, z, w + 0.4, 0.16, d + 0.4, '#b9a58a');
                    this.addBox(root, 'House walls', x, h / 2 + 0.16, z, w, h, d, '#f4e4c6');
                    this.addBox(root, 'House side shade', x - w / 2 - 0.01, h / 2 + 0.16, z, 0.02, h, d, '#d8c4a2');
                    this.addBox(root, 'House side shade', x + w / 2 + 0.01, h / 2 + 0.16, z, 0.02, h, d, '#e2cfae');
                    // Gable: a triangle-ish front made of stacked slabs, then two sloped roof panels.
                    const slope = 32;
                    for (let i = 0; i < 5; i++) {
                        // Each step stays under the sloped roof so nothing pokes through it.
                        const gw = 2 * (w / 2 - 0.34 * (i + 1) / Math.tan(slope * Math.PI / 180));
                        if (gw < 0.2)
                            break;
                        this.addBox(root, 'Gable', x, h + 0.16 + 0.17 + i * 0.34, z, gw, 0.34, d - 0.02, '#f4e4c6');
                    }
                    const panelLen = (w / 2 + 0.45) / Math.cos(slope * Math.PI / 180);
                    const roofY = h + 0.16 + 0.85;
                    const left = this.addBox(root, 'Roof left', x - (w / 4 + 0.1), roofY, z, panelLen, 0.22, d + 0.7, '#c4553d');
                    left.setRotationFromEuler(0, 0, slope);
                    const right = this.addBox(root, 'Roof right', x + (w / 4 + 0.1), roofY, z, panelLen, 0.22, d + 0.7, '#a94532');
                    right.setRotationFromEuler(0, 0, -slope);
                    this.addBox(root, 'Roof ridge', x, h + 0.16 + 1.62, z, 0.3, 0.2, d + 0.75, '#8c3727');
                    this.addBox(root, 'Chimney', x + 1.4, h + 1.9, z - 0.6, 0.5, 1.2, 0.5, '#9a6b52');
                    const front = z + d / 2 + 0.03;
                    this.addBox(root, 'Door frame', x, 0.86, front, 1.1, 1.5, 0.05, '#fff0bd');
                    this.addBox(root, 'Door', x, 0.82, front + 0.02, 0.9, 1.36, 0.05, '#8a4f2f');
                    this.addSphere(root, 'Door knob', x + 0.3, 0.8, front + 0.06, 0.06, '#ffd35c');
                    for (const wx of [-1.6, 1.6]) {
                        this.addBox(root, 'Window frame', x + wx, 1.75, front, 0.95, 0.85, 0.05, '#fff0bd');
                        this.addBox(root, 'Window', x + wx, 1.75, front + 0.02, 0.78, 0.68, 0.05, '#a9e9f5');
                        this.addBox(root, 'Window bar', x + wx, 1.75, front + 0.05, 0.06, 0.68, 0.03, '#fff0bd');
                        this.addBox(root, 'Window box', x + wx, 1.25, front + 0.1, 1.0, 0.18, 0.22, '#9b5a32');
                        for (const fx of [-0.3, 0, 0.3])
                            this.addSphere(root, 'Window flower', x + wx + fx, 1.4, front + 0.12, 0.1, fx === 0 ? '#ffc858' : '#ee7ca0');
                    }
                    this.addBox(root, 'Door step', x, 0.2, front + 0.35, 1.4, 0.12, 0.6, '#c9b48f');
                    this.addBox(root, 'Gable window', x, h + 0.9, front - 0.01, 0.6, 0.5, 0.05, '#a9e9f5');
                }
                buildTree(root, x, z) {
                    this.addCylinder(root, 'Tree trunk', x, 0.9, z, 0.34, 1.8, '#855231');
                    this.addSphere(root, 'Tree canopy', x, 2.35, z, 1.18, '#4b9c58');
                    this.addSphere(root, 'Tree canopy highlight', x - 0.56, 2.55, z + 0.28, 0.68, '#6ebf63');
                    this.addSphere(root, 'Tree canopy leaf', x + 0.53, 2.25, z - 0.38, 0.7, '#38894d');
                }
                buildHay(root, x, z) {
                    this.addBox(root, 'Hay bale', x, 0.45, z, 1.5, 0.88, 1.0, '#e8bd55');
                    this.addBox(root, 'Hay band', x, 0.45, z + 0.52, 0.12, 0.9, 0.04, '#f5d983');
                }
                buildFlowers(root) {
                    const colors = ['#f7f0dc', '#ffc858', '#ee7ca0', '#91d7f5'];
                    let placed = 0;
                    for (let i = 0; i < 400 && placed < 70; i++) {
                        const x = -15 + Math.random() * 30;
                        const z = -12 + Math.random() * 22;
                        const insideFence = Math.abs(x) < FENCE_X + 0.4 && Math.abs(z) < FENCE_Z + 0.4;
                        // Keep the pen open for chicks: only a few flowers inside, none on the path or by the barn.
                        if (insideFence && Math.random() > 0.12)
                            continue;
                        if (Math.abs(x) < 1.6 && z > FENCE_Z - 0.5)
                            continue;
                        if (x < -3.4 && x > -9.4 && z < -FENCE_Z + 0.2 && z > -FENCE_Z - 4.4)
                            continue;
                        this.addCylinder(root, 'Flower stem', x, 0.16, z, 0.025, 0.32, '#4c9a4d');
                        this.addSphere(root, 'Flower', x, 0.35, z, 0.12, colors[placed % colors.length]);
                        placed++;
                    }
                }
                buildClouds(root) {
                    const cloudMaterial = '#e9fbff';
                    for (const [x, y, z] of [[-11, 7.5, -15], [9, 8.5, -16], [0.5, 9.5, -19]]) {
                        this.addSphere(root, 'Cloud', x, y, z, 1.0, cloudMaterial, [1.5, 0.6, 0.8]);
                        this.addSphere(root, 'Cloud puff', x + 0.9, y + 0.22, z, 0.72, cloudMaterial, [1.2, 0.75, 0.8]);
                        this.addSphere(root, 'Cloud puff', x - 0.9, y + 0.05, z, 0.65, cloudMaterial, [1.1, 0.65, 0.8]);
                    }
                }
                buildUI() {
                    const scene = cc_1.director.getScene();
                    const cameraNode = new cc_1.Node('UI Camera');
                    scene.addChild(cameraNode);
                    cameraNode.setPosition(0, 0, 1000);
                    const uiCamera = cameraNode.addComponent(cc_1.Camera);
                    uiCamera.projection = cc_1.Camera.ProjectionType.ORTHO;
                    uiCamera.priority = 10;
                    uiCamera.clearFlags = cc_1.Camera.ClearFlag.DEPTH_ONLY;
                    this.uiRoot = new cc_1.Node('Farm UI');
                    scene.addChild(this.uiRoot);
                    const uiTransform = this.uiRoot.addComponent(cc_1.UITransform);
                    const canvas = this.uiRoot.addComponent(cc_1.Canvas);
                    canvas.alignCanvasWithScreen = true;
                    canvas.cameraComponent = uiCamera;
                    uiTransform.setAnchorPoint(0.5, 0.5);
                    this.bubbleRoot = new cc_1.Node('Speech bubbles');
                    this.uiRoot.addChild(this.bubbleRoot);
                    this.heartRoot = new cc_1.Node('Floating hearts');
                    this.uiRoot.addChild(this.heartRoot);
                    this.hud = new cc_1.Node('HUD');
                    this.uiRoot.addChild(this.hud);
                    this.drawPanel(this.hud, 0, 0, 560, 108, new cc_1.Color(29, 79, 75, 230), 24);
                    this.hudLabel = this.makeLabel(this.hud, 'Score and timer', '', 28, new cc_1.Color(255, 249, 217), 0, 16, 530, 48);
                    this.hintLabel = this.makeLabel(this.hud, 'How to play', '點一下農場，母雞就會下蛋！', 20, new cc_1.Color(255, 246, 199), 0, -27, 530, 36);
                    this.hud.active = false;
                    this.overlay = new cc_1.Node('Start and result screen');
                    this.uiRoot.addChild(this.overlay);
                    this.drawPanel(this.overlay, 0, 0, 610, 440, new cc_1.Color(25, 115, 156, 238), 36);
                    this.drawPanel(this.overlay, 0, 143, 110, 110, new cc_1.Color(71, 178, 207, 255), 55);
                    const badge = new cc_1.Node('Hen badge');
                    this.overlay.addChild(badge);
                    badge.setPosition(0, 143, 0);
                    this.makeHenBadge(badge, 0.85);
                    this.titleLabel = this.makeLabel(this.overlay, 'Game title', '快樂小雞農場', 48, new cc_1.Color(255, 249, 226), 0, 62, 560, 72);
                    this.detailLabel = this.makeLabel(this.overlay, 'Game instructions', '30 秒內孵出更多小雞！\n滑鼠點農場，或 WASD 移動＋空白鍵下蛋', 25, new cc_1.Color(231, 250, 250), 0, -13, 560, 92);
                    this.makeActionButton(this.overlay);
                    this.buildResultsCurtain();
                    this.buildVolumePanel();
                    this.buildFpsButton();
                    this.toastLabel = this.makeLabel(this.uiRoot, 'Farm message', '', 25, new cc_1.Color(255, 249, 218), 0, 0, 520, 52);
                    this.toastLabel.node.active = false;
                    // Keep 2D UI on its own layer so only the UI camera draws it (the 3D cameras would otherwise render it huge).
                    const UI_2D = cc_1.Layers.Enum.UI_2D;
                    const setLayer = (node) => {
                        node.layer = UI_2D;
                        node.children.forEach(setLayer);
                    };
                    setLayer(this.uiRoot);
                    uiCamera.visibility = UI_2D;
                    scene.getComponentsInChildren(cc_1.Camera).forEach((cam) => {
                        if (cam !== uiCamera)
                            cam.visibility &= ~UI_2D;
                    });
                }
                /** Flat cartoon hen matching the reference art: round body, red crown, beak, small wing, thin legs. */
                makeHenBadge(parent, size = 1) {
                    const node = new cc_1.Node('Hen drawing');
                    parent.addChild(node);
                    node.setScale(size, size, 1);
                    node.addComponent(cc_1.UITransform).setContentSize(100, 100);
                    const g = node.addComponent(cc_1.Graphics);
                    const ink = new cc_1.Color(43, 33, 24);
                    g.lineWidth = 4;
                    g.lineJoin = cc_1.Graphics.LineJoin.ROUND;
                    g.lineCap = cc_1.Graphics.LineCap.ROUND;
                    g.strokeColor = ink;
                    // legs
                    g.moveTo(-8, -26);
                    g.lineTo(-12, -44);
                    g.moveTo(-20, -48);
                    g.lineTo(-12, -44);
                    g.lineTo(-6, -50);
                    g.moveTo(10, -26);
                    g.lineTo(12, -44);
                    g.moveTo(4, -48);
                    g.lineTo(12, -44);
                    g.lineTo(18, -50);
                    g.stroke();
                    // crown
                    g.fillColor = new cc_1.Color(226, 30, 50);
                    g.moveTo(-12, 22);
                    g.lineTo(-13, 38);
                    g.lineTo(-5, 31);
                    g.lineTo(1, 42);
                    g.lineTo(7, 31);
                    g.lineTo(15, 38);
                    g.lineTo(13, 22);
                    g.close();
                    g.fill();
                    g.stroke();
                    // wing
                    g.fillColor = new cc_1.Color(255, 230, 0);
                    g.moveTo(22, 2);
                    g.lineTo(40, 8);
                    g.lineTo(36, 0);
                    g.lineTo(42, -6);
                    g.lineTo(34, -10);
                    g.lineTo(22, -10);
                    g.close();
                    g.fill();
                    g.stroke();
                    // body
                    g.circle(0, 0, 28);
                    g.fill();
                    g.stroke();
                    // beak
                    g.fillColor = new cc_1.Color(255, 214, 0);
                    g.moveTo(-24, 10);
                    g.lineTo(-44, 4);
                    g.lineTo(-25, -6);
                    g.close();
                    g.fill();
                    g.stroke();
                    // eye
                    g.fillColor = ink;
                    g.circle(-10, 8, 3.5);
                    g.fill();
                }
                makeButton(parent, name, text, x, y, width, height, fill, textColor, fontSize, handler) {
                    const buttonNode = new cc_1.Node(name);
                    parent.addChild(buttonNode);
                    buttonNode.setPosition(x, y, 0);
                    buttonNode.addComponent(cc_1.UITransform).setContentSize(width, height);
                    const background = buttonNode.addComponent(cc_1.Graphics);
                    background.fillColor = new cc_1.Color(0, 0, 0, 70);
                    background.roundRect(-width / 2, -height / 2 - 6, width, height, 30);
                    background.fill();
                    background.fillColor = fill;
                    background.roundRect(-width / 2, -height / 2, width, height, 30);
                    background.fill();
                    const button = buttonNode.addComponent(cc_1.Button);
                    button.transition = cc_1.Button.Transition.SCALE;
                    button.zoomScale = 0.94;
                    buttonNode.on(cc_1.Button.EventType.CLICK, () => { this.audio.unlock(); this.audio.click(); handler.call(this); }, this);
                    this.makeLabel(buttonNode, 'Button title', text, fontSize, textColor, 0, 0, width - 20, height - 10);
                    return buttonNode;
                }
                /** Full-screen "end of the movie" page that drops from the top when a round ends. */
                buildResultsCurtain() {
                    const curtain = new cc_1.Node('Results curtain');
                    this.uiRoot.addChild(curtain);
                    curtain.addComponent(cc_1.UITransform).setContentSize(100, 100);
                    // Swallow clicks so nothing behind the curtain reacts.
                    curtain.addComponent(cc_1.Button).transition = cc_1.Button.Transition.NONE;
                    this.curtainGraphics = curtain.addComponent(cc_1.Graphics);
                    this.curtain = curtain;
                    const results = new cc_1.Node('Results');
                    curtain.addChild(results);
                    this.resultPanel = results;
                    const gold = new cc_1.Color(255, 214, 102);
                    this.makeLabel(results, 'The end', '— 本 局 落 幕 —', 26, gold, 0, 232, 600, 40);
                    this.resultTitle = this.makeLabel(results, 'Result title', '時間到！', 72, new cc_1.Color(255, 250, 235), 0, 160, 700, 96);
                    const badge = new cc_1.Node('Result hen');
                    results.addChild(badge);
                    badge.setPosition(0, 50, 0);
                    this.makeHenBadge(badge, 1.1);
                    this.resultHatched = this.makeLabel(results, 'Result hatched', '', 36, new cc_1.Color(255, 243, 200), 0, -40, 700, 52);
                    this.resultScore = this.makeLabel(results, 'Result score', '', 36, new cc_1.Color(255, 243, 200), 0, -92, 700, 52);
                    this.resultRank = this.makeLabel(results, 'Result rank', '', 28, new cc_1.Color(255, 214, 102), 0, -142, 700, 40);
                    this.replayButton = this.makeButton(results, 'Replay button', '再玩一次　▶', -185, -236, 340, 104, new cc_1.Color(255, 205, 74), new cc_1.Color(91, 57, 31), 36, this.onReplay);
                    this.creditsButton = this.makeButton(results, 'Credits button', '製作團隊　🎬', 185, -236, 340, 104, new cc_1.Color(120, 205, 235), new cc_1.Color(20, 52, 74), 36, this.onShowCredits);
                    const credits = new cc_1.Node('Credits');
                    curtain.addChild(credits);
                    this.creditsPanel = credits;
                    const scroll = new cc_1.Node('Credits roll');
                    credits.addChild(scroll);
                    this.creditsScroll = scroll;
                    let y = 0;
                    this.creditsLabels = [];
                    for (const [line, size] of CREDITS) {
                        const label = this.makeLabel(scroll, 'Credit line', line, size, size >= 34 ? gold : new cc_1.Color(240, 240, 240), 0, y, 900, size * 1.6);
                        label.node.setPosition(0, y - size * 0.8, 0);
                        this.creditsLabels.push(label);
                        y -= size * 1.9;
                    }
                    this.creditsHeight = -y;
                    this.creditsBack = this.makeButton(credits, 'Credits back', '◀ 返回', 0, 0, 160, 64, new cc_1.Color(255, 205, 74), new cc_1.Color(91, 57, 31), 28, this.onHideCredits);
                    credits.active = false;
                    // Letterbox bars sit above the credits so the roll slides under them like a cinema screen.
                    const letterbox = new cc_1.Node('Letterbox');
                    curtain.addChild(letterbox);
                    letterbox.addComponent(cc_1.UITransform).setContentSize(100, 100);
                    this.letterboxGraphics = letterbox.addComponent(cc_1.Graphics);
                    curtain.active = false;
                }
                drawCurtain(width, height) {
                    var _a, _b;
                    const g = this.curtainGraphics;
                    if (!g)
                        return;
                    g.clear();
                    g.fillColor = new cc_1.Color(16, 30, 52, 255);
                    g.rect(-width / 2, -height / 2, width, height);
                    g.fill();
                    // Cinema letterbox bars and a thin gold trim.
                    const bar = Math.min(70, height * 0.08);
                    const lb = this.letterboxGraphics;
                    if (!lb)
                        return;
                    lb.clear();
                    lb.fillColor = new cc_1.Color(0, 0, 0, 255);
                    lb.rect(-width / 2, height / 2 - bar, width, bar);
                    lb.rect(-width / 2, -height / 2, width, bar);
                    lb.fill();
                    lb.fillColor = new cc_1.Color(214, 170, 70, 255);
                    lb.rect(-width / 2, height / 2 - bar - 4, width, 4);
                    lb.rect(-width / 2, -height / 2 + bar, width, 4);
                    lb.fill();
                    (_b = (_a = this.curtain) === null || _a === void 0 ? void 0 : _a.getComponent(cc_1.UITransform)) === null || _b === void 0 ? void 0 : _b.setContentSize(width, height);
                }
                animateY(node, fromY, toY, duration, done) {
                    this.animations = this.animations.filter((animation) => animation.node !== node);
                    node.setPosition(node.position.x, fromY, 0);
                    this.animations.push({ node, fromY, toY, time: 0, duration, done });
                }
                updateAnimations(deltaTime) {
                    if (!this.animations.length)
                        return;
                    const finished = [];
                    for (const animation of this.animations) {
                        animation.time = Math.min(animation.duration, animation.time + deltaTime);
                        const t = animation.time / animation.duration;
                        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                        animation.node.setPosition(animation.node.position.x, animation.fromY + (animation.toY - animation.fromY) * eased, 0);
                        if (t >= 1)
                            finished.push(animation);
                    }
                    this.animations = this.animations.filter((animation) => finished.indexOf(animation) < 0);
                    finished.forEach((animation) => { var _a; return (_a = animation.done) === null || _a === void 0 ? void 0 : _a.call(animation); });
                }
                isAnimating() {
                    return this.animations.length > 0;
                }
                onReplay() {
                    if (this.isAnimating() || !this.curtain)
                        return;
                    this.farmRoot.active = true;
                    this.resetRound();
                    const height = cc_1.view.getVisibleSize().height;
                    this.animateY(this.curtain, 0, height, CURTAIN_LIFT_SECONDS, () => {
                        this.curtain.active = false;
                        this.startRound();
                    });
                }
                /** First visit: ask for a name (or roll a random one) and remember it with a private player id. */
                setupPlayer() {
                    if (typeof document === 'undefined')
                        return;
                    this.player = loadPlayer();
                    this.ladderOverlay.onClose = () => this.updateCursor(0, 0);
                    if (!this.player) {
                        this.ladderOverlay.askName(null, (name) => {
                            this.player = { id: randomId(), name };
                            savePlayer(this.player);
                        });
                    }
                }
                submitScore() {
                    if (this.resultRank)
                        this.resultRank.string = '';
                    if (!this.player || this.score <= 0)
                        return;
                    const week = ladderWeek();
                    const player = this.player;
                    const entry = { id: player.id, name: player.name, score: this.score, hatched: this.hatched, at: Date.now() };
                    this.ladderStore.submit(week, entry)
                        .then(() => this.ladderStore.top(week, player.id))
                        .then((entries) => {
                        var _a;
                        const index = entries.findIndex((e) => e.id === player.id);
                        if (index < 0 || !this.resultRank || this.state !== 'ended')
                            return;
                        const rank = (_a = entries[index].rank) !== null && _a !== void 0 ? _a : index + 1;
                        const best = entries[index].score;
                        this.resultRank.string = best > this.score
                            ? `🏆 本週第 ${rank} 名（最佳 ${best} 分）`
                            : `🏆 本週天梯第 ${rank} 名！`;
                    })
                        .catch(() => {
                        if (this.resultRank && this.state === 'ended')
                            this.resultRank.string = '🏆 排行榜連線失敗，成績先記在這台裝置';
                    });
                }
                onShowLadder() {
                    var _a, _b;
                    if (this.state === 'playing' || typeof document === 'undefined')
                        return;
                    this.setVolumeOpen(false);
                    const week = ladderWeek();
                    this.ladderStore.top(week, (_b = (_a = this.player) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null)
                        .then((entries) => this.ladderOverlay.showLadder(entries, this.player, this.ladderStore.shared, () => this.onRename()))
                        .catch(() => this.showToast('排行榜暫時連不上，稍後再試試。'));
                }
                onRename() {
                    var _a, _b;
                    this.ladderOverlay.askName((_b = (_a = this.player) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null, (name) => {
                        var _a, _b;
                        this.player = { id: (_b = (_a = this.player) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : randomId(), name };
                        savePlayer(this.player);
                        this.ladderStore.rename(ladderWeek(), this.player)
                            .catch(() => { })
                            .then(() => this.onShowLadder());
                    });
                }
                onShowCredits() {
                    if (this.isAnimating())
                        return;
                    this.creditsLabels.forEach((label, i) => {
                        label.string = CREDITS[i][0].replace('{hatched}', String(this.hatched));
                    });
                    this.resultPanel.active = false;
                    this.creditsPanel.active = true;
                    this.state = 'credits';
                    if (this.volumePanel)
                        this.volumePanel.active = false;
                    const height = cc_1.view.getVisibleSize().height;
                    this.creditsScroll.setPosition(0, -height / 2, 0);
                }
                onHideCredits() {
                    this.creditsPanel.active = false;
                    this.resultPanel.active = true;
                    if (this.volumePanel)
                        this.volumePanel.active = true;
                    this.state = 'ended';
                }
                updateCredits(deltaTime) {
                    if (this.state !== 'credits' || !this.creditsScroll)
                        return;
                    const height = cc_1.view.getVisibleSize().height;
                    const y = this.creditsScroll.position.y + CREDITS_SPEED * deltaTime;
                    this.creditsScroll.setPosition(0, y, 0);
                    if (y - this.creditsHeight > height / 2)
                        this.onHideCredits();
                }
                makeActionButton(parent) {
                    const buttonNode = new cc_1.Node('Start button');
                    parent.addChild(buttonNode);
                    buttonNode.setPosition(0, -143, 0);
                    buttonNode.addComponent(cc_1.UITransform).setContentSize(310, 76);
                    const background = buttonNode.addComponent(cc_1.Graphics);
                    background.fillColor = new cc_1.Color(255, 205, 74);
                    background.roundRect(-155, -38, 310, 76, 26);
                    background.fill();
                    const button = buttonNode.addComponent(cc_1.Button);
                    button.transition = cc_1.Button.Transition.NONE;
                    buttonNode.on(cc_1.Button.EventType.CLICK, this.onActionButton, this);
                    this.buttonLabel = this.makeLabel(buttonNode, 'Button title', '開始遊戲　▶', 31, new cc_1.Color(91, 57, 31), 0, 0, 300, 68);
                }
                drawPanel(parent, x, y, width, height, fill, radius) {
                    const node = new cc_1.Node('Rounded panel');
                    parent.addChild(node);
                    node.setPosition(x, y, 0);
                    node.addComponent(cc_1.UITransform).setContentSize(width, height);
                    const graphics = node.addComponent(cc_1.Graphics);
                    graphics.fillColor = fill;
                    graphics.roundRect(-width / 2, -height / 2, width, height, radius);
                    graphics.fill();
                }
                makeLabel(parent, name, text, size, tint, x, y, width, height) {
                    const node = new cc_1.Node(name);
                    parent.addChild(node);
                    node.setPosition(x, y, 0);
                    node.addComponent(cc_1.UITransform).setContentSize(width, height);
                    const label = node.addComponent(cc_1.Label);
                    label.useSystemFont = true;
                    label.fontFamily = 'Arial';
                    label.fontSize = size;
                    label.lineHeight = Math.round(size * 1.35);
                    label.color = tint;
                    label.string = text;
                    return label;
                }
                onCanvasResize() {
                    this.applyLayoutMode();
                    this.layoutUI();
                }
                /** Landscape keeps the fenced pen; portrait (phones) drops the fence so the whole screen is the farm. */
                applyLayoutMode() {
                    const canvas = cc_1.view.getCanvasSize();
                    if (canvas.width <= 0 || canvas.height <= 0 || !this.camera)
                        return;
                    const portrait = canvas.height > canvas.width;
                    const key = portrait ? `p${canvas.width.toFixed(0)}x${canvas.height.toFixed(0)}` : 'l';
                    if (key === this.layoutKey)
                        return;
                    const modeChanged = portrait !== this.portrait || this.layoutKey === '';
                    this.layoutKey = key;
                    this.portrait = portrait;
                    if (modeChanged) {
                        // Fixed width keeps UI sizes predictable: 1280 wide on desktop, 640 wide on a phone held upright.
                        if (portrait)
                            cc_1.view.setDesignResolutionSize(DESIGN_WIDTH_PORTRAIT, DESIGN_HEIGHT_PORTRAIT, cc_1.ResolutionPolicy.FIXED_WIDTH);
                        else
                            cc_1.view.setDesignResolutionSize(DESIGN_WIDTH_LANDSCAPE, DESIGN_HEIGHT_LANDSCAPE, cc_1.ResolutionPolicy.FIXED_WIDTH);
                    }
                    this.volumeScale = portrait ? 1.3 : 1;
                    this.bubbleBoost = portrait ? 1.35 : 1;
                    if (this.fenceRoot)
                        this.fenceRoot.active = !portrait;
                    if (this.cloudRoot)
                        this.cloudRoot.active = !portrait;
                    if (!portrait) {
                        this.camera.node.setPosition(0, 19, 16.5);
                        this.camera.node.setRotationFromEuler(-48, 0, 0);
                        this.bounds = { minX: -FARM_HALF_X, maxX: FARM_HALF_X, minZ: -FARM_HALF_Z, maxZ: FARM_HALF_Z, topHalfX: FARM_HALF_X, bottomHalfX: FARM_HALF_X };
                    }
                    else {
                        this.setupPortraitCamera(canvas.width / canvas.height);
                    }
                    if (this.portraitFlowers)
                        this.portraitFlowers.active = false;
                    for (const item of this.decor)
                        item.node.active = !portrait;
                    this.rebuildPortraitScenery(portrait);
                    this.clampToBounds();
                    if (this.detailLabel && this.state === 'ready')
                        this.detailLabel.string = this.introText();
                    if (this.hintLabel && this.state === 'playing')
                        this.hintLabel.string = this.hintText();
                }
                /** Near top-down camera sized so about 9.6 world units span the phone's width; derives the playable rectangle from what the screen shows. */
                setupPortraitCamera(aspect) {
                    const cam = this.camera;
                    const fov = (cam.fov || 45) * Math.PI / 180;
                    const ty = Math.tan(fov / 2);
                    const tx = ty * aspect;
                    const pitch = PORTRAIT_PITCH * Math.PI / 180;
                    const sin = Math.sin(pitch);
                    const cos = Math.cos(pitch);
                    const factor = (ny) => sin - ny * ty * cos;
                    const height = PORTRAIT_HALF_WIDTH / tx * factor(PORTRAIT_NDC_BOTTOM);
                    const tBottom = height / factor(PORTRAIT_NDC_BOTTOM);
                    const tTop = height / factor(PORTRAIT_NDC_TOP);
                    const zBottom = (-cos - PORTRAIT_NDC_BOTTOM * ty * sin) * tBottom;
                    const zTop = (-cos - PORTRAIT_NDC_TOP * ty * sin) * tTop;
                    const camZ = -(zBottom + zTop) / 2;
                    cam.node.setPosition(0, height, camZ);
                    cam.node.setRotationFromEuler(-PORTRAIT_PITCH, 0, 0);
                    const bottomHalfX = tx * tBottom - 0.3;
                    const topHalfX = tx * tTop - 0.3;
                    const halfWidth = Math.max(bottomHalfX, topHalfX);
                    this.bounds = { minX: -halfWidth, maxX: halfWidth, minZ: camZ + zTop, maxZ: camZ + zBottom, topHalfX, bottomHalfX };
                }
                /** Half-width of the walkable ground at depth z (wider toward the back in the phone's perspective view). */
                halfXAt(z) {
                    const b = this.bounds;
                    const t = Math.max(0, Math.min(1, (b.maxZ - z) / Math.max(0.001, b.maxZ - b.minZ)));
                    return b.bottomHalfX + (b.topHalfX - b.bottomHalfX) * t;
                }
                clampZ(z, margin) {
                    return Math.max(this.bounds.minZ + margin, Math.min(this.bounds.maxZ - margin, z));
                }
                clampX(x, z, margin) {
                    const h = this.halfXAt(z) - margin;
                    return Math.max(-h, Math.min(h, x));
                }
                clampToBounds() {
                    const clamp = (n, margin) => {
                        const p = n.position;
                        const z = this.clampZ(p.z, margin * 0.85);
                        n.setPosition(this.clampX(p.x, z, margin), p.y, z);
                    };
                    this.chicks.forEach((chick) => clamp(chick.node, 0.65));
                    this.eggs.forEach((egg) => {
                        clamp(egg.node, 0.6);
                        egg.x = egg.node.position.x;
                        egg.z = egg.node.position.z;
                    });
                    if (this.hen)
                        clamp(this.hen, 0.7);
                    this.mouseTarget = null;
                }
                introText() {
                    return this.portrait
                        ? '30 秒內孵出更多小雞！\n點螢幕任何地方下蛋，3 秒後自動孵化。'
                        : '30 秒內孵出更多小雞！\n滑鼠點農場，或 WASD 移動＋空白鍵下蛋';
                }
                hintText() {
                    return this.portrait ? '點螢幕下蛋　•　拖曳移動母雞　•　每隻 100 分' : '點草地／空白鍵下蛋　•　WASD 移動母雞　•　每隻 100 分';
                }
                layoutUI() {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                    if (!this.uiRoot)
                        return;
                    const size = cc_1.view.getVisibleSize();
                    // The UI camera stays at the origin, so the canvas root must too.
                    this.uiRoot.setPosition(0, 0, 0);
                    const uiTransform = this.uiRoot.getComponent(cc_1.UITransform);
                    uiTransform === null || uiTransform === void 0 ? void 0 : uiTransform.setContentSize(size.width, size.height);
                    const hudScale = Math.min(1, (size.width - 24) / 560);
                    (_a = this.hud) === null || _a === void 0 ? void 0 : _a.setScale(hudScale, hudScale, 1);
                    // Volume panel sits top-right; slide the HUD left so they never overlap, or drop the panel below it on narrow screens.
                    const vs = this.volumeScale;
                    (_b = this.volumePanel) === null || _b === void 0 ? void 0 : _b.setScale(vs, vs, 1);
                    const iconHalf = 28 * vs;
                    const panelX = size.width / 2 - iconHalf - 10;
                    const panelY = size.height / 2 - iconHalf - 10;
                    const hudHalf = 280 * hudScale;
                    let hudX = 0;
                    this.hudDrop = 0;
                    const iconsLeft = panelX - iconHalf - 68 * vs;
                    if (hudX + hudHalf > iconsLeft - 10)
                        hudX = iconsLeft - 10 - hudHalf;
                    if (hudX - hudHalf < -size.width / 2 + 10) {
                        hudX = 0;
                        this.hudDrop = 2 * iconHalf + 6;
                    }
                    (_c = this.hud) === null || _c === void 0 ? void 0 : _c.setPosition(hudX, size.height / 2 - 82 - this.hudDrop, 0);
                    // On a narrow screen the sliders open below the HUD instead of on top of it.
                    this.volumeBodyY = this.hudDrop > 0 ? (-82 - this.hudDrop - 54 * hudScale - 24 * vs) / vs : -90;
                    (_d = this.volumeBody) === null || _d === void 0 ? void 0 : _d.setPosition(28 - 165, this.volumeBodyY, 0);
                    (_e = this.volumePanel) === null || _e === void 0 ? void 0 : _e.setPosition(panelX, panelY, 0);
                    const fs = this.portrait ? 1.5 : 1;
                    (_f = this.fpsButton) === null || _f === void 0 ? void 0 : _f.setScale(fs, fs, 1);
                    (_g = this.fpsButton) === null || _g === void 0 ? void 0 : _g.setPosition(size.width / 2 - 66 * fs + 12 * (fs - 1), -size.height / 2 + 30 * fs, 0);
                    const overlayScale = Math.min(1, (size.width - 28) / 610, (size.height - 36) / 440);
                    (_h = this.overlay) === null || _h === void 0 ? void 0 : _h.setScale(overlayScale, overlayScale, 1);
                    if (this.overlay)
                        this.overlay.setPosition(0, this.portrait ? -size.height * 0.14 : 0, 0);
                    this.drawCurtain(size.width, size.height);
                    // Results: buttons sit side by side on a wide screen and stack on a phone so everything can be larger.
                    const resultScale = this.portrait
                        ? Math.min(1.3, (size.width - 40) / 520, (size.height - 120) / 700)
                        : Math.min(1, (size.width - 28) / 760, (size.height - 60) / 600);
                    (_j = this.resultPanel) === null || _j === void 0 ? void 0 : _j.setScale(resultScale, resultScale, 1);
                    (_k = this.resultPanel) === null || _k === void 0 ? void 0 : _k.setPosition(0, (this.portrait ? 80 : 20) * resultScale, 0);
                    (_l = this.replayButton) === null || _l === void 0 ? void 0 : _l.setPosition(this.portrait ? 0 : -185, this.portrait ? -246 : -236, 0);
                    (_m = this.creditsButton) === null || _m === void 0 ? void 0 : _m.setPosition(this.portrait ? 0 : 185, this.portrait ? -370 : -236, 0);
                    const creditScale = this.portrait ? Math.min(1.2, (size.width - 28) / 520) : Math.min(1, (size.width - 28) / 900);
                    (_o = this.creditsPanel) === null || _o === void 0 ? void 0 : _o.setScale(creditScale, creditScale, 1);
                    // Back button stays top-left in both layouts; the music and ladder icons are hidden on this page.
                    (_p = this.creditsBack) === null || _p === void 0 ? void 0 : _p.setPosition(-(size.width / 2) / creditScale + 110, (size.height / 2) / creditScale - 120, 0);
                    this.refreshHud();
                }
                onActionButton() {
                    this.audio.unlock();
                    this.audio.click();
                    if (this.state === 'ready')
                        this.startRound();
                }
                startRound() {
                    var _a, _b;
                    this.state = 'playing';
                    if (this.trophyIcon)
                        this.trophyIcon.active = false;
                    this.ladderOverlay.close(false);
                    this.secondsLeft = ROUND_SECONDS;
                    this.score = 0;
                    this.hatched = 0;
                    this.timer = 0;
                    this.eggs.forEach((egg) => egg.node.destroy());
                    this.chicks.forEach((chick) => chick.node.destroy());
                    this.eggs.length = 0;
                    this.chicks.length = 0;
                    this.overlay.active = false;
                    this.hud.active = true;
                    this.currentCursor = '';
                    this.keys.clear();
                    this.mouseTarget = null;
                    (_a = this.hen) === null || _a === void 0 ? void 0 : _a.setPosition(0, 0, Math.max(this.bounds.minZ + 1, Math.min(this.bounds.maxZ - 1, 2)));
                    (_b = this.hen) === null || _b === void 0 ? void 0 : _b.setRotationFromEuler(0, 0, 0);
                    // The hen is always on the farm so keyboard players can see who they move.
                    this.setHenVisible(true);
                    this.hintLabel.string = this.hintText();
                    this.refreshHud();
                }
                resetRound() {
                    this.secondsLeft = ROUND_SECONDS;
                    this.score = 0;
                    this.hatched = 0;
                    this.eggs.forEach((egg) => egg.node.destroy());
                    this.chicks.forEach((chick) => chick.node.destroy());
                    this.eggs.length = 0;
                    this.chicks.length = 0;
                }
                endRound() {
                    this.state = 'ended';
                    this.eggs.forEach((egg) => egg.node.destroy());
                    this.eggs.length = 0;
                    this.hud.active = false;
                    this.hideToast();
                    this.clearBubbles();
                    this.clearHearts();
                    this.updateCursor(0, 0);
                    if (this.hen)
                        this.hen.active = false;
                    this.resultTitle.string = '時間到！';
                    this.resultHatched.string = `🐣 本局孵化　${this.hatched} 隻小雞`;
                    this.resultScore.string = `⭐ 農場總分　${this.score} 分`;
                    if (this.trophyIcon)
                        this.trophyIcon.active = true;
                    this.setVolumeOpen(false);
                    this.submitScore();
                    this.resultPanel.active = true;
                    this.creditsPanel.active = false;
                    if (this.volumePanel)
                        this.volumePanel.active = true;
                    const curtain = this.curtain;
                    curtain.active = true;
                    const height = cc_1.view.getVisibleSize().height;
                    // Drop the results page from the top like a film's closing card, then hide the farm behind it.
                    this.animateY(curtain, height, 0, CURTAIN_DROP_SECONDS, () => {
                        this.farmRoot.active = false;
                    });
                    this.refreshHud();
                }
                onPointerDown(event) {
                    if (this.state !== 'playing')
                        return;
                    const ui = event.getUILocation();
                    // Ignore taps on the HUD strip and the volume panel.
                    if (this.isOverUi(ui.x, ui.y))
                        return;
                    const location = event.getLocation();
                    const point = this.screenToFarm(location.x, location.y);
                    if (!point || !this.hen)
                        return;
                    // One hen for mouse, touch and keyboard: she steps to the tapped spot and lays the egg there.
                    this.hen.setPosition(point.x, 0, point.z);
                    this.mouseTarget = null;
                    this.henLayEgg();
                }
                layEgg(x, z) {
                    this.spawnEgg(x, z);
                    this.audio.cluck();
                }
                onPointerMove(event) {
                    const ui = event.getUILocation();
                    const location = event.getLocation();
                    const point = this.camera && this.state === 'playing' && !this.isOverUi(ui.x, ui.y)
                        ? this.screenToFarm(location.x, location.y) : null;
                    this.updateCursor(ui.x, ui.y, !!point);
                    // The mouse leads the same hen the keyboard moves.
                    if (point)
                        this.mouseTarget = point;
                }
                onCcKeyDown(event) {
                    const code = CC_KEY_NAMES[event.keyCode];
                    if (code && !this.keys.has(code))
                        this.onKeyDown(code);
                }
                onCcKeyUp(event) {
                    const code = CC_KEY_NAMES[event.keyCode];
                    if (code)
                        this.keys.delete(code);
                }
                onKeyDown(code) {
                    if (code === 'Space' || code === 'Enter' || code === 'NumpadEnter') {
                        if (this.state === 'ready') {
                            this.audio.unlock();
                            this.audio.click();
                            this.startRound();
                            return;
                        }
                        if (this.state === 'ended') {
                            this.onReplay();
                            return;
                        }
                        if (this.state === 'playing' && code === 'Space')
                            this.henLayEgg();
                    }
                    this.keys.add(code);
                }
                henLayEgg() {
                    // No cooldown: every tap, click or key press lays an egg (held keys do not auto-repeat).
                    if (!this.hen)
                        return;
                    const p = this.hen.position;
                    // Lay just behind the hen so she doesn't stand on the egg.
                    const angle = this.hen.eulerAngles.y * Math.PI / 180;
                    const z = this.clampZ(p.z - Math.cos(angle) * 0.9, 0.5);
                    const x = this.clampX(p.x - Math.sin(angle) * 0.9, z, 0.6);
                    this.layEgg(x, z);
                    this.henPhase = 0;
                }
                setHenVisible(visible) {
                    this.henVisible = visible;
                    if (this.hen)
                        this.hen.active = visible;
                }
                updateHen(deltaTime) {
                    var _a;
                    this.keyEggCooldown = Math.max(0, this.keyEggCooldown - deltaTime);
                    if (!this.hen || !this.henVisible)
                        return;
                    let dx = 0;
                    let dz = 0;
                    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft'))
                        dx -= 1;
                    if (this.keys.has('KeyD') || this.keys.has('ArrowRight'))
                        dx += 1;
                    if (this.keys.has('KeyW') || this.keys.has('ArrowUp'))
                        dz -= 1;
                    if (this.keys.has('KeyS') || this.keys.has('ArrowDown'))
                        dz += 1;
                    const p = this.hen.position;
                    let step = HEN_SPEED * deltaTime;
                    if (dx !== 0 || dz !== 0) {
                        this.mouseTarget = null; // keys take over from where the hen stands now
                    }
                    else if (this.mouseTarget) {
                        dx = this.mouseTarget.x - p.x;
                        dz = this.mouseTarget.z - p.z;
                        const distance = Math.sqrt(dx * dx + dz * dz);
                        if (distance < 0.02) {
                            dx = 0;
                            dz = 0;
                        }
                        else
                            step = Math.min(distance, HEN_FOLLOW_SPEED * deltaTime);
                    }
                    const moving = dx !== 0 || dz !== 0;
                    if (moving) {
                        const length = Math.sqrt(dx * dx + dz * dz);
                        const z = this.clampZ(p.z + dz / length * step, 0.6);
                        const x = this.clampX(p.x + dx / length * step, z, 0.7);
                        this.hen.setPosition(x, 0, z);
                        if (length > 0.05)
                            this.hen.setRotationFromEuler(0, Math.atan2(dx, dz) * 180 / Math.PI, 0);
                        this.henPhase += deltaTime * 14;
                    }
                    (_a = this.henBody) === null || _a === void 0 ? void 0 : _a.setPosition(0, moving ? Math.abs(Math.sin(this.henPhase)) * 0.16 : 0, 0);
                }
                /** Mother hen for keyboard play, built like the reference art: round body, red crown, beak, small wing, thin legs. */
                buildHen() {
                    const hen = new cc_1.Node('Mother hen');
                    this.farmRoot.addChild(hen);
                    hen.setPosition(0, 0, 2);
                    const body = new cc_1.Node('Hen body');
                    hen.addChild(body);
                    this.henBody = body;
                    this.addSphere(body, 'Round body', 0, 1.15, 0, 0.8, '#ffe600');
                    this.addSphere(body, 'Crown left', -0.2, 1.95, 0.3, 0.17, '#e21e32');
                    this.addSphere(body, 'Crown middle', 0, 2.03, 0.25, 0.19, '#e21e32');
                    this.addSphere(body, 'Crown right', 0.2, 1.95, 0.2, 0.17, '#e21e32');
                    this.addCone(body, 'Beak', 0, 1.3, 0.92, 0.2, 0.42, '#ffb000', [90, 0, 0]);
                    this.addSphere(body, 'Left eye', -0.32, 1.48, 0.66, 0.085, '#2b2118');
                    this.addSphere(body, 'Right eye', 0.32, 1.48, 0.66, 0.085, '#2b2118');
                    this.addSphere(body, 'Left wing', -0.74, 1.12, -0.25, 0.3, '#ffd400', [0.35, 0.7, 1.0]);
                    this.addSphere(body, 'Right wing', 0.74, 1.12, -0.25, 0.3, '#ffd400', [0.35, 0.7, 1.0]);
                    this.addCylinder(hen, 'Left leg', -0.25, 0.25, 0, 0.05, 0.5, '#2b2118');
                    this.addCylinder(hen, 'Right leg', 0.25, 0.25, 0, 0.05, 0.5, '#2b2118');
                    this.addBox(hen, 'Left foot', -0.25, 0.03, 0.12, 0.28, 0.05, 0.3, '#2b2118');
                    this.addBox(hen, 'Right foot', 0.25, 0.03, 0.12, 0.28, 0.05, 0.3, '#2b2118');
                    hen.active = false;
                    this.hen = hen;
                }
                /** Round music-note icon in the top-right corner; tapping it opens or closes the music / sound-effect sliders. */
                buildVolumePanel() {
                    const panel = new cc_1.Node('Volume panel');
                    this.uiRoot.addChild(panel);
                    this.volumePanel = panel;
                    const icon = this.makeButton(panel, 'Volume icon', '', 0, 0, 56, 56, new cc_1.Color(22, 50, 70, 225), new cc_1.Color(255, 246, 210), 20, () => this.setVolumeOpen(!this.volumeOpen));
                    const note = new cc_1.Node('Music note');
                    icon.addChild(note);
                    const g = note.addComponent(cc_1.Graphics);
                    g.fillColor = new cc_1.Color(255, 214, 102);
                    g.strokeColor = new cc_1.Color(255, 214, 102);
                    g.lineWidth = 4;
                    g.ellipse(-6, -11, 7.5, 5.5);
                    g.fill();
                    g.ellipse(9, -6, 7.5, 5.5);
                    g.fill();
                    g.moveTo(0.5, -10);
                    g.lineTo(0.5, 12);
                    g.lineTo(15, 9);
                    g.lineTo(15, -5);
                    g.stroke();
                    g.rect(0.5, 8, 14.5, 4);
                    g.fill();
                    const trophy = this.makeButton(panel, 'Ladder icon', '', -68, 0, 56, 56, new cc_1.Color(22, 50, 70, 225), new cc_1.Color(255, 246, 210), 20, this.onShowLadder);
                    this.trophyIcon = trophy;
                    const cup = new cc_1.Node('Trophy');
                    trophy.addChild(cup);
                    const t = cup.addComponent(cc_1.Graphics);
                    const gold = new cc_1.Color(255, 214, 102);
                    t.strokeColor = gold;
                    t.lineWidth = 3.5;
                    t.circle(-10, 7, 5.5);
                    t.stroke();
                    t.circle(10, 7, 5.5);
                    t.stroke();
                    t.fillColor = gold;
                    t.moveTo(-10, 15);
                    t.lineTo(10, 15);
                    t.lineTo(7, 1);
                    t.quadraticCurveTo(0, -5, -7, 1);
                    t.close();
                    t.fill();
                    t.rect(-2.5, -9, 5, 8);
                    t.fill();
                    t.roundRect(-9, -15, 18, 6, 2);
                    t.fill();
                    t.fillColor = new cc_1.Color(22, 50, 70);
                    t.circle(0, 8, 2.6);
                    t.fill();
                    const body = new cc_1.Node('Volume body');
                    panel.addChild(body);
                    this.volumeBody = body;
                    body.setPosition(28 - 165, -(28 + 10 + 52), 0);
                    this.drawPanel(body, 0, 0, 330, 104, new cc_1.Color(22, 50, 70, 225), 20);
                    this.sliderFills = [];
                    this.makeSlider(body, '🎵 音樂', 22, this.audio.musicVolume, (v) => this.audio.setVolumes(v, this.audio.sfxVolume));
                    this.makeSlider(body, '🔔 音效', -24, this.audio.sfxVolume, (v) => {
                        this.audio.setVolumes(this.audio.musicVolume, v);
                    }, () => this.audio.cluck());
                    this.setVolumeOpen(false);
                }
                setVolumeOpen(open) {
                    this.volumeOpen = open;
                    if (this.volumeBody)
                        this.volumeBody.active = open;
                }
                /** Small corner button that shows or hides the engine's FPS / draw-call panel (hidden by default). */
                buildFpsButton() {
                    const button = this.makeButton(this.uiRoot, 'FPS toggle', '', 0, 0, 104, 34, new cc_1.Color(22, 50, 70, 200), new cc_1.Color(255, 246, 210), 16, () => this.setFpsVisible(!this.fpsVisible));
                    this.fpsButton = button;
                    this.fpsLabel = button.getChildByName('Button title').getComponent(cc_1.Label);
                    this.setFpsVisible(false);
                }
                setFpsVisible(visible) {
                    this.fpsVisible = visible;
                    cc_1.setDisplayStats(visible);
                    if (this.fpsLabel)
                        this.fpsLabel.string = visible ? '📊 FPS：開' : '📊 FPS：關';
                }
                makeSlider(parent, title, y, value, onChange, onRelease) {
                    const trackWidth = 180;
                    const trackX = 50;
                    this.makeLabel(parent, 'Slider title', title, 22, new cc_1.Color(255, 246, 210), -105, y, 110, 36);
                    const node = new cc_1.Node('Slider');
                    parent.addChild(node);
                    node.setPosition(trackX, y, 0);
                    node.addComponent(cc_1.UITransform).setContentSize(trackWidth + 30, 40);
                    const g = node.addComponent(cc_1.Graphics);
                    this.sliderFills.push(g);
                    const draw = (v) => {
                        g.clear();
                        g.fillColor = new cc_1.Color(255, 255, 255, 70);
                        g.roundRect(-trackWidth / 2, -5, trackWidth, 10, 5);
                        g.fill();
                        g.fillColor = new cc_1.Color(255, 205, 74);
                        g.roundRect(-trackWidth / 2, -5, Math.max(10, trackWidth * v), 10, 5);
                        g.fill();
                        g.fillColor = new cc_1.Color(255, 250, 235);
                        g.circle(-trackWidth / 2 + trackWidth * v, 0, 13);
                        g.fill();
                        g.strokeColor = new cc_1.Color(91, 57, 31);
                        g.lineWidth = 3;
                        g.circle(-trackWidth / 2 + trackWidth * v, 0, 13);
                        g.stroke();
                    };
                    draw(value);
                    const update = (event) => {
                        const location = event.getUILocation();
                        const size = cc_1.view.getVisibleSize();
                        // UI world space is centred on the screen.
                        const worldX = location.x - size.width / 2;
                        const scale = node.worldScale.x || 1;
                        const v = Math.max(0, Math.min(1, (worldX - node.worldPosition.x) / scale / trackWidth + 0.5));
                        draw(v);
                        onChange(v);
                    };
                    node.on(cc_1.Node.EventType.TOUCH_START, (event) => { this.audio.unlock(); update(event); }, this);
                    node.on(cc_1.Node.EventType.TOUCH_MOVE, update, this);
                    node.on(cc_1.Node.EventType.TOUCH_END, () => onRelease === null || onRelease === void 0 ? void 0 : onRelease(), this);
                }
                screenToFarm(x, y) {
                    if (!this.camera)
                        return null;
                    const ray = this.camera.screenPointToRay(x, y);
                    if (Math.abs(ray.d.y) < 0.0001)
                        return null;
                    const distance = -ray.o.y / ray.d.y;
                    if (distance < 0)
                        return null;
                    const worldX = ray.o.x + ray.d.x * distance;
                    const worldZ = ray.o.z + ray.d.z * distance;
                    const b = this.bounds;
                    if (this.portrait) {
                        // Phone: the whole screen is the farm, so a tap near the edge still lands on the grass.
                        const z = this.clampZ(worldZ, 0.4);
                        return new cc_1.Vec3(this.clampX(worldX, z, 0.4), 0.15, z);
                    }
                    if (worldX < b.minX + 0.5 || worldX > b.maxX - 0.5 || worldZ < b.minZ + 0.45 || worldZ > b.maxZ - 0.45)
                        return null;
                    return new cc_1.Vec3(worldX, 0.15, worldZ);
                }
                spawnEgg(x, z) {
                    const egg = new cc_1.Node(`Egg ${this.eggs.length + 1}`);
                    this.eggRoot.addChild(egg);
                    egg.setPosition(x, 0.15, z);
                    this.addSphere(egg, 'Egg shell', 0, 0.42, 0, 0.34, '#fff3c4', [0.78, 1.12, 0.78]);
                    this.addSphere(egg, 'Egg shine', -0.1, 0.56, 0.2, 0.07, '#ffffff');
                    this.eggs.push({ node: egg, x, z, age: 0 });
                    if (this.hen)
                        this.say(this.hen, '咕咕！', 2.6, 0.9);
                }
                updateEggs(deltaTime) {
                    for (let i = this.eggs.length - 1; i >= 0; i--) {
                        const egg = this.eggs[i];
                        egg.age += deltaTime;
                        egg.node.setPosition(egg.x, 0.15 + Math.sin(this.timer * 5 + i) * 0.045, egg.z);
                        if (egg.age >= EGG_SECONDS) {
                            egg.node.destroy();
                            this.eggs.splice(i, 1);
                            const chick = this.spawnChick(egg.x, egg.z);
                            this.say(chick.node, HATCH_LINES[Math.floor(Math.random() * HATCH_LINES.length)], 1.5, 1.8);
                            this.hatched += 1;
                            this.score += POINTS_PER_CHICK;
                            this.floatHeart();
                            this.audio.chirp();
                        }
                    }
                }
                spawnChick(x, z) {
                    const root = new cc_1.Node(`Happy chick ${this.chicks.length + 1}`);
                    this.chickRoot.addChild(root);
                    root.setPosition(x, 0.12, z);
                    const body = new cc_1.Node('Soft round body');
                    root.addChild(body);
                    this.addSphere(body, 'Body', 0, 0.43, 0, 0.44, '#ffe633', [1.05, 0.9, 0.9]);
                    const head = new cc_1.Node('Head');
                    body.addChild(head);
                    head.setPosition(0, 0.8, 0.18);
                    this.addSphere(head, 'Round head', 0, 0.1, 0.08, 0.31, '#ffe633');
                    this.addCone(head, 'Little orange beak', 0, 0.02, 0.42, 0.14, 0.25, '#ff9e32', [90, 0, 0]);
                    this.addSphere(head, 'Left eye', -0.12, 0.14, 0.34, 0.045, '#332d26');
                    this.addSphere(head, 'Right eye', 0.12, 0.14, 0.34, 0.045, '#332d26');
                    this.addSphere(head, 'Red comb', 0, 0.43, 0.1, 0.13, '#e64e52', [1.1, 0.75, 0.75]);
                    this.addSphere(head, 'Comb round one', -0.1, 0.38, 0.1, 0.09, '#e64e52');
                    this.addSphere(head, 'Comb round two', 0.1, 0.38, 0.1, 0.09, '#e64e52');
                    const leftWing = this.addSphere(body, 'Left flappy wing', -0.38, 0.44, 0.04, 0.19, '#f5c825', [0.5, 0.85, 0.5]);
                    const rightWing = this.addSphere(body, 'Right flappy wing', 0.38, 0.44, 0.04, 0.19, '#f5c825', [0.5, 0.85, 0.5]);
                    this.addCone(body, 'Tail feather', 0, 0.58, -0.48, 0.16, 0.34, '#ffe633', [-45, 0, 0]);
                    const leftLeg = this.addCylinder(body, 'Left tiny leg', -0.15, 0.1, 0.04, 0.045, 0.26, '#f28a2f');
                    const rightLeg = this.addCylinder(body, 'Right tiny leg', 0.15, 0.1, 0.04, 0.045, 0.26, '#f28a2f');
                    const telescope = this.addCylinder(head, 'Telescope', 0, 0, 0, 0.075, 0.38, '#856245');
                    telescope.setRotationFromEuler(90, 0, 0);
                    telescope.setPosition(0.06, 0.05, 0.38);
                    telescope.active = false;
                    const chick = {
                        node: root,
                        body,
                        head,
                        leftWing,
                        rightWing,
                        leftLeg,
                        rightLeg,
                        telescope,
                        target: new cc_1.Vec3(x, 0.12, z),
                        action: 'wander',
                        actionTime: 1 + Math.random() * 2,
                        phase: Math.random() * Math.PI * 2,
                        speed: 1.25 + Math.random() * 0.75,
                        leader: null,
                        hasBumpedFence: false,
                        chatTime: CHICK_TALK_GAP + Math.random() * 8,
                    };
                    this.chicks.push(chick);
                    if (this.chicks.length >= 3 && Math.random() < 0.38) {
                        chick.action = 'follow';
                        chick.leader = this.chicks[Math.floor(Math.random() * (this.chicks.length - 1))];
                        chick.actionTime = 4 + Math.random() * 3;
                    }
                    return chick;
                }
                updateChicks(deltaTime) {
                    for (const chick of this.chicks) {
                        chick.phase += deltaTime * 8;
                        chick.actionTime -= deltaTime;
                        chick.chatTime -= deltaTime;
                        if (chick.chatTime <= 0) {
                            chick.chatTime = CHICK_TALK_GAP + Math.random() * 8;
                            this.say(chick.node, CHICK_CHATTER[Math.floor(Math.random() * CHICK_CHATTER.length)], 1.5, 1.8, true);
                        }
                        if (chick.actionTime <= 0)
                            this.chooseAction(chick);
                        if (chick.action === 'wander' || chick.action === 'follow' || chick.action === 'bump') {
                            this.moveChick(chick, deltaTime);
                        }
                        this.animateAction(chick, deltaTime);
                    }
                }
                chooseAction(chick) {
                    var _a;
                    chick.hasBumpedFence = false;
                    chick.leader = null;
                    chick.telescope.active = false;
                    chick.body.setRotationFromEuler(0, chick.body.eulerAngles.y, 0);
                    const roll = Math.random();
                    if (roll < 0.36) {
                        chick.action = 'wander';
                        this.setRandomTarget(chick);
                        chick.actionTime = 2 + Math.random() * 3;
                    }
                    else if (roll < 0.5) {
                        chick.action = 'bump';
                        const side = Math.floor(Math.random() * 4);
                        chick.target.set(side === 0 ? this.halfXAt(chick.node.position.z) - 0.7 : side === 1 ? -this.halfXAt(chick.node.position.z) + 0.7 : chick.node.position.x, 0.12, side === 2 ? this.bounds.maxZ - 0.6 : side === 3 ? this.bounds.minZ + 0.6 : chick.node.position.z);
                        chick.actionTime = 4;
                    }
                    else if (roll < 0.67 && this.chicks.length > 1) {
                        chick.action = 'follow';
                        const others = this.chicks.filter((other) => other !== chick);
                        chick.leader = (_a = others[Math.floor(Math.random() * others.length)]) !== null && _a !== void 0 ? _a : null;
                        chick.actionTime = 3 + Math.random() * 3;
                    }
                    else if (roll < 0.79) {
                        chick.action = 'telescope';
                        chick.telescope.active = true;
                        chick.head.setRotationFromEuler(-28, 0, 0);
                        chick.actionTime = 2.2 + Math.random() * 1.5;
                        this.say(chick.node, '我看到星星了！', 1.5);
                    }
                    else if (roll < 0.9) {
                        chick.action = 'dance';
                        chick.actionTime = 1.8 + Math.random() * 1.5;
                        this.say(chick.node, '跳舞時間～♪', 1.5);
                    }
                    else if (roll < 0.95) {
                        chick.action = 'roll';
                        chick.actionTime = 1.2;
                        this.say(chick.node, '滾滾滾～', 1.5);
                    }
                    else if (roll < 0.98) {
                        chick.action = 'pose';
                        chick.actionTime = 2;
                        this.say(chick.node, '看我帥不帥！', 1.5);
                    }
                    else {
                        chick.action = 'sleep';
                        chick.actionTime = 2.6;
                        this.say(chick.node, 'Zzz…', 1.5);
                    }
                }
                setRandomTarget(chick) {
                    const targetZ = this.bounds.minZ + 0.8 + Math.random() * (this.bounds.maxZ - this.bounds.minZ - 1.6);
                    const targetHalf = this.halfXAt(targetZ) - 1;
                    chick.target.set(-targetHalf + Math.random() * targetHalf * 2, 0.12, targetZ);
                }
                moveChick(chick, deltaTime) {
                    const position = chick.node.position;
                    if (chick.action === 'follow' && chick.leader && chick.leader.node.isValid) {
                        const leaderPosition = chick.leader.node.position;
                        const dx = position.x - leaderPosition.x;
                        const dz = position.z - leaderPosition.z;
                        const distance = Math.sqrt(dx * dx + dz * dz);
                        if (distance > 0.75) {
                            chick.target.set(leaderPosition.x + (dx / Math.max(distance, 0.01)) * 0.6, 0.12, leaderPosition.z + (dz / Math.max(distance, 0.01)) * 0.6);
                        }
                        else {
                            chick.target.set(position.x, 0.12, position.z);
                        }
                    }
                    const dx = chick.target.x - position.x;
                    const dz = chick.target.z - position.z;
                    const distance = Math.sqrt(dx * dx + dz * dz);
                    if (distance < 0.16) {
                        if (chick.action === 'bump' && !chick.hasBumpedFence) {
                            chick.hasBumpedFence = true;
                            chick.action = 'pose';
                            chick.actionTime = 0.65;
                            this.say(chick.node, '哎唷！撞到了…', 1.5);
                        }
                        else if (chick.action === 'wander') {
                            this.setRandomTarget(chick);
                        }
                    }
                    else {
                        const step = Math.min(distance, chick.speed * deltaTime * (chick.action === 'bump' ? 1.4 : 1));
                        const nextZ = this.clampZ(position.z + dz / distance * step, 0.55);
                        const nextX = this.clampX(position.x + dx / distance * step, nextZ, 0.65);
                        chick.node.setPosition(nextX, position.y, nextZ);
                        chick.node.setRotationFromEuler(0, Math.atan2(dx, dz) * 180 / Math.PI, 0);
                    }
                }
                animateAction(chick, deltaTime) {
                    const bounce = Math.abs(Math.sin(chick.phase)) * 0.09;
                    chick.leftWing.setRotationFromEuler(Math.sin(chick.phase) * 28, 0, -10);
                    chick.rightWing.setRotationFromEuler(-Math.sin(chick.phase) * 28, 0, 10);
                    chick.leftLeg.setRotationFromEuler(Math.sin(chick.phase) * 22, 0, 0);
                    chick.rightLeg.setRotationFromEuler(-Math.sin(chick.phase) * 22, 0, 0);
                    chick.body.setPosition(0, 0.0, 0);
                    chick.body.setRotationFromEuler(0, chick.body.eulerAngles.y, 0);
                    switch (chick.action) {
                        case 'wander':
                        case 'follow':
                        case 'bump':
                            chick.body.setPosition(0, bounce, 0);
                            break;
                        case 'telescope':
                            chick.head.setRotationFromEuler(-28 + Math.sin(chick.phase * 0.25) * 3, 0, 0);
                            break;
                        case 'dance':
                            chick.node.setRotationFromEuler(0, chick.node.eulerAngles.y + deltaTime * 300, 0);
                            chick.body.setPosition(0, bounce * 2, 0);
                            break;
                        case 'roll':
                            chick.body.setRotationFromEuler(0, chick.body.eulerAngles.y, Math.sin(chick.phase * 2) * 55);
                            chick.body.setPosition(0, bounce, 0);
                            break;
                        case 'pose':
                            chick.rightLeg.setRotationFromEuler(0, 0, -55);
                            chick.body.setRotationFromEuler(0, chick.body.eulerAngles.y, 9);
                            break;
                        case 'sleep':
                            chick.body.setPosition(0, -0.12, 0);
                            chick.body.setRotationFromEuler(0, chick.body.eulerAngles.y, -16);
                            chick.leftWing.setRotationFromEuler(0, 0, -32);
                            chick.rightWing.setRotationFromEuler(0, 0, 32);
                            break;
                    }
                }
                buildHenCursorSvg() {
                    // Same proportions as the reference hen: big round body, red crown, beak, small back wing, thin legs.
                    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 64 64">'
                        + '<g stroke="#2b2118" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">'
                        + '<path d="M29 46 27 57M22 60l5-3 4 3M38 46l1 11M34 60l5-3 4 3" fill="none"/>'
                        + '<path d="M22 18 20 3l6 5 6-8 6 8 6-5-2 15z" fill="#e21e32" stroke-width="2.2"/>'
                        + '<path d="M47 30l11 3-3 3 4 3-7 3-6-2z" fill="#ffe600"/>'
                        + '<circle cx="32" cy="31" r="17" fill="#ffe600"/>'
                        + '<path d="M17 26 4 30l13 6z" fill="#ffd600"/>'
                        + '<circle cx="25" cy="25" r="2.4" fill="#2b2118" stroke="none"/>'
                        + '</g></svg>';
                    // Hotspot sits between the feet, where the egg is laid.
                    return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 48 88, auto`;
                }
                buildHandCursorSvg() {
                    // Cartoon pointing hand (index finger to the top-left, grey cuff, thick outline) for menus and controls.
                    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 64 64"><g stroke="#111" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M39 48 50 39 58 49 47 58z" fill="#8c8c8c"/><path d="M44 52 52 45.5" stroke="#b8b8b8" stroke-width="2.5" fill="none"/><path d="M7 9C5 5 10 2 13 5L29 21C31 18 35 18 36 21C38 19 42 20 42 24C45 23 48 26 47 30L50 39 39 48C34 47 29 45 26 42L15 37C10 36 8 32 11 30C13 29 17 30 21 31L24 30 9 14C7 12 6 11 7 9Z" fill="#f2c79a"/><path d="M10 7.5C9 9 10 11 12 12" stroke="#fff3e0" stroke-width="2" fill="none"/><path d="M29 21 33 26M36 21 38 26M24 30 28 33" stroke="#c98f5e" stroke-width="2" fill="none"/></g></svg>';
                    return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 5 4, pointer`;
                }
                /** Hen over the farm while playing; pointing hand everywhere else (HUD, volume panel, menus). */
                updateCursor(uiX, uiY, insideFarm = false) {
                    if (typeof document === 'undefined')
                        return;
                    // Over the pen the hen herself is the pointer, so the system cursor hides.
                    const overFarm = insideFarm && this.state === 'playing' && !this.isOverUi(uiX, uiY);
                    const cursor = overFarm ? this.customCursor : this.handCursor;
                    if (cursor !== this.currentCursor) {
                        this.currentCursor = cursor;
                        document.body.style.cursor = cursor;
                        const canvas = document.getElementById('GameCanvas');
                        if (canvas)
                            canvas.style.cursor = cursor;
                    }
                }
                /** True when a UI-space point (origin bottom-left) is on the HUD strip or the volume panel. */
                isOverUi(uiX, uiY) {
                    var _a;
                    const size = cc_1.view.getVisibleSize();
                    if (uiY > size.height - 140 - this.hudDrop)
                        return true;
                    const fps = this.fpsButton;
                    const fpsScale = fps ? fps.scale.x : 1;
                    if (fps && Math.abs(uiX - (fps.position.x + size.width / 2)) < 56 * fpsScale && Math.abs(uiY - (fps.position.y + size.height / 2)) < 22 * fpsScale)
                        return true;
                    const panel = this.volumePanel;
                    if (panel && panel.activeInHierarchy) {
                        const x = panel.position.x + size.width / 2;
                        const y = panel.position.y + size.height / 2;
                        const vs = this.volumeScale;
                        if (Math.abs(uiX - x) < 34 * vs && Math.abs(uiY - y) < 34 * vs)
                            return true;
                        if (((_a = this.trophyIcon) === null || _a === void 0 ? void 0 : _a.active) && Math.abs(uiX - (x - 68 * vs)) < 34 * vs && Math.abs(uiY - y) < 34 * vs)
                            return true;
                        if (this.volumeOpen && Math.abs(uiX - (x - 137 * vs)) < 175 * vs && Math.abs(uiY - (y + this.volumeBodyY * vs)) < 62 * vs)
                            return true;
                    }
                    return false;
                }
                installHenCursor() {
                    if (typeof document === 'undefined')
                        return;
                    this.customCursor = 'none';
                    this.handCursor = this.buildHandCursorSvg();
                    this.updateCursor(0, 0);
                }
                /** Live-stream style "+100": the hatch message itself floats up from the bottom-right corner, sways, and slowly fades away. */
                floatHeart() {
                    this.pendingFloats++;
                }
                /** Hatches that land together share one floating line ("+300") instead of piling up unreadably. */
                spawnFloat(count) {
                    if (!this.heartRoot)
                        return;
                    if (this.hearts.length >= MAX_HEARTS)
                        this.removeHeart(this.hearts[0]);
                    const size = cc_1.view.getVisibleSize();
                    const fontSize = Math.min(40, 28 + Math.random() * 4 + count * 1.5);
                    const node = new cc_1.Node('Hatch score');
                    node.layer = cc_1.Layers.Enum.UI_2D;
                    this.heartRoot.addChild(node);
                    node.addComponent(cc_1.UITransform).setContentSize(320, fontSize * 1.5);
                    const opacity = node.addComponent(cc_1.UIOpacity);
                    const label = node.addComponent(cc_1.Label);
                    label.useSystemFont = true;
                    label.fontFamily = 'Arial';
                    label.fontSize = fontSize;
                    label.lineHeight = Math.round(fontSize * 1.3);
                    label.isBold = true;
                    label.color = new cc_1.Color(SCORE_FLOAT_COLORS[Math.floor(Math.random() * SCORE_FLOAT_COLORS.length)]);
                    label.string = `孵化成功 +${POINTS_PER_CHICK * count}`;
                    const outline = node.addComponent(cc_1.LabelOutline);
                    outline.color = new cc_1.Color(40, 90, 60, 255);
                    outline.width = 3;
                    // Right-aligned lane near the edge; each one drifts a little differently like a live-stream reaction.
                    const startX = size.width / 2 - 170 - Math.random() * 30;
                    const startY = -size.height / 2 + 90;
                    node.setPosition(startX, startY, 0);
                    node.setScale(0, 0, 1);
                    this.hearts.push({
                        node, opacity, age: 0, life: 3.4 + Math.random() * 1.2, startX, startY,
                        rise: Math.min(size.height * 0.7, 520), swayAmp: 14 + Math.random() * 22,
                        swaySpeed: 2 + Math.random() * 1.5, swayPhase: Math.random() * Math.PI * 2, size: fontSize,
                    });
                }
                updateHearts(deltaTime) {
                    this.floatCooldown -= deltaTime;
                    if (this.pendingFloats > 0 && this.floatCooldown <= 0) {
                        this.spawnFloat(this.pendingFloats);
                        this.pendingFloats = 0;
                        this.floatCooldown = 0.45;
                    }
                    for (const heart of this.hearts.slice()) {
                        heart.age += deltaTime;
                        const t = heart.age / heart.life;
                        if (t >= 1) {
                            this.removeHeart(heart);
                            continue;
                        }
                        const rise = 1 - Math.pow(1 - t, 1.6);
                        const x = heart.startX + Math.sin(heart.age * heart.swaySpeed + heart.swayPhase) * heart.swayAmp * Math.min(1, t * 3) - rise * 20;
                        heart.node.setPosition(x, heart.startY + rise * heart.rise, 0);
                        const pop = Math.min(1, heart.age / 0.25);
                        const scale = (1.25 - 0.25 * pop) * pop;
                        heart.node.setScale(scale, scale, 1);
                        heart.opacity.opacity = t < 0.5 ? 255 : Math.max(0, 255 * (1 - (t - 0.5) / 0.5));
                    }
                }
                removeHeart(heart) {
                    heart.node.destroy();
                    this.hearts.splice(this.hearts.indexOf(heart), 1);
                }
                clearHearts() {
                    this.pendingFloats = 0;
                    this.hearts.slice().forEach((heart) => this.removeHeart(heart));
                }
                /** Pop a speech cloud over a chick (or the hen) that follows it around the farm. */
                say(owner, text, height, duration = 1.8, optional = false) {
                    if (!this.bubbleRoot || !owner.isValid)
                        return;
                    if (owner !== this.hen) {
                        const last = this.lastSpoke.get(owner);
                        if (last !== undefined && this.timer - last < CHICK_TALK_GAP)
                            return;
                        this.lastSpoke.set(owner, this.timer);
                    }
                    let bubble = this.bubbles.find((b) => b.owner === owner);
                    if (!bubble) {
                        if (this.bubbles.length >= MAX_BUBBLES) {
                            if (optional)
                                return; // idle chatter never pushes out a reaction
                            this.removeBubble(this.bubbles[0]);
                        }
                        const node = new cc_1.Node('Speech bubble');
                        this.bubbleRoot.addChild(node);
                        node.addComponent(cc_1.UITransform).setContentSize(10, 10);
                        const graphics = node.addComponent(cc_1.Graphics);
                        const label = this.makeLabel(node, 'Speech', '', 21, new cc_1.Color(70, 48, 30), 0, 6, 400, 34);
                        const setLayer = (n) => { n.layer = cc_1.Layers.Enum.UI_2D; n.children.forEach(setLayer); };
                        setLayer(node);
                        bubble = { node, label, graphics, width: 0, owner, height, time: 0 };
                        this.bubbles.push(bubble);
                    }
                    bubble.height = height;
                    bubble.time = duration;
                    bubble.label.string = text;
                    const width = Math.max(56, this.textWidth(text, 21) + 30);
                    bubble.width = width;
                    const g = bubble.graphics;
                    g.clear();
                    g.fillColor = new cc_1.Color(0, 0, 0, 40);
                    g.roundRect(-width / 2 + 2, -11, width, 38, 17);
                    g.fill();
                    g.fillColor = new cc_1.Color(255, 255, 255, 245);
                    g.strokeColor = new cc_1.Color(70, 48, 30, 255);
                    g.lineWidth = 2.5;
                    g.roundRect(-width / 2, -13 + 2, width, 36, 17);
                    g.fill();
                    g.stroke();
                    // Little tail pointing down at the speaker.
                    g.moveTo(-8, -10);
                    g.lineTo(0, -24);
                    g.lineTo(9, -10);
                    g.fill();
                    g.moveTo(-8, -11);
                    g.lineTo(0, -24);
                    g.lineTo(9, -11);
                    g.stroke();
                    this.placeBubble(bubble);
                }
                textWidth(text, size) {
                    let width = 0;
                    for (const ch of text)
                        width += ch.charCodeAt(0) > 0x2e80 ? size : size * 0.55;
                    return width;
                }
                placeBubble(bubble) {
                    if (!this.camera || !this.uiRoot)
                        return;
                    const world = bubble.owner.worldPosition;
                    this.bubblePoint.set(world.x, world.y + bubble.height, world.z);
                    const out = new cc_1.Vec3();
                    this.camera.convertToUINode(this.bubblePoint, this.uiRoot, out);
                    // convertToUINode answers in screen-style UI space (origin bottom-left); our canvas root is centred.
                    const size = cc_1.view.getVisibleSize();
                    bubble.node.setPosition(out.x - size.width / 2, out.y - size.height / 2 + 22, 0);
                }
                updateBubbles(deltaTime) {
                    for (const bubble of this.bubbles.slice()) {
                        bubble.time -= deltaTime;
                        if (bubble.time <= 0 || !bubble.owner.isValid || !bubble.owner.activeInHierarchy) {
                            this.removeBubble(bubble);
                            continue;
                        }
                        this.placeBubble(bubble);
                        // Pop in, then fade out over the last moment.
                        const scale = Math.min(1, 0.6 + (1.8 - Math.min(1.8, bubble.time)) * 3);
                        bubble.node.setScale(scale * this.bubbleBoost, scale * this.bubbleBoost, 1);
                    }
                    // Stack bubbles that would cover each other, so every chick's line stays readable.
                    const placed = this.bubbles.slice().sort((a, b) => a.node.position.y - b.node.position.y);
                    for (let i = 0; i < placed.length; i++) {
                        const a = placed[i].node.position;
                        let y = a.y;
                        for (let j = 0; j < i; j++) {
                            const b = placed[j].node.position;
                            const boost = this.bubbleBoost;
                            if (Math.abs(a.x - b.x) < (placed[i].width + placed[j].width) / 2 * boost && Math.abs(y - b.y) < 40 * boost)
                                y = b.y + 40 * boost;
                        }
                        if (y !== a.y)
                            placed[i].node.setPosition(a.x, y, 0);
                    }
                }
                removeBubble(bubble) {
                    bubble.node.destroy();
                    this.bubbles.splice(this.bubbles.indexOf(bubble), 1);
                }
                clearBubbles() {
                    this.bubbles.slice().forEach((bubble) => this.removeBubble(bubble));
                    this.lastSpoke.clear();
                }
                showToast(message) {
                    if (!this.toastLabel)
                        return;
                    this.toastLabel.string = message;
                    this.toastLabel.node.active = true;
                    this.unschedule(this.hideToast);
                    this.scheduleOnce(this.hideToast, 1.6);
                }
                refreshHud() {
                    if (this.hudLabel) {
                        this.hudLabel.string = `⏱ ${Math.ceil(this.secondsLeft)} 秒　　🐣 ${this.hatched} 隻　　⭐ ${this.score} 分`;
                    }
                }
                addSphere(parent, name, x, y, z, radius, tint, scale = [1, 1, 1]) {
                    const node = this.addMesh(parent, name, `sphere:${radius}`, cc_1.primitives.sphere(radius, { segments: 14 }), tint);
                    node.setPosition(x, y, z);
                    node.setScale(scale[0], scale[1], scale[2]);
                    return node;
                }
                addBox(parent, name, x, y, z, width, height, length, tint) {
                    const key = `box:${width}:${height}:${length}`;
                    const node = this.addMesh(parent, name, key, cc_1.primitives.box({ width, height, length }), tint);
                    node.setPosition(x, y, z);
                    return node;
                }
                addCylinder(parent, name, x, y, z, radius, height, tint) {
                    const node = this.addMesh(parent, name, `cylinder:${radius}:${height}`, cc_1.primitives.cylinder(radius, radius, height, { radialSegments: 10 }), tint);
                    node.setPosition(x, y, z);
                    return node;
                }
                addCone(parent, name, x, y, z, radius, height, tint, rotation) {
                    const node = this.addMesh(parent, name, `cone:${radius}:${height}`, cc_1.primitives.cone(radius, height, { radialSegments: 8 }), tint);
                    node.setPosition(x, y, z);
                    node.setRotationFromEuler(rotation[0], rotation[1], rotation[2]);
                    return node;
                }
                addMesh(parent, name, meshKey, geometry, tint) {
                    let mesh = this.meshes.get(meshKey);
                    if (!mesh) {
                        mesh = cc_1.utils.createMesh(geometry);
                        this.meshes.set(meshKey, mesh);
                    }
                    let material = this.materials.get(tint);
                    if (!material) {
                        material = new cc_1.Material();
                        // builtin-standard is only packed when an asset references it; fall back to unlit so the build never crashes.
                        const effectName = cc_1.EffectAsset.get('builtin-standard') ? 'builtin-standard' : 'builtin-unlit';
                        material.initialize({ effectName });
                        material.setProperty('mainColor', new cc_1.Color(tint));
                        this.materials.set(tint, material);
                    }
                    const node = new cc_1.Node(name);
                    parent.addChild(node);
                    const renderer = node.addComponent(cc_1.MeshRenderer);
                    renderer.mesh = mesh;
                    renderer.setSharedMaterial(material, 0);
                    return node;
                }
            };
            exports_1("FarmGame", FarmGame);
            exports_1("FarmGame", FarmGame = FarmGame_1 = __decorate([
                ccclass('FarmGame')
            ], FarmGame));
        }
    };
});


System.register("chunks:///_virtual/GameBootstrap.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports, module) {
  var _inheritsLoose, cclegacy, _decorator, Component;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "25ee7sE0NVEcrEbWZEKjfQP", "GameBootstrap", undefined);
      var ccclass = _decorator.ccclass;

      /** Loads the runtime game module before mounting its component into the scene. */
      var GameBootstrap = exports('GameBootstrap', (_dec = ccclass('HappyChickGameBootstrap'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(GameBootstrap, _Component);
        function GameBootstrap() {
          return _Component.apply(this, arguments) || this;
        }
        var _proto = GameBootstrap.prototype;
        _proto.onLoad = function onLoad() {
          Promise.all([module.import('cc'), module.import('./FarmGame.ts')]).then(function (_ref) {
            var _scene$getChildByName;
            var cc = _ref[0],
              gameModule = _ref[1];
            var Camera = cc.Camera,
              director = cc.director,
              Node = cc.Node;
            var Game = gameModule.FarmGame;
            var scene = director.getScene();
            var host = (_scene$getChildByName = scene == null ? void 0 : scene.getChildByName('Farm Game')) != null ? _scene$getChildByName : null;
            if (!host && scene) {
              host = new Node('Farm Game');
              scene.addChild(host);
            }
            if (!host) return;
            if (!host.getChildByName('Main Camera')) {
              var cameraNode = new Node('Main Camera');
              host.addChild(cameraNode);
              cameraNode.addComponent(Camera);
            }
            Game.mount(host);
          })["catch"](function (error) {
            console.error('[Happy Chick] Failed to load game:', error);
          });
        };
        return GameBootstrap;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./FarmGame.ts', './GameBootstrap.ts'], function () {
  return {
    setters: [null, null],
    execute: function () {}
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});