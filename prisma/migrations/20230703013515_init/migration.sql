-- CreateTable
CREATE TABLE "user_role" (
    "id" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userRoleId" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stackId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "stack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_role_role_name_key" ON "user_role"("role_name");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_userRoleId_fkey" FOREIGN KEY ("userRoleId") REFERENCES "user_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stack" ADD CONSTRAINT "stack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
