DROP TABLE IF EXISTS speedrun_records_old CASCADE;
DROP TABLE IF EXISTS speedrun_records CASCADE;
DROP TABLE IF EXISTS game_platforms CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS runners CASCADE;

CREATE TABLE speedrun_records (
    game            text,
    category        text,
    platforms       text,
    publisher       text,
    release_year    integer,
    runner          text,
    runner_country  text,
    run_time        interval
);

INSERT INTO speedrun_records
    (game, category, platforms, publisher, release_year, runner, runner_country, run_time)
VALUES
    ('Celeste', 'Any%', 'PC, Switch', 'Maddy Makes', 2018, 'Alice', 'Canada', INTERVAL '00:28:14'),
    ('Celeste', '100%', 'PC, Switch', 'Maddy Makes', 2018, 'Bob',   'USA',    INTERVAL '01:24:55'),
    ('Hades',   'Any%', 'PC, PS5',    'Supergiant',  2020, 'Alice', 'Canada', INTERVAL '00:12:03'),
    ('Hades',   '100%', 'PC, PS5',    'Supergiant',  2020, 'Carol', 'Brazil', INTERVAL '00:41:20');

select * from speedrun_records;

--  1) АНОМАЛИЯ ОБНОВЛЕНИЯ (update anomaly)
SELECT game, category, publisher FROM speedrun_records WHERE game = 'Celeste';


BEGIN;
    -- студия сделала ребрендинг; по невнимательности обновили только Any%
    UPDATE speedrun_records
       SET publisher = 'Extremely OK Games'
     WHERE game = 'Celeste' AND category = 'Any%';
 
    -- результат: противоречие — у Celeste теперь ДВА издателя
    SELECT game, category, publisher FROM speedrun_records WHERE game = 'Celeste';
ROLLBACK;

-- 2) АНОМАЛИЯ ВСТАВКИ (insertion anomaly)
BEGIN;
    INSERT INTO speedrun_records (game, category, publisher)
    VALUES ('Hollow Knight', NULL, 'Team Cherry');
    SELECT * FROM speedrun_records WHERE game = 'Hollow Knight';
ROLLBACK;

-- 3) АНОМАЛИЯ УДАЛЕНИЯ (deletion anomaly)
SELECT DISTINCT runner, runner_country FROM speedrun_records WHERE runner = 'Carol';

BEGIN;
    DELETE FROM speedrun_records WHERE game = 'Hades' AND category = '100%';
 
    -- результат: про Carol в базе не осталось ничего
    SELECT DISTINCT runner, runner_country FROM speedrun_records WHERE runner = 'Carol';
ROLLBACK;

---------------------
-- 1 НОРМАЛЬНАЯ ФОРМА
---------------------

select game, platforms from speedrun_records;

BEGIN;

-- вместо списка в ячейке — пронумерованные колонки
ALTER TABLE speedrun_records ADD COLUMN platform_1 text;
ALTER TABLE speedrun_records ADD COLUMN platform_2 text;
ALTER TABLE speedrun_records ADD COLUMN platform_3 text;   -- а вдруг будет 4-я? добавлять platform_4?

-- разложили старый список по колонкам
UPDATE speedrun_records
   SET platform_1 = trim(split_part(platforms, ',', 1)),
       platform_2 = NULLIF(trim(split_part(platforms, ',', 2)), ''),
       platform_3 = NULLIF(trim(split_part(platforms, ',', 3)), '');

-- смотрим, что получилось
SELECT game, category, platform_1, platform_2, platform_3 FROM speedrun_records;

ROLLBACK;


BEGIN;
-- Новая таблица «игра ↔ платформа»: одна платформа = одна строка
CREATE TABLE game_platforms (
    game     text NOT NULL,
    platform text NOT NULL,
    PRIMARY KEY (game, platform)
);

INSERT INTO game_platforms (game, platform)
SELECT DISTINCT game, trim(p)
FROM speedrun_records, unnest(string_to_array(platforms, ',')) AS p;

ALTER TABLE speedrun_records DROP COLUMN platforms;

COMMIT;

select * from game_platforms;

-- у таблицы обязан быть первичный ключ (PK)
ALTER TABLE speedrun_records ADD PRIMARY KEY (game, category);

select * from speedrun_records;


---------------------
-- 2 НОРМАЛЬНАЯ ФОРМА
---------------------
BEGIN;

-- Таблица игр: каждая игра — ровно одна строка
CREATE TABLE games (
    game         text PRIMARY KEY,
    publisher    text,
    release_year integer
);

INSERT INTO games (game, publisher, release_year)
SELECT DISTINCT game, publisher, release_year
FROM speedrun_records;

-- Связываем рекорды с играми по внешнему ключу
ALTER TABLE speedrun_records
    ADD FOREIGN KEY (game) REFERENCES games (game);

ALTER TABLE speedrun_records DROP COLUMN publisher;
ALTER TABLE speedrun_records DROP COLUMN release_year;

ALTER TABLE game_platforms
    ADD FOREIGN KEY (game) REFERENCES games (game);

COMMIT;

select * from speedrun_records;


---------------------
-- 3 НОРМАЛЬНАЯ ФОРМА
---------------------
BEGIN;

-- Таблица раннеров: каждый раннер — ровно одна строка
CREATE TABLE runners (
    runner         text PRIMARY KEY,
    runner_country text
);

-- Переносим уникальные факты о раннерах (DISTINCT схлопывает повторы Alice)
INSERT INTO runners (runner, runner_country)
SELECT DISTINCT runner, runner_country
FROM speedrun_records;

-- Связываем рекорды с раннерами по внешнему ключу
ALTER TABLE speedrun_records
    ADD FOREIGN KEY (runner) REFERENCES runners (runner);

-- Убираем транзитивно зависимую колонку из таблицы рекордов
ALTER TABLE speedrun_records DROP COLUMN runner_country;

COMMIT;


select * from runners;

CREATE TABLE speedrun_records_old (
    game            text,
    category        text,
    platforms       text,
    publisher       text,
    release_year    integer,
    runner          text,
    runner_country  text,
    run_time        interval
);

INSERT INTO speedrun_records_old
    (game, category, platforms, publisher, release_year, runner, runner_country, run_time)
VALUES
    ('Celeste', 'Any%', 'PC, Switch', 'Maddy Makes', 2018, 'Alice', 'Canada', INTERVAL '00:28:14'),
    ('Celeste', '100%', 'PC, Switch', 'Maddy Makes', 2018, 'Bob',   'USA',    INTERVAL '01:24:55'),
    ('Hades',   'Any%', 'PC, PS5',    'Supergiant',  2020, 'Alice', 'Canada', INTERVAL '00:12:03'),
    ('Hades',   '100%', 'PC, PS5',    'Supergiant',  2020, 'Carol', 'Brazil', INTERVAL '00:41:20');

select * from speedrun_records_old;
select * from runners;

