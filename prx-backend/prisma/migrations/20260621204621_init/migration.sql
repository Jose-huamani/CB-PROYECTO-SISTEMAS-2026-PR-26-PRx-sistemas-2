-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(15) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('estandar', 'metaadministrador') NOT NULL DEFAULT 'estandar',
    `avatarUrl` VARCHAR(255) NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_email_status_idx`(`email`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `id` INTEGER UNSIGNED NOT NULL,
    `phoneCodeId` INTEGER UNSIGNED NULL,
    `countryId` TINYINT UNSIGNED NULL,
    `regionId` INTEGER UNSIGNED NULL,
    `townId` INTEGER UNSIGNED NULL,
    `isEmailVisible` BOOLEAN NOT NULL DEFAULT false,
    `firstName` VARCHAR(60) NULL,
    `lastName` VARCHAR(60) NULL,
    `secondLastName` VARCHAR(60) NULL,
    `biography` VARCHAR(2000) NULL,
    `phoneNumber` VARCHAR(20) NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    INDEX `Profile_phoneCodeId_idx`(`phoneCodeId`),
    INDEX `Profile_countryId_idx`(`countryId`),
    INDEX `Profile_regionId_idx`(`regionId`),
    INDEX `Profile_townId_idx`(`townId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Continent` (
    `id` TINYINT UNSIGNED NOT NULL,
    `name` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Country` (
    `id` TINYINT UNSIGNED NOT NULL,
    `continentId` TINYINT UNSIGNED NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,

    INDEX `Country_continentId_idx`(`continentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Region` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Town` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhoneCode` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `countryId` TINYINT UNSIGNED NOT NULL,
    `code` VARCHAR(6) NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,

    INDEX `PhoneCode_countryId_idx`(`countryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SocialNetwork` (
    `id` TINYINT UNSIGNED NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `baseUrl` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(100) NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfileSocialNetwork` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `profileId` INTEGER UNSIGNED NOT NULL,
    `socialNetworkId` TINYINT UNSIGNED NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    INDEX `ProfileSocialNetwork_profileId_idx`(`profileId`),
    INDEX `ProfileSocialNetwork_socialNetworkId_idx`(`socialNetworkId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,

    UNIQUE INDEX `Tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TagProfile` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `profileId` INTEGER UNSIGNED NOT NULL,
    `tagId` INTEGER UNSIGNED NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    INDEX `TagProfile_profileId_idx`(`profileId`),
    INDEX `TagProfile_tagId_idx`(`tagId`),
    UNIQUE INDEX `TagProfile_profileId_tagId_key`(`profileId`, `tagId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Binnacle` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(15) NOT NULL,
    `content` VARCHAR(2000) NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    INDEX `Binnacle_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Repository` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `repositoryCategoryId` INTEGER UNSIGNED NOT NULL,
    `ownerUserId` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `visibility` ENUM('publico', 'privado', 'intimo') NOT NULL DEFAULT 'privado',
    `color` CHAR(6) NOT NULL,
    `description` VARCHAR(1500) NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    INDEX `Repository_repositoryCategoryId_idx`(`repositoryCategoryId`),
    INDEX `Repository_ownerUserId_idx`(`ownerUserId`),
    INDEX `Repository_createdBy_idx`(`createdBy`),
    INDEX `Repository_updatedBy_idx`(`updatedBy`),
    INDEX `repository_owner_status_name_idx`(`ownerUserId`, `status`, `name`),
    INDEX `repository_owner_visibility_status_updated_idx`(`ownerUserId`, `visibility`, `status`, `updatedAt`, `id`),
    INDEX `repository_status_visibility_updated_idx`(`status`, `visibility`, `updatedAt`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepositoryCategory` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `RepositoryCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepositoryRole` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `description` VARCHAR(255) NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `RepositoryRole_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepositoryFunction` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `description` VARCHAR(255) NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `RepositoryFunction_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepositoryUser` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `repositoryId` INTEGER UNSIGNED NOT NULL,
    `userId` INTEGER UNSIGNED NOT NULL,
    `repositoryRoleId` INTEGER UNSIGNED NOT NULL,
    `repositoryFunctionId` INTEGER UNSIGNED NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    INDEX `RepositoryUser_repositoryId_idx`(`repositoryId`),
    INDEX `RepositoryUser_userId_idx`(`userId`),
    INDEX `RepositoryUser_repositoryRoleId_idx`(`repositoryRoleId`),
    INDEX `RepositoryUser_repositoryFunctionId_idx`(`repositoryFunctionId`),
    UNIQUE INDEX `RepositoryUser_repositoryId_userId_key`(`repositoryId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepositoryInvitation` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `repositoryId` INTEGER UNSIGNED NOT NULL,
    `senderUserId` INTEGER UNSIGNED NOT NULL,
    `invitedUserId` INTEGER UNSIGNED NOT NULL,
    `repositoryRoleId` INTEGER UNSIGNED NOT NULL,
    `repositoryFunctionId` INTEGER UNSIGNED NOT NULL,
    `invitationStatus` ENUM('pendiente', 'aceptada', 'rechazada', 'cancelada') NOT NULL DEFAULT 'pendiente',
    `welcomeMessage` VARCHAR(2000) NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    INDEX `RepositoryInvitation_repositoryId_idx`(`repositoryId`),
    INDEX `RepositoryInvitation_senderUserId_idx`(`senderUserId`),
    INDEX `RepositoryInvitation_invitedUserId_idx`(`invitedUserId`),
    INDEX `RepositoryInvitation_repositoryRoleId_idx`(`repositoryRoleId`),
    INDEX `RepositoryInvitation_repositoryFunctionId_idx`(`repositoryFunctionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `senderUserId` INTEGER UNSIGNED NOT NULL,
    `receiverUserId` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `type` ENUM('invitacion_repositorio') NOT NULL,
    `referenceId` INTEGER UNSIGNED NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `message` VARCHAR(2000) NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    INDEX `Notification_senderUserId_idx`(`senderUserId`),
    INDEX `Notification_receiverUserId_idx`(`receiverUserId`),
    INDEX `Notification_referenceId_idx`(`referenceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Folder` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `repositoryId` INTEGER UNSIGNED NOT NULL,
    `parentId` INTEGER UNSIGNED NULL,
    `name` VARCHAR(100) NOT NULL,
    `path` TEXT NOT NULL,
    `level` INTEGER UNSIGNED NOT NULL,
    `color` CHAR(6) NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    INDEX `Folder_repositoryId_idx`(`repositoryId`),
    INDEX `Folder_parentId_idx`(`parentId`),
    INDEX `Folder_createdBy_idx`(`createdBy`),
    INDEX `Folder_updatedBy_idx`(`updatedBy`),
    INDEX `folder_repo_parent_status_name_idx`(`repositoryId`, `parentId`, `status`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `repositoryId` INTEGER UNSIGNED NOT NULL,
    `folderId` INTEGER UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `extension` VARCHAR(10) NOT NULL,
    `mimeType` VARCHAR(100) NOT NULL,
    `size` INTEGER UNSIGNED NOT NULL,
    `storagePath` TEXT NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    INDEX `File_repositoryId_idx`(`repositoryId`),
    INDEX `File_folderId_idx`(`folderId`),
    INDEX `File_createdBy_idx`(`createdBy`),
    INDEX `File_updatedBy_idx`(`updatedBy`),
    INDEX `file_repo_folder_status_name_ext_idx`(`repositoryId`, `folderId`, `status`, `name`, `extension`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TagFile` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `fileId` INTEGER UNSIGNED NOT NULL,
    `tagId` INTEGER UNSIGNED NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    INDEX `TagFile_fileId_idx`(`fileId`),
    INDEX `TagFile_tagId_idx`(`tagId`),
    UNIQUE INDEX `TagFile_fileId_tagId_key`(`fileId`, `tagId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TagRepository` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `repositoryId` INTEGER UNSIGNED NOT NULL,
    `tagId` INTEGER UNSIGNED NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    INDEX `TagRepository_repositoryId_idx`(`repositoryId`),
    INDEX `TagRepository_tagId_idx`(`tagId`),
    UNIQUE INDEX `TagRepository_repositoryId_tagId_key`(`repositoryId`, `tagId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Note` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `repositoryId` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `content` TEXT NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    INDEX `Note_repositoryId_idx`(`repositoryId`),
    INDEX `Note_createdBy_idx`(`createdBy`),
    INDEX `Note_updatedBy_idx`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoteFile` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `noteId` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `storagePath` TEXT NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `updatedBy` INTEGER UNSIGNED NULL,

    INDEX `NoteFile_noteId_idx`(`noteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` CHAR(36) NOT NULL,
    `userId` INTEGER UNSIGNED NOT NULL,
    `userAgent` VARCHAR(255) NULL,
    `ipAddress` VARCHAR(45) NULL,
    `lastUsedAt` DATETIME(3) NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Session_userId_idx`(`userId`),
    INDEX `Session_revokedAt_idx`(`revokedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationCode` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `code` VARCHAR(6) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `VerificationCode_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordReset` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `code` VARCHAR(6) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PasswordReset_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` CHAR(36) NOT NULL,
    `sessionId` CHAR(36) NOT NULL,
    `token` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RefreshToken_sessionId_idx`(`sessionId`),
    INDEX `RefreshToken_revokedAt_idx`(`revokedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_phoneCodeId_fkey` FOREIGN KEY (`phoneCodeId`) REFERENCES `PhoneCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `Region`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_townId_fkey` FOREIGN KEY (`townId`) REFERENCES `Town`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Country` ADD CONSTRAINT `Country_continentId_fkey` FOREIGN KEY (`continentId`) REFERENCES `Continent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhoneCode` ADD CONSTRAINT `PhoneCode_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfileSocialNetwork` ADD CONSTRAINT `ProfileSocialNetwork_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfileSocialNetwork` ADD CONSTRAINT `ProfileSocialNetwork_socialNetworkId_fkey` FOREIGN KEY (`socialNetworkId`) REFERENCES `SocialNetwork`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TagProfile` ADD CONSTRAINT `TagProfile_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TagProfile` ADD CONSTRAINT `TagProfile_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Binnacle` ADD CONSTRAINT `Binnacle_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repository` ADD CONSTRAINT `Repository_repositoryCategoryId_fkey` FOREIGN KEY (`repositoryCategoryId`) REFERENCES `RepositoryCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repository` ADD CONSTRAINT `Repository_ownerUserId_fkey` FOREIGN KEY (`ownerUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repository` ADD CONSTRAINT `Repository_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repository` ADD CONSTRAINT `Repository_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepositoryUser` ADD CONSTRAINT `RepositoryUser_repositoryId_fkey` FOREIGN KEY (`repositoryId`) REFERENCES `Repository`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepositoryUser` ADD CONSTRAINT `RepositoryUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepositoryUser` ADD CONSTRAINT `RepositoryUser_repositoryRoleId_fkey` FOREIGN KEY (`repositoryRoleId`) REFERENCES `RepositoryRole`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepositoryUser` ADD CONSTRAINT `RepositoryUser_repositoryFunctionId_fkey` FOREIGN KEY (`repositoryFunctionId`) REFERENCES `RepositoryFunction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepositoryInvitation` ADD CONSTRAINT `RepositoryInvitation_repositoryId_fkey` FOREIGN KEY (`repositoryId`) REFERENCES `Repository`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepositoryInvitation` ADD CONSTRAINT `RepositoryInvitation_senderUserId_fkey` FOREIGN KEY (`senderUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepositoryInvitation` ADD CONSTRAINT `RepositoryInvitation_invitedUserId_fkey` FOREIGN KEY (`invitedUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepositoryInvitation` ADD CONSTRAINT `RepositoryInvitation_repositoryRoleId_fkey` FOREIGN KEY (`repositoryRoleId`) REFERENCES `RepositoryRole`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepositoryInvitation` ADD CONSTRAINT `RepositoryInvitation_repositoryFunctionId_fkey` FOREIGN KEY (`repositoryFunctionId`) REFERENCES `RepositoryFunction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_senderUserId_fkey` FOREIGN KEY (`senderUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_receiverUserId_fkey` FOREIGN KEY (`receiverUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_repositoryId_fkey` FOREIGN KEY (`repositoryId`) REFERENCES `Repository`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Folder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_repositoryId_fkey` FOREIGN KEY (`repositoryId`) REFERENCES `Repository`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TagFile` ADD CONSTRAINT `TagFile_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TagFile` ADD CONSTRAINT `TagFile_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TagRepository` ADD CONSTRAINT `TagRepository_repositoryId_fkey` FOREIGN KEY (`repositoryId`) REFERENCES `Repository`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TagRepository` ADD CONSTRAINT `TagRepository_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Note` ADD CONSTRAINT `Note_repositoryId_fkey` FOREIGN KEY (`repositoryId`) REFERENCES `Repository`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Note` ADD CONSTRAINT `Note_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Note` ADD CONSTRAINT `Note_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoteFile` ADD CONSTRAINT `NoteFile_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `Note`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
