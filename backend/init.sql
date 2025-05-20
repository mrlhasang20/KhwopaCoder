-- First, create all ENUM types
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE "Status" AS ENUM ('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR');
CREATE TYPE "ActivityType" AS ENUM ('CHALLENGE_COMPLETED', 'BADGE_EARNED', 'RANK_UP', 'CHALLENGE_ATTEMPTED', 'STREAK');

-- Then create the tables
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "batch" VARCHAR(50) NOT NULL,
    "avatar" VARCHAR(255),
    "github" VARCHAR(255),
    "linkedin" VARCHAR(255),
    "points" INTEGER NOT NULL DEFAULT 0,
    "solved" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "last_active" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "user_settings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "achievement_notifications" BOOLEAN NOT NULL DEFAULT true,
    "weekly_digest" BOOLEAN NOT NULL DEFAULT false,
    "dark_mode" BOOLEAN NOT NULL DEFAULT true,
    "compact_view" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "challenges" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "points" INTEGER NOT NULL,
    "time_limit" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "test_cases" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "challenge_id" UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "submissions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "challenge_id" UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    "code" TEXT NOT NULL,
    "language" VARCHAR(50) NOT NULL,
    "status" "Status" NOT NULL,
    "runtime" INTEGER,
    "memory" INTEGER,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "badges" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "description" TEXT NOT NULL,
    "icon" VARCHAR(255) NOT NULL,
    "color" VARCHAR(50) NOT NULL,
    "criteria" TEXT NOT NULL
);

CREATE TABLE "user_badges" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "badge_id" UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    "earned_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

CREATE TABLE "activities" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "type" "ActivityType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
