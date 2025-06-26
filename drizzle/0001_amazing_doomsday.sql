CREATE TABLE `chats` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`prompt` text NOT NULL,
	`response` text NOT NULL,
	`prompt_time` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `daily_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`review_date` integer NOT NULL,
	`completed_tasks` integer DEFAULT 0 NOT NULL,
	`total_tasks` integer DEFAULT 0 NOT NULL,
	`reflection` text,
	`improvements` text,
	`productivity_score` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`categories` text NOT NULL,
	`created_at` integer NOT NULL,
	`modified_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`priority` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`due_date` integer,
	`scheduled_date` integer,
	`scheduled_start_time` text,
	`scheduled_end_time` text,
	`estimated_duration` integer,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`focus_session_duration` integer DEFAULT 90 NOT NULL,
	`break_duration` integer DEFAULT 20 NOT NULL,
	`work_start_time` text DEFAULT '09:00' NOT NULL,
	`work_end_time` text DEFAULT '17:00' NOT NULL,
	`peak_hours_start` text DEFAULT '10:00' NOT NULL,
	`peak_hours_end` text DEFAULT '12:00' NOT NULL,
	`pomodoro_enabled` integer DEFAULT false NOT NULL,
	`pomodoro_work_duration` integer DEFAULT 25 NOT NULL,
	`pomodoro_break_duration` integer DEFAULT 5 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_settings_user_id_unique` ON `user_settings` (`user_id`);