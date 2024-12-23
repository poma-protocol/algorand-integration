CREATE TABLE "userPrizes" (
	"id" serial NOT NULL,
	"userAddress" text NOT NULL,
	"assetID" text NOT NULL,
	"amount" real NOT NULL,
	"paid" boolean DEFAULT false NOT NULL
);
