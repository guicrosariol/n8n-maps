"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_fastify = __toESM(require("fastify"));
var import_apify_client = require("apify-client");
var import_config = require("dotenv/config");
var client = new import_apify_client.ApifyClient({
  token: process.env.APIFYAPI
});
var app = (0, import_fastify.default)();
app.get("/leads/:topic", async (request, reply) => {
  const { topic } = request.params;
  let leads = [];
  const input = {
    searchStringsArray: [topic],
    locationQuery: "Brasil",
    maxCrawledPlacesPerSearch: 10,
    language: "pt-BR",
    searchMatching: "all",
    website: "allPlaces",
    skipClosedPlaces: false,
    scrapePlaceDetailPage: true,
    scrapeContacts: true,
    scrapeReviewsPersonalData: false,
    includeWebResults: false,
    scrapeDirectories: false,
    scrapeImageAuthors: false,
    scrapeTableReservationProvider: false,
    placeMinimumStars: "",
    maxQuestions: 0,
    maximumLeadsEnrichmentRecords: 0,
    maxReviews: 0,
    reviewsSort: "newest",
    reviewsFilterString: "",
    reviewsOrigin: "all",
    allPlacesNoSearchAction: ""
  };
  const run = await client.actor("nwua9Gu5YrADL7ZDj").call(input);
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  leads = items.map((item) => ({
    nome: item.title,
    endereco: item.address,
    cidade: item.city,
    estado: item.state,
    telefone: item.phone ?? null,
    email: item.emails?.[0] ?? null,
    site: item.website ?? null,
    notaGoogle: item.totalScore,
    avaliacoes: item.reviewsCount,
    urlGoogleMaps: item.url
  }));
  console.log(leads);
  reply.status(200).send(leads);
});
app.listen({
  port: Number(process.env.PORT),
  host: "0.0.0.0"
}).then(() => {
  console.log("Server is running! \u{1F680}", Number(process.env.PORT));
});
