const xml2js = require('xml2js');
const fs = require('fs');
const mapSeries = require('async/mapSeries');
const { isDeepStrictEqual } = require('util');
const fetch = require('node-fetch');

const debug = require('debug')('app:cbp');

const { openDB, closeDB } = require('../../support/database');
const { getHTMLLean } = require('../../support/extract');
const { GaritaModel } = require('../model');
const config = require('../../../config');

function getVeicle(data) {
  const [standard] = data.standard_lanes;
  const [readyLane] = data.standard_lanes;
  const [sentri] = data.NEXUS_SENTRI_lanes;

  return {
    standard: {
      time: +standard.delay_minutes[0],
      lanes: +standard.lanes_open[0],
    },
    sentri: {
      time: +sentri.delay_minutes[0],
      lanes: +sentri.lanes_open[0],
    },
    readyLane: {
      time: +readyLane.delay_minutes[0],
      lanes: +readyLane.lanes_open[0],
    },
  };
}

function getPedestrian(data) {
  const [standard] = data.standard_lanes;
  const [readyLane] = data.ready_lanes;

  return {
    standard: {
      time: +standard.delay_minutes[0],
      lanes: +standard.lanes_open[0],
    },
    readyLane: {
      time: +readyLane.delay_minutes[0],
      lanes: +readyLane.lanes_open[0],
    },
  };
}

function transform(portId, data) {
  const response = data.border_wait_time.port
    .filter((item) => item.port_number[0] === portId)
    .map((item) => {
      const vehicle = getVeicle(item.passenger_vehicle_lanes[0]);
      const pedestrian = getPedestrian(item.pedestrian_lanes[0]);
      const report = {
        vehicle,
        pedestrian,
      };

      return report;
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

async function uploadAsset(city, payload) {
  const body = JSON.stringify({
    timestamp: new Date().toJSON(),
    report: payload.report,
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
  const latestTwoReports = await GaritaModel.find({ city }, { _id: 0, report: 1 })
    .sort({ createdAt: -1 })
    .limit(2);

  const [recent, previous] = latestTwoReports;

  const isEqual = isDeepStrictEqual(recent, previous);
  if (!isEqual) {
    await uploadAsset(city, recent);
    debug(`isEqual:${city}:${isEqual}`);
  }
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
        name: 'sanYsidro',
      }, {
        id: '250601',
        name: 'otay',
      }, {
        id: '250407',
        name: 'pedWest',
      }, {
        id: '250409',
        name: 'crossBorderExpress',
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
      report: ports.reduce((accu, port) => {
        accu[port.name] = transform(port.id, data); //eslint-disable-line

        return accu;
      }, {}),
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
