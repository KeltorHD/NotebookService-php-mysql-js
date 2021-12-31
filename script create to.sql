-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Дек 27 2021 г., 08:40
-- Версия сервера: 10.4.22-MariaDB
-- Версия PHP: 8.1.0

--
-- База данных: `db`
--
CREATE DATABASE IF NOT EXISTS `db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `db`;

-- --------------------------------------------------------

--
-- Структура таблицы `contact_note`
--

CREATE TABLE `contact_note` (
  `id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `photo_id` int(11) DEFAULT NULL,
  `surname` varchar(256) NOT NULL,
  `name` varchar(256) NOT NULL,
  `patronymic` varchar(256) NOT NULL,
  `phone` varchar(256) NOT NULL,
  `cityphone` varchar(256) NOT NULL,
  `remarks` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `note_tag`
--

CREATE TABLE `note_tag` (
  `id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `note_title`
--

CREATE TABLE `note_title` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(256) NOT NULL,
  `note_type` int(11) NOT NULL,
  `last_saved` datetime NOT NULL,
  `is_deleted` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `photo`
--

CREATE TABLE `photo` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ext` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `purpose_note`
--

CREATE TABLE `purpose_note` (
  `id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `plan` text NOT NULL,
  `quote` text NOT NULL,
  `remarks` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `recipe_note`
--

CREATE TABLE `recipe_note` (
  `id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `photo_id` int(11) DEFAULT NULL,
  `description` text NOT NULL,
  `ingredients` text NOT NULL,
  `remarks` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `simple_note`
--

CREATE TABLE `simple_note` (
  `id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `body` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `tag`
--

CREATE TABLE `tag` (
  `id` int(11) NOT NULL,
  `body` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `type_note`
--

CREATE TABLE `type_note` (
  `id` int(11) NOT NULL,
  `type_title` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `login` varchar(30) NOT NULL,
  `password` varchar(32) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `ip` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `email` varchar(150) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `extension` varchar(10) NOT NULL,
  `restore_date` datetime NOT NULL,
  `restore_hash` char(10) DEFAULT NULL,
  `is_admin` bit(1) NOT NULL DEFAULT b'0'
) ENGINE=MyISAM DEFAULT CHARSET=cp1251;

-- --------------------------------------------------------

--
-- Дублирующая структура для представления `user_title_length`
-- (См. Ниже фактическое представление)
--
CREATE TABLE `user_title_length` (
`user_id` int(11)
,`note_len` decimal(37,0)
);

-- --------------------------------------------------------

--
-- Структура для представления `user_title_length`
--
DROP TABLE IF EXISTS `user_title_length`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_title_length`  AS SELECT `nt`.`user_id` AS `user_id`, sum(octet_length(`nt`.`title`) + case `nt`.`note_type` when 1 then octet_length(`sn`.`body`) when 2 then octet_length(`rn`.`description`) + octet_length(`rn`.`ingredients`) + octet_length(`rn`.`remarks`) when 3 then octet_length(`cn`.`surname`) + octet_length(`cn`.`name`) + octet_length(`cn`.`patronymic`) + octet_length(`cn`.`phone`) + octet_length(`cn`.`cityphone`) + octet_length(`cn`.`remarks`) when 4 then octet_length(`pun`.`description`) + octet_length(`pun`.`plan`) + octet_length(`pun`.`quote`) + octet_length(`pun`.`remarks`) else 0 end) AS `note_len` FROM ((((`note_title` `nt` left join `simple_note` `sn` on(`sn`.`note_id` = `nt`.`id`)) left join `recipe_note` `rn` on(`rn`.`note_id` = `nt`.`id`)) left join `contact_note` `cn` on(`cn`.`note_id` = `nt`.`id`)) left join `purpose_note` `pun` on(`pun`.`note_id` = `nt`.`id`)) GROUP BY `nt`.`user_id` ;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `contact_note`
--
ALTER TABLE `contact_note`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `note_tag`
--
ALTER TABLE `note_tag`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `note_title`
--
ALTER TABLE `note_title`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `purpose_note`
--
ALTER TABLE `purpose_note`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `recipe_note`
--
ALTER TABLE `recipe_note`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `simple_note`
--
ALTER TABLE `simple_note`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `body` (`body`);

--
-- Индексы таблицы `type_note`
--
ALTER TABLE `type_note`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `contact_note`
--
ALTER TABLE `contact_note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `note_tag`
--
ALTER TABLE `note_tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT для таблицы `note_title`
--
ALTER TABLE `note_title`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT для таблицы `photo`
--
ALTER TABLE `photo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT для таблицы `purpose_note`
--
ALTER TABLE `purpose_note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `recipe_note`
--
ALTER TABLE `recipe_note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `simple_note`
--
ALTER TABLE `simple_note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT для таблицы `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT для таблицы `type_note`
--
ALTER TABLE `type_note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
