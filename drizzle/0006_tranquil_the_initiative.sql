CREATE TABLE `note_bookmarks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`note_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE cascade
);
