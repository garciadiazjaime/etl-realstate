const mapSeries = require('async/mapSeries');
const { isDeepStrictEqual } = require('util');
const fetch = require('node-fetch');

const debug = require('debug')('app:cbp');

const { openDB, closeDB } = require('../../support/database');
const { GaritaModel } = require('../model');
const config = require('../../../config');

async function uploadAsset(city, payload) {
  const body = JSON.stringify({
    timestamp: new Date().toJSON(),
    report: {
      ...payload.report,
    },
  });

  await fetch(`${config.get('gcenter.url')}/report/static?city=${city}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
}

async function notifyUpdates(city) {
  const latestTwoReports = await GaritaModel.find(
    { city },
    { _id: 0, report: 1 },
  )
    .sort({ createdAt: -1 })
    .limit(2);

  const [recent, previous] = latestTwoReports;

  const isEqual = isDeepStrictEqual(recent, previous);
  if (!isEqual) {
    await uploadAsset(city, recent);
    debug(`notEqual:${city}`);
  }
}

async function getReportFixed(city, report) {
  if (city !== 'tijuana') {
    return report;
  }

  const { standard, sentri, readyLane } = report?.report?.sanYsidro?.vehicle || {};
  if (
    standard?.time !== 0
    || sentri?.time !== 0
    || readyLane?.time !== 0
  ) {
    return report;
  }

  const lastWeek = new Date(new Date() - 7 * 60 * 60 * 24 * 1000);
  const [lastWeekReport] = await GaritaModel.find({
    city,
    createdAt: { $lt: lastWeek },
  })
    .sort({ createdAt: -1 })
    .limit(1);

  const reportFixed = { ...report, label: 'fixed' };
  reportFixed.report.sanYsidro = {
    ...lastWeekReport.report.sanYsidro,
  };

  return reportFixed;
}

async function main(count = 0) {
  debug(`==== start:${count}`);

  const url = config.get('gcenter.lambda');

  const response = await fetch(url);
  const reports = await response.json();

  await mapSeries(reports, async (report) => {
    const { city } = report;

    const reportFixed = await getReportFixed(city, report);

    await new GaritaModel(reportFixed).save();

    await notifyUpdates(city);
  });

  debug(`==== end:${count}`);
}

if (require.main === module) {
  (async () => {
    await openDB();
    await main();
    await closeDB();
    debug('done');
  })();
} else {
  module.exports = main;
}
