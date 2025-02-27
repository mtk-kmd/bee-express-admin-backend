-- CreateTable
CREATE TABLE "SenderInfo" (
    "sender_id" SERIAL NOT NULL,
    "sender_name" TEXT NOT NULL,
    "contact_number" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "package_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SenderInfo_pkey" PRIMARY KEY ("sender_id")
);

-- CreateTable
CREATE TABLE "ReceiverInfo" (
    "receiver_id" SERIAL NOT NULL,
    "receiver_name" TEXT NOT NULL,
    "contact_number" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "package_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReceiverInfo_pkey" PRIMARY KEY ("receiver_id")
);

-- CreateTable
CREATE TABLE "Package" (
    "package_id" SERIAL NOT NULL,
    "package_type_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("package_id")
);

-- CreateTable
CREATE TABLE "PackageType" (
    "package_type_id" SERIAL NOT NULL,
    "package_type_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageType_pkey" PRIMARY KEY ("package_type_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SenderInfo_package_id_key" ON "SenderInfo"("package_id");

-- CreateIndex
CREATE UNIQUE INDEX "SenderInfo_user_id_key" ON "SenderInfo"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ReceiverInfo_package_id_key" ON "ReceiverInfo"("package_id");

-- CreateIndex
CREATE UNIQUE INDEX "ReceiverInfo_user_id_key" ON "ReceiverInfo"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Package_package_type_id_key" ON "Package"("package_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "Package_user_id_key" ON "Package"("user_id");

-- AddForeignKey
ALTER TABLE "SenderInfo" ADD CONSTRAINT "SenderInfo_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("package_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SenderInfo" ADD CONSTRAINT "SenderInfo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiverInfo" ADD CONSTRAINT "ReceiverInfo_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("package_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiverInfo" ADD CONSTRAINT "ReceiverInfo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_package_type_id_fkey" FOREIGN KEY ("package_type_id") REFERENCES "PackageType"("package_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
