DROP TABLE IF EXISTS "Users" CASCADE;
CREATE TABLE IF NOT EXISTS "Users" (
    "id" SERIAL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "passwordConfirm" VARCHAR(255) NOT NULL,
    "phoneNum" INTEGER,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("id")
);
DROP TABLE IF EXISTS "Cars" CASCADE;
CREATE TABLE IF NOT EXISTS "Cars" (
    "plateNum" VARCHAR(255),
    "color" VARCHAR(255),
    "UserId" INTEGER REFERENCES "Users" ("id") ON DELETE
    SET NULL ON UPDATE CASCADE,
        PRIMARY KEY ("plateNum")
);
DROP TABLE IF EXISTS "Employees" CASCADE;
CREATE TABLE IF NOT EXISTS "Employees" (
    "id" SERIAL,
    "name" VARCHAR(255),
    PRIMARY KEY ("id")
);
DROP TABLE IF EXISTS "Managers" CASCADE;
CREATE TABLE IF NOT EXISTS "Managers" (
    "id" SERIAL,
    "name" VARCHAR(255),
    PRIMARY KEY ("id")
);
DROP TABLE IF EXISTS "Services" CASCADE;
CREATE TABLE IF NOT EXISTS "Services" (
    "id" SERIAL,
    "type" VARCHAR(255),
    "stock" INTEGER,
    "details" VARCHAR(255),
    "name" VARCHAR(255),
    PRIMARY KEY ("id")
);
DROP TABLE IF EXISTS "Visits" CASCADE;
CREATE TABLE IF NOT EXISTS "Visits" (
    "id" SERIAL,
    "timeIn" TIMESTAMP WITH TIME ZONE,
    "timeOut" TIMESTAMP WITH TIME ZONE,
    "section" VARCHAR(255),
    "cost" FLOAT,
    "CarPlateNum" VARCHAR(255) REFERENCES "Cars" ("plateNum") ON DELETE
    SET NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);
DROP TABLE IF EXISTS "User_Issues" CASCADE;
CREATE TABLE IF NOT EXISTS "User_Issues" (
    "details" VARCHAR(255),
    "image" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "userId" INTEGER REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "issueId" INTEGER REFERENCES "Issues" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("userId", "issueId")
);
DROP TABLE IF EXISTS "User_Services" CASCADE;
CREATE TABLE IF NOT EXISTS "User_Services" (
    "id" SERIAL,
    "details" VARCHAR(255),
    "cost" FLOAT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "userId" INTEGER REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "serviceId" INTEGER REFERENCES "Services" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE ("userId", "serviceId"),
    PRIMARY KEY ("id")
);
DROP TABLE IF EXISTS "Issue_Employees" CASCADE;
CREATE TABLE IF NOT EXISTS "Issue_Employees" (
    "state" VARCHAR(255),
    "employeeId" INTEGER REFERENCES "Employees" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "issueId" INTEGER REFERENCES "Issues" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("employeeId", "issueId")
);
DROP TABLE IF EXISTS "user_role" CASCADE;
CREATE TABLE IF NOT EXISTS "user_role" (
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "roleId" INTEGER REFERENCES "Roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "user_id" INTEGER REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("roleId", "user_id")
);
CREATE TABLE IF NOT EXISTS "Roles" (
    "id" INTEGER,
    "name" VARCHAR(255),
    PRIMARY KEY ("id")
);
SELECT s.*
from public."ServiceTypes" sType
    join public."Services" s on sType.id = s."ServiceTypeId"
where sType.id = 1
SELECT *
from public."Visits"
SELECT *
from public."Cars"
SELECT *
from public."ServiceTypes"