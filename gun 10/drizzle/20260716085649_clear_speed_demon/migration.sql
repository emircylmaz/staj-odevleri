CREATE TABLE `commits` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`message` text NOT NULL,
	`developer_id` integer NOT NULL,
	`merge_request_id` integer NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT `fk_commits_developer_id_developers_id_fk` FOREIGN KEY (`developer_id`) REFERENCES `developers`(`id`),
	CONSTRAINT `fk_commits_merge_request_id_merge_requests_id_fk` FOREIGN KEY (`merge_request_id`) REFERENCES `merge_requests`(`id`)
);
--> statement-breakpoint
CREATE TABLE `developers` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`team` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `merge_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`text` text NOT NULL,
	`developer.id` integer NOT NULL,
	`created_at` text NOT NULL,
	`merged_at` text,
	`status` text NOT NULL,
	CONSTRAINT `fk_merge_requests_developer.id_developers_id_fk` FOREIGN KEY (`developer.id`) REFERENCES `developers`(`id`)
);
