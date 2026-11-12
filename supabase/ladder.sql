-- 快樂小雞農場：每週天梯（Supabase SQL Editor 貼上整段執行一次即可）
-- 一週從台北時間週一 06:00 開始；每位玩家每週只保留最高分；每週最多保留 1000 筆。

create table if not exists public.ladder_scores (
    week       integer     not null,
    player_id  text        not null,
    name       text        not null,
    score      integer     not null,
    hatched    integer     not null,
    updated_at timestamptz not null default now(),
    primary key (week, player_id)
);
create index if not exists ladder_scores_rank on public.ladder_scores (week, score desc, updated_at);

-- 網頁只能透過下面兩個函式讀寫，不能直接改資料表。
alter table public.ladder_scores enable row level security;
revoke all on public.ladder_scores from anon, authenticated;

-- 與遊戲端相同的週次：週一 06:00 (UTC+8) = 週日 22:00 UTC。
create or replace function public.ladder_week(at timestamptz default now())
returns integer language sql immutable as $$
    select ((floor((extract(epoch from at) + 7200) / 86400)::bigint + 3) / 7)::integer;
$$;

create or replace function public.submit_score(p_player text, p_name text, p_score integer, p_hatched integer)
returns void language plpgsql security definer set search_path = public as $$
declare
    w integer := public.ladder_week(now());
    last_at timestamptz;
begin
    -- 基本防呆：ID 與名字長度、分數必須等於孵化數 × 100、合理上限。
    if p_player is null or length(p_player) < 8 or length(p_player) > 64 then return; end if;
    p_name := left(coalesce(nullif(btrim(p_name), ''), '小雞玩家'), 16);
    if p_score is null or p_hatched is null or p_score <= 0 or p_score <> p_hatched * 100 or p_hatched > 3000 then return; end if;

    select updated_at into last_at from ladder_scores where week = w and player_id = p_player;
    -- 一局 30 秒，20 秒內重複送出視為異常。
    if last_at is not null and last_at > now() - interval '20 seconds' then return; end if;

    insert into ladder_scores as s (week, player_id, name, score, hatched, updated_at)
    values (w, p_player, p_name, p_score, p_hatched, now())
    on conflict (week, player_id) do update
        set name = excluded.name,
            updated_at = now(),
            score = greatest(s.score, excluded.score),
            hatched = case when excluded.score > s.score then excluded.hatched else s.hatched end;

    -- 只留前 1000 名。
    delete from ladder_scores d
    using (
        select player_id from ladder_scores where week = w
        order by score desc, updated_at offset 1000
    ) extra
    where d.week = w and d.player_id = extra.player_id;
end;
$$;

-- 本週前 p_limit 名；若自己在名單外，最後多附一列自己的名次。不回傳別人的玩家 ID。
create or replace function public.get_ladder(p_player text default null, p_limit integer default 100)
returns table (rank integer, name text, score integer, hatched integer, is_me boolean)
language sql stable security definer set search_path = public as $$
    with ranked as (
        select (row_number() over (order by score desc, updated_at))::integer as rank,
               name, score, hatched, coalesce(player_id = p_player, false) as is_me
        from ladder_scores
        where week = public.ladder_week(now())
    )
    select rank, name, score, hatched, is_me from ranked
    where rank <= least(greatest(coalesce(p_limit, 100), 1), 1000) or is_me
    order by rank;
$$;

-- 改名：不動分數，只更新本週名字。
create or replace function public.rename_player(p_player text, p_name text)
returns void language sql security definer set search_path = public as $$
    update ladder_scores
    set name = left(coalesce(nullif(btrim(p_name), ''), name), 16)
    where week = public.ladder_week(now()) and player_id = p_player;
$$;

revoke all on function public.submit_score(text, text, integer, integer) from public;
revoke all on function public.get_ladder(text, integer) from public;
revoke all on function public.rename_player(text, text) from public;
grant execute on function public.submit_score(text, text, integer, integer) to anon, authenticated;
grant execute on function public.get_ladder(text, integer) to anon, authenticated;
grant execute on function public.rename_player(text, text) to anon, authenticated;
