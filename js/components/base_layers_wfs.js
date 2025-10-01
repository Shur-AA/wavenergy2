import {Tile as TileLayer, Vector as VectorLayer, VectorTile as VectorTileLayer, Image, Group } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import GeoJSON from 'ol/format/GeoJSON';
import TileJSON from 'ol/source/TileJSON.js';
import OSM from 'ol/source/OSM';
import MVT from 'ol/format/MVT';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {Fill, Stroke, Icon, Style, Text, Circle} from 'ol/style';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileWMS from 'ol/source/TileWMS.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import * as olTilegrid from 'ol/tilegrid';
import {createXYZ} from 'ol/tilegrid';


import {getWidth, getTopLeft} from 'ol/extent';

var styles  = require('../appearence/styles');
var fun = require('./functions');
var colorbrewer = require('colorbrewer');

var epsg = 4326;

//var host = "localhost:8080/geoserver";
// var host2 = "autolab.geogr.msu.ru:8080/geoserver";
var host = process.env.GEOSERVER_URL;

function vector_source(host, name, epsg = 4326){
  return new VectorSource({
    format: new GeoJSON(),
    url: `${host}/wavenergy/ows?service=wfs&version=1.1.0&request=GetFeature&typename=${name}&outputFormat=application/json&srsname=EPSG:${epsg}`
  });
}

function wmstile_source(lyr){
  return new TileLayer({
    source: new TileWMS({
      url: `${process.env.GEOSERVER_URL}/wavenergy/wms?service=WMS`,
      params: {'LAYERS': 'wavenergy:' + lyr, 'TILED': true},
      serverType: 'geoserver',
      crossOrigin: 'anonymous',
      // projection: 'EPSG:4326'
    })
  });
}

// function wmstile_source(lyr, zmin, zmax){
//   return new TileLayer({
//     source: new TileWMS({
//       url: 'http://autolab.geogr.msu.ru/public/geoserver/wavenergy/wms?service=WMS',
//       params: {'LAYERS': 'wavenergy:' + lyr, 'TILED': true},
//       serverType: 'geoserver',
//       crossOrigin: 'anonymous',
//       // projection: 'EPSG:4326'
//     }),
//     maxZoom: zmin,
//     minZoom: zmax
//   });
// }



var wmsSource = new TileWMS({
  url: `${process.env.GEOSERVER_URL}/wavenergy/wms?service=WMS`,
  params: {'LAYERS': 'wavenergy:voronoy_ch', 'TILED': true},
  serverType: 'geoserver',
  crossOrigin: 'anonymous'
});
var wmsLayer = new TileLayer({
  source: wmsSource
});


// var coast110_lyr =  wmstile_source('base_110m_coastline', 1, 3);
// var coast50_lyr =  wmstile_source('base_110m_coastline', 3, 5);
// var coast10_lyr =  wmstile_source('base_110m_coastline', 5, 22);

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
var base110_lyr_group_top = new Group({
  combine: true,
  visible: true,
  maxZoom: 3,
  name: '110m',
  layers: [
    // wmstile_source('base_110m_coastline'),
    new VectorLayer({
      style: function(feature){
        name = feature.get('name_en');
        var style = styles.city_style(name);
        return style;
      },
      source: vector_source(host, 'wavenergy:base_110m_cities'),
      declutter: true
    }),
    new VectorLayer({
      style: styles.coastline_style(),
      source: vector_source(host, 'wavenergy:base_50m_coastline')
    })
  ]
});

var base110_lyr_group_bottom = new Group({
  combine: true,
  visible: true,
  maxZoom: 3,
  name: '110m',
  layers: [
    new VectorLayer({
      style: styles.russia_style(),
      source: vector_source(host, 'wavenergy:base_50m_russia')
    }),
    new VectorLayer({
      style: styles.country_style(),
      source: vector_source(host, 'wavenergy:base_50m_countries')
    })
  ]
});

var base50_lyr_group_top = new Group({
  combine: true,
  visible: true,
  minZoom: 3,
  maxZoom: 5,
  name: '50m',
  layers: [
    new VectorLayer({
      style: styles.river_style(),
      source: vector_source(host, 'wavenergy:base_50m_rivers')
    }),
    // wmstile_source('base_10m_coastline'),
    new VectorLayer({
      style: function(feature){
        name = feature.get('name_en');
        var style = styles.city_style(name);
        return style;
      },
      source: vector_source(host, 'wavenergy:base_110m_cities'),
      declutter: true
    }),
    new VectorLayer({
      style: styles.coastline_style(),
      source: vector_source(host, 'wavenergy:base_10m_coastline')
    })
  ]
});

var base50_lyr_group_bottom = new Group({
  combine: true,
  visible: true,
  minZoom: 3,
  maxZoom: 5,
  name: '50m',
  layers: [
    new VectorLayer({
      style: styles.russia_style(),
      source: vector_source(host, 'wavenergy:base_10m_russia')
    }),
    new VectorLayer({
      style: styles.country_style(),
      source: vector_source(host, 'wavenergy:base_10m_countries')
    })
  ]
});

var base10_lyr_group_top = new Group({
  combine: true,
  visible: true,
  minZoom: 5,
  name: '10m',
  layers: [
    // wmstile_source('base_10m_coastline'),
    // wmstile_source('base_10m_lakes'),
    new VectorLayer({
      style: styles.river_style(),
      source: vector_source(host, 'wavenergy:base_50m_rivers')
    }),
    new VectorLayer({
      style: styles.coastline_style(),
      source: vector_source(host, 'wavenergy:base_10m_coastline')
    }),
    new VectorLayer({
      style: styles.lake_style(),
      source: vector_source(host, 'wavenergy:base_10m_lakes')
    }),
    new VectorLayer({
      style: function(feature){
        name = feature.get('name_en');
        var style = styles.city_style(name);
        return style;
      },
      source: vector_source(host, 'wavenergy:base_50m_cities'),
      declutter: true
    }),
    new VectorLayer({
      style: function(feature){
        name = feature.get('name');
        var style = styles.port_style(name);
        return style;
      },
      source: vector_source(host, 'wavenergy:base_10m_ports'),
      declutter: true
    }),
  ]
});

var base10_lyr_group_bottom = new Group({
  combine: true,
  visible: true,
  minZoom: 5,
  name: '10m',
  layers: [
    new VectorLayer({
      style: styles.russia_style(),
      source: vector_source(host, 'wavenergy:base_10m_russia')
    }),
    new VectorLayer({
      style: styles.country_style(),
      source: vector_source(host, 'wavenergy:base_10m_countries')
    })
  ]
});

var gebco = new TileWMS({
  url: 'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
  params: {'LAYERS': 'GEBCO_LATEST', 'TILED': true},
  projection: 'EPSG:4326'
});
var gebco_lyr = new TileLayer({
  source: gebco,
});

var wmsSource = new TileWMS({
  url: 'http://localhost:8080/geoserver/wavenergy/wms?service=WMS',
  params: {'LAYERS': 'wavenergy:voronoy_ch', 'TILED': true},
  serverType: 'geoserver',
  crossOrigin: 'anonymous'
});
var VoronoyLayer = new TileLayer({
  source: wmsSource
});


module.exports = {
  base110_lyr_group_top,
  base50_lyr_group_top,
  base10_lyr_group_top,
  base110_lyr_group_bottom,
  base50_lyr_group_bottom,
  base10_lyr_group_bottom,
  gebco_lyr,
  VoronoyLayer
}