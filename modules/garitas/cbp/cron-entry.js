const xml2js = require('xml2js');
const fs = require('fs');
const mapSeries = require('async/mapSeries');
const { isDeepStrictEqual } = require('util');

const debug = require('debug')('app:cbp');

const { openDB, closeDB } = require('../../support/database');
const { getHTMLLean } = require('../../support/extract');
const { GaritaModel } = require('../model');
const config = require('../../../config');

function getVeicle(data) {
  const [standard] = data.standard_lanes;
  const [readyLanes] = data.standard_lanes;
  const [sentry] = data.NEXUS_SENTRI_lanes;

  return {
    standard: {
      minutes: standard.delay_minutes[0],
      lanes: standard.lanes_open[0],
    },
    readyLanes: {
      minutes: readyLanes.delay_minutes[0],
      lanes: readyLanes.lanes_open[0],
    },
    sentry: {
      minutes: sentry.delay_minutes[0],
      lanes: sentry.lanes_open[0],
    },
  };
}

function getPedestrian(data) {
  const [standard] = data.standard_lanes;
  const [sentry] = data.ready_lanes;

  return {
    standard: {
      minutes: standard.delay_minutes[0],
      lanes: standard.lanes_open[0],
    },
    sentry: {
      minutes: sentry.delay_minutes[0],
      lanes: sentry.lanes_open[0],
    },
  };
}

function transform(port, data) {
  const { id, name } = port;

  const response = data.border_wait_time.port
    .filter((item) => item.port_number[0] === id)
    .map((item) => {
      const vehicle = getVeicle(item.passenger_vehicle_lanes[0]);
      const pedestrian = getPedestrian(item.pedestrian_lanes[0]);
      const report = {
        vehicle,
        pedestrian,
      };

      return {
        id,
        name,
        report,
      };
    });

  return response[0];
}

async function extract(url) {
  let html = '';

  if (config.get('env') === 'production') {
    html = await getHTMLLean(url);
  } else {
    html = fs.readFileSync(`${__dirname}/stub.html`);
  }

  return xml2js.parseStringPromise(html, { mergeAttrs: true });
}

function load(report) {
  return new GaritaModel(report).save();
}

async function notifyUpdates(city) {
  const latestTwoReports = await GaritaModel.find({ city }, { _id: 0, ports: 1 })
    .sort({ createdAt: -1 })
    .limit(2);

  const [recent, previous] = latestTwoReports;

  debug(`isEqual:${city}:${isDeepStrictEqual(recent, previous)}`);
}

async function main(count = 0) {
  debug(`==== start:${count}`);

  const url = 'https://bwt.cbp.gov/xml/bwt.xml';
  const data = await extract(url);

  const cities = [
    {
      city: 'tijuana',
      ports: [{
        id: '250401',
        name: 'San Ysidro',
      }, {
        id: '250601',
        name: 'Otay',
      }, {
        id: '250407',
        name: 'PedWest',
      }, {
        id: '250409',
        name: 'Cross Border Express',
      }],
    },
    {
      city: 'mexicali',
      ports: [{
        id: '250301',
        name: 'east',
      }, {
        id: '250302',
        name: 'west',
      }],
    },
  ];

  await mapSeries(cities, async (item) => {
    const { city, ports } = item;
    const report = {
      city,
      ports: ports.map((port) => transform(port, data)),
    };

    await load(report);

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
