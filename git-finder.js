#!/usr/bin/env node

// Import Packages
const axios = require("axios"); // promise-based HTTP library that let's you consume API service
const { program } = require("commander"); // command-line program

program
  .version("1.0.0")
  .option("-s, --start <date>", "Start date (YYYY-MM-DD) of date range")
  .option("-e, --end <date>", "End date (YYYY-MM-DD) of date range")
  .option("-l, --language <language>", "Filter by programming language")
  .parse(process.argv);

const { start, end, language } = program.opts();

// Prepare GitHub API Request
const baseUrl = "https://api.github.com/search/repositories"; // base url
const query = `stars:>1${language ? "language:${language}" : ""}`; // find repos with at least more than 1 star and filter by language

const startDate = start ? `${start}T00:00:00Z` : "1970-01-01T00:00:00Z"; // date + time
const endDate = end ? `${end}T23:59:59Z` : new Date().toISOString(); // ISO represents dates and times
const dateRange = `created:${startDate}..${endDate}`; // .. allows from date ranges in queries

const apiUrl = `${baseUrl}?q=${query}${dateRange}&sort=stars&order=desc`; // orders in descending order by stars

// Fetch Data from GitHub Search API
axios
  .get(apiUrl)
  .then((response) => {
    const projects = response.data.items;
    projects.forEach((project, index) => {
      console.log(
        `${index + 1}. ${project.name} - ${project.stargazers_count} stars` // +1 to make log more user friendly
      );
    });
  })
  .catch((error) => {
    console.error(`Error fetching data`, error.message);
  });
