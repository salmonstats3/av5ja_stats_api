-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "session_token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "npln_user_id" VARCHAR(20) NOT NULL,
    "nsa_id" VARCHAR(16) NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "thumbnail_url" VARCHAR(255) NOT NULL,
    "coral_user_id" BIGINT NOT NULL,
    "friend_code" VARCHAR(14),
    "language" VARCHAR(8),
    "country" VARCHAR(2),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("npln_user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_nsa_id_key" ON "accounts"("nsa_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_coral_user_id_key" ON "accounts"("coral_user_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
