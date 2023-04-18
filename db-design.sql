-- diagram at https://dbdiagram.io/d/643e9bbc6b31947051cb37f3

CREATE TABLE "transactions" (
  "id" integer PRIMARY KEY,
  "account_id" integer,
  "address" text,
  "reciverAddress" text,
  "signiture" text,
  "publicKey" text,
  "amount" text,
  "deposit" boolean,
  "created_at" timestamp
);

CREATE TABLE "predictions" (
  "id" integer PRIMARY KEY,
  "account_id" integer,
  "future_date" timestamp,
  "expense" float,
  "created_at" timestamp
);

CREATE TABLE "accounts" (
  "id" integer PRIMARY KEY,
  "address" text,
  "publicKey" text,
  "balance" float,
  "currency" text,
  "created_at" timestamp
);

CREATE TABLE "businesses" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "discription" text,
  "account_id" integer,
  "status" varchar,
  "created_at" timestamp
);

ALTER TABLE "accounts" ADD FOREIGN KEY ("id") REFERENCES "businesses" ("account_id");

ALTER TABLE "accounts" ADD FOREIGN KEY ("id") REFERENCES "transactions" ("account_id");

ALTER TABLE "predictions" ADD FOREIGN KEY ("account_id") REFERENCES "accounts" ("id");
